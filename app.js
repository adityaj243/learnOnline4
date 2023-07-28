const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------CONNECTING MONGODB---------------------------------------

const DB = process.env.MONGO_URL;

try {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected mongoose");
} catch (err) {
  console.log(err);
  console.log("its atlas connection error");
}

// mongoose.connect("mongodb://127.0.0.1:27017/mainUserDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//--------------------------SETUP FOR users COLLECTION-----------------------------------------------------------

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  userData: [
    {
      founderName: String,
      courseName: String,
      content: String,
      liked: {
        type: Boolean,
        default: false,
      },
      views: [{ type: String }],
      screenshots: [
        {
          link: String,
          pub_id: String,
        },
      ],
    },
  ],
});
const User = mongoose.model("User", userSchema);

//--------------------------SETUP FOR courses COLLECTION-----------------------------------------------------------

const courseSchema = new mongoose.Schema({
  username: String,
  courseName: String,
  totalLikes: {
    type: Number,
    default: 0,
  },
  totalViews: {
    type: Number,
    default: 0,
  },
  courseContent: [
    {
      tutorialName: String,
      tutorialLink: String,
      pubId: String,
      views: {
        type: Number,
        default: 0,
      },
    },
  ],
});
const Course = mongoose.model("Course", courseSchema);

//--------------------------POSTS-----------------------------------------------------------

function verifyJWT(req, res, next) {
  // VERIFYING TOKEN
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("we need a token first");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.send({ auth: false, message: "you failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}

app.post("/islogged", verifyJWT, async (req, res) => {
  //  TO CHECK WHETHER USER IS LOGGED IN OR NOT
  const gotUsername = req.body.urlUsername;
  const token = req.headers["x-access-token"];
  const val = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const oldUser = await User.findOne({ _id: val.id });
    if (gotUsername === oldUser.username) {
      res.send({ auth: true });
    } else {
      res.send({ auth: false });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/isUserAuth", verifyJWT, async (req, res) => {
  const token = req.headers["x-access-token"];
  const val = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const oldUser = await User.findOne({ _id: val.id });
    res.send({ auth: true, username: oldUser.username });
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async (req, res) => {
  // FROM REGISTER PAGE
  const userName = req.body.username;
  const passWord = req.body.password;

  const oldUser = await User.findOne({ username: userName });

  if (oldUser) {
    res.send("Username already exist");
  } else {
    const hash = await bcrypt.hash(passWord, 4);
    const newUser = new User({
      username: userName,
      password: hash,
      userData: [],
    });
    newUser.save();
    res.send("SUCCESSFULLY REGISTERED !");
  }
});

app.post("/login", async (req, res) => {
  // FROM LOGIN PAGE
  const userName = req.body.username;
  const passWord = req.body.password;
  // console.log(req.body);

  const oldUser = await User.findOne({ username: userName });
  // console.log(oldUser);
  if (oldUser) {
    const match = await bcrypt.compare(passWord, oldUser.password);
    if (match) {
      const id = oldUser.id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      res.send({ auth: true, token: token, username: userName });
    } else {
      res.send({ auth: false });
    }
  } else {
    res.send({ auth: false });
  }
});

app.post(
  "/save/notes/:username/:crname/:vidname/:foundername",
  async (req, res) => {
    // FROM NOTE PAGE TO SAVE NOTE CONTENT
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;
    const content = req.body.content;

    try {
      await User.updateOne(
        {
          username: userName,
          userData: {
            $elemMatch: {
              founderName: foundername,
              courseName: crname,
            },
          },
        },
        { $set: { "userData.$.content": content } }
      );
      res.send("Successfully posted notes");
    } catch (err) {
      console.log(err);
      res.send("error in backend post save notes");
    }
  }
);

app.post("/insert/:username", async (req, res) => {
  // FROM INSERT PAGE FOR UPLOADING VIDEOS
  const username = req.body.username;
  const { nameOfCourse, videoNames, links, pub_id } = req.body;
  // console.log("reqbody:");
  // console.log(req.body);
  // const obj={                      //req.body
  //   nameOfCourse: courseName,
  //   videoNames: videoNames,
  //   links: links
  // }
  let courseContentArray = [];
  for (let i = 0; i < links.length; i++) {
    const singleVideoDetails = {
      tutorialName: videoNames[i],
      tutorialLink: links[i],
      pubId: pub_id[i],
      views: 0,
    };
    courseContentArray.push(singleVideoDetails);
  }
  // console.log("courseContentArray:");
  // console.log(courseContentArray);

  try {
    const courseForInsersion = new Course({
      username: username,
      courseName: nameOfCourse,
      totalLikes: 0,
      totalViews: 0,
      courseContent: courseContentArray,
    });
    await courseForInsersion.save();
    res.send("Successfully inserted");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post("/deleteCloudinaryVideo", async (req, res) => {
  //DELETING VIDEO FROM DATABASE
  const pub = req.body.pub;
  console.log("pubid: ", pub);
  try {
    cloudinary.v2.uploader
      .destroy(pub, { resource_type: "video" })
      .then((resp) => {
        console.log("sux del-------", resp);
      })
      .catch((_err) =>
        console.log("Something went wrong, please try again later.")
      );
    res.send("successfully deleted cloud vid");
  } catch (err) {
    console.log(err);
    res.send("cannot del");
  }
});

app.post(
  "/image/upload/:username/:crname/:vidname/:foundername",
  async (req, res) => {
    // FROM PLAY PAGE TO UPLOAD A SCREENSHOT
    const userName = req.body.username;
    const crname = req.body.coursename;
    // const vidname = req.params.vidname;
    const foundername = req.body.foundername;
    // const imageData = req.files.imageDetails;
    const { link, pub } = req.body;

    try {
    } catch (err) {
      console.log("image post error:");
      console.log(err);
    }
    await User.updateOne(
      {
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: crname,
          },
        },
      },
      { $push: { "userData.$.screenshots": { link: link, pub_id: pub } } }
    );
    // await User.updateOne(
    //   {
    //     username: userName,
    //     "userData.courseName": crname,
    //     "userData.videoName": vidname,
    //   },
    //   { $push: { "userData.$.screenshots": imageData[0].path } }
    // );
    res.send("image recieved");
  }
);

app.post("/update/delete/course/:username/:crname", async (req, res) => {
  //FROM UPDATE PAGE FOR DELETING COURSE
  const userName = req.body.username;
  const crname = req.body.coursename;
  try {
    const deletedCourse = await Course.findOneAndDelete({
      username: userName,
      courseName: crname,
    });
    const coursecontent = deletedCourse.courseContent;

    for (let i = 0; i < coursecontent.length; i++) {
      let id = coursecontent[i].pubId;

      cloudinary.v2.uploader
        .destroy(id, { resource_type: "video" })
        .then((resp) => {
          console.log("destroy update course video", resp);
        })
        .catch((_err) =>
          console.log("Something went wrong, please try again later.")
        );
    }

    // await User.updateMany(           **uncommenting deletes the course details from userdata also
    //   {
    //     userData: { $elemMatch: { founderName: userName, courseName: crname } },
    //   },
    //   {
    //     $pull: {
    //       userData: {
    //         $elemMatch: { founderName: userName, courseName: crname },
    //       },
    //     },
    //   }
    // );

    res.send("Course deleted Successfully");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post(
  "/update/delete/video/:username/:crname/:vidname", // FROM DELETE COURSE PAGE TO DELETE A SPECIFIC VIDEO
  async (req, res) => {
    const userName = req.body.username;
    const crname = req.body.coursename;
    const vidname = req.body.videoname;
    try {
      const targetCourse = await Course.findOneAndUpdate(
        { username: userName, courseName: crname },
        { $pull: { courseContent: { tutorialName: vidname } } }
      );
      const coursecontent = targetCourse.courseContent;
      const foundVideoDetails = coursecontent.find((single) => {
        return single.tutorialName === vidname;
      });
      const id = foundVideoDetails.pubId;

      cloudinary.v2.uploader
        .destroy(id, { resource_type: "video" })
        .then((resp) => {
          console.log("destroy update course video", resp);
        })
        .catch((_err) =>
          console.log("Something went wrong, please try again later.")
        );

      // var path = foundVideoDetails.tutorialLink;
      // var path2 = path.replace(/\\/g, "/");

      // await User.updateMany(                 **uncommenting deletes the course details from userdata also
      //   {
      //     "userData.courseName": crname,
      //     "userData.videoName": vidname,
      //   },
      //   { $pull: { userData: { courseName: crname, videoName: vidname } } }
      // );
      res.send("deleted video successfully");
    } catch (err) {
      console.log(err);
    }
  }
);

app.post(
  "/delete/screenshot/:username/:crname/founder/:foundername", // TO DELETE SCREENSHOTS
  async (req, res) => {
    // const deleteObj = {
    //   username: username,
    //   foundername: founderName,
    //   coursename: courseName,
    //   link: path,
    // };
    const deleteObj = req.body;
    const userName = deleteObj.username;
    const founderName = deleteObj.foundername;
    const crname = deleteObj.coursename;
    // const link = deleteObj.link; //"public/images/1685568243048my-screenshot.png"

    const exactpath = deleteObj.exactpath;
    try {
      await User.updateOne(
        {
          username: userName,
          userData: {
            $elemMatch: { founderName: founderName, courseName: crname },
          },
        },
        { $pull: { "userData.$.screenshots": { pub_id: exactpath } } }
      );

      cloudinary.v2.uploader
        .destroy(exactpath, function (result) {
          console.log(result);
        })
        .then((resp) => {
          console.log("sux del-------", resp);
        })
        .catch((_err) =>
          console.log("Something went wrong, please try again later.")
        );
      // try {
      //   fs.unlinkSync("./" + link);
      // } catch (err) {
      //   console.log(err);
      // }
      res.send("successfully removed screenshot");
    } catch (err) {
      console.log(err);
      res.send("error in removing screenshot");
    }
  }
);

app.post("/save/notes/:username/:crname/:foundername", async (req, res) => {
  // FROM MY CONTENT NOTES PAGE TO SAVE NOTE CONTENT
  const userName = req.body.username;
  const crname = req.body.coursename;
  const foundername = req.body.foundername;
  const content = req.body.content;

  try {
    await User.updateOne(
      {
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: crname,
          },
        },
      },
      { $set: { "userData.$.content": content } }
    );
    res.send("Successfully posted notes");
  } catch (err) {
    console.log(err);
    res.send("error in backend save notes post");
  }
});

//--------------------------GETS-----------------------------------------------------------

app.get("/home/:username", async (req, res) => {
  // FROM HOME PAGE TO GET NAME OF COURSES AVAILABLE
  try {
    const courses = await Course.find().sort({ totalViews: "descending" });
    res.send(courses);
  } catch (err) {
    console.log(err);
  }
});

app.post("/course/:username/:crname/founder/:foundername", async (req, res) => {
  // FROM COURSE PAGE TO GET VIDEONAMES OF VIDEOS INSIDE THAT COURSE
  const foundername = req.body.foundername;
  const corName = req.body.coursename;
  const userName = req.body.username;
  try {
    const selectedCourse = await Course.findOne({
      username: foundername,
      courseName: corName,
    });
    const found = await User.findOne({
      username: userName,
      userData: {
        $elemMatch: {
          founderName: foundername,
          courseName: corName,
          liked: true,
        },
      },
    });
    let liked;
    if (!found) {
      liked = false;
    } else {
      liked = true;
    }
    res.send({
      courses: selectedCourse,
      liked: liked,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/like/:username/:crname/founder/:foundername", async (req, res) => {
  // FROM COURSE PAGE TO GET VIDEONAMES OF VIDEOS INSIDE THAT COURSE
  const foundername = req.body.foundername;
  const corName = req.body.coursename;
  const userName = req.body.username;
  try {
    const found = await User.findOne({
      username: userName,
      userData: {
        $elemMatch: {
          founderName: foundername,
          courseName: corName,
        },
      },
    });

    if (!found) {
      const newUserDataElement = {
        founderName: foundername,
        courseName: corName,
        content: "",
        liked: true,
        views: [],
        screenshots: [],
      };
      await User.updateOne(
        { username: userName },
        { $push: { userData: newUserDataElement } }
      );

      await Course.updateOne(
        {
          username: foundername,
          courseName: corName,
        },
        { $inc: { totalLikes: 1 } }
      );
    } else {
      // const userdata=found.userData;
      // const userdataElement=userdata.find((single)=>{
      //   return (single.founderName===foundername && single.courseName===corName);
      // });

      // const liked=userdataElement.liked;

      // if(!liked){
      await User.updateOne(
        {
          username: userName,
          userData: {
            $elemMatch: {
              founderName: foundername,
              courseName: corName,
            },
          },
        },
        { $set: { "userData.$.liked": "true" } }
      );

      await Course.updateOne(
        {
          username: foundername,
          courseName: corName,
        },
        { $inc: { totalLikes: 1 } }
      );
      // }
    }
    res.send("liked");
  } catch (err) {
    console.log(err);
  }
});

app.post("/unlike/:username/:crname/founder/:foundername", async (req, res) => {
  // FROM COURSE PAGE TO GET VIDEONAMES OF VIDEOS INSIDE THAT COURSE
  const foundername = req.body.foundername;
  const corName = req.body.coursename;
  const userName = req.body.username;
  try {
    await User.updateOne(
      {
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: corName,
          },
        },
      },
      { $set: { "userData.$.liked": "false" } }
    );

    await Course.updateOne(
      {
        username: foundername,
        courseName: corName,
      },
      { $inc: { totalLikes: -1 } }
    );
    res.send("unliked");
  } catch (err) {
    console.log(err);
  }
});

// const courseSchema = new mongoose.Schema({
//   username: String,
//   courseName: String,
//   totalLikes:Number,
//   totalViews:Number,
//   courseContent: [
//     {
//       tutorialName: String,
//       tutorialLink: String,
//       pubId: String,
//       views: Number,
//     },
//   ],
// });

app.post(
  "/get/notes/:username/:crname/:vidname/:foundername", //FROM NOTES PAGE TO GET NOTE CONTENT
  async (req, res) => {
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;

    try {
      const selectedUserData = await User.findOne({
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: crname,
          },
        },
      });
      if (selectedUserData) {
        console.log("user found Notes get req backend");
        const noteContentArray = selectedUserData.userData;
        let desiredUserData = noteContentArray.find((single) => {
          return (
            single.founderName === foundername && single.courseName === crname
          );
        });
        res.send(desiredUserData.content);
      } else {
        console.log("user not found Notes get req backend");
        // const courseDetail = await Course.findOne({
        //   founderName: foundername,
        //   courseName: crname,
        // });
        // const courseVidnameAndLinkArray = courseDetail.courseContent;
        // const videoDetail = courseVidnameAndLinkArray.find((single) => {
        //   return single.tutorialName === vidname;
        // });
        const newUserDataElement = {
          founderName: foundername,
          courseName: crname,
          content: "",
          liked: false,
          views: [],
          screenshots: [],
        };
        await User.updateOne(
          { username: userName },
          { $push: { userData: newUserDataElement } }
        );
        res.send(newUserDataElement.content);
      }
    } catch (err) {
      console.log(err);
      res.send("fir wahi baat");
    }
  }
);

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   userData: [
//     {
//       founderName: String,
//       courseName: String,
//       content: String,
//       liked: {
//         type:Boolean,
//         default:false,
//       },
//       screenshots: [
//         {
//           link: String,
//           pub_id: String,
//         },
//       ],
//     },
//   ],
// });

app.post(
  "/course/:username/:crname/:vidname/founder/:foundername",
  async (req, res) => {
    //FROM PLAY PAGE TO GET VIDEO LINK TO PLAY*************************
    const userName = req.body.username;
    const crname = req.body.coursename;
    const vidname = req.body.videoname;
    const foundername = req.body.foundername;
    try {
      const courseDetail = await Course.findOne({
        username: foundername,
        courseName: crname,
      });
      const courseVidnameAndLinkArray = courseDetail.courseContent;
      const videoDetail = courseVidnameAndLinkArray.find((single) => {
        return single.tutorialName === vidname;
      });

      // const found=await User.findOne({
      //   username: userName,
      //   userData: {
      //     $elemMatch: {
      //       founderName: foundername,
      //       courseName: crname,
      //       views: videoDetail.tutorialName,
      //     },
      //   },
      // });

      // if(!found){
      //   await User.updateOne({
      //     username: userName,
      //     userData: {
      //       $elemMatch: {
      //         founderName: foundername,
      //         courseName: crname,
      //       },
      //     },
      //   },{ $push: { "userData.views": videoDetail.tutorialName } });

      //   await Course.updateOne({
      //     username: foundername,
      //     courseName: crname,
      //     courseContent:{
      //       $elemMatch:{
      //         tutorialName:vidname,
      //         tutorialLink:videoDetail.tutorialLink,
      //       }
      //     }
      //   },{ $inc: { totalViews: 1, "courseContent.views":1}});

      // }

      res.send({ link: videoDetail.tutorialLink });
    } catch (err) {
      console.log(err);
    }
  }
);

app.post(
  "/views/:username/:crname/:vidname/founder/:foundername",
  async (req, res) => {
    //FROM PLAY PAGE TO GET VIDEO LINK TO PLAY*************************
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;
    const videoname = req.body.videoname;
    try {
      // const courseDetail = await Course.findOne({
      //   username: foundername,
      //   courseName: crname,
      // });
      // const courseVidnameAndLinkArray = courseDetail.courseContent;
      // const videoDetail = courseVidnameAndLinkArray.find((single) => {
      //   return single.tutorialName === vidname;
      // });

      const found = await User.findOne({
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: crname,
            views: { $in: [videoname] },
          },
        },
      });

      if (!found) {
        await User.updateOne(
          {
            username: userName,
            userData: {
              $elemMatch: {
                founderName: foundername,
                courseName: crname,
              },
            },
          },
          { $push: { "userData.$.views": videoname } }
        );

        await Course.updateOne(
          {
            username: foundername,
            courseName: crname,
            courseContent: {
              $elemMatch: {
                tutorialName: videoname,
                // tutorialLink:videoDetail.tutorialLink,
              },
            },
          },
          { $inc: { totalViews: 1, "courseContent.$.views": 1 } }
        );
      }
      res.send("viewed");
    } catch (err) {
      console.log(err);
    }
  }
);

// const courseSchema = new mongoose.Schema({
//   username: String,
//   courseName: String,
//   totalLikes:{
//     type:Number,
//     default:0,
//   },
//   totalViews:{
//     type:Number,
//     default:0,
//   },
//   courseContent: [
//     {
//       tutorialName: String,
//       tutorialLink: String,
//       pubId: String,
//       views: {
//         type:Number,
//         default:0,
//       },
//     },
//   ],
// });

app.post(
  "/image/get/:username/:crname/:vidname/:foundername",
  async (req, res) => {
    // FROM PLAY PAGE TO SEND THE USERDATA RELATED TO SPECIFIC COURSE AND VIDEO FOR EXTRACTING SCREENSHOTS ARRAY
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;
    try {
      const user = await User.findOne({ username: userName });
      const userData = user.userData;
      const desiredUserData = userData.find((single) => {
        return (
          single.founderName == foundername && single.courseName === crname
        );
      });
      res.send(desiredUserData);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

app.post("/update/:username", async (req, res) => {
  // FROM UPDATE PAGE TO GET NAME OF COURSES RELATED TO THAT USER*********
  const userName = req.body.username;
  try {
    const courses = await Course.find({ username: userName });
    res.send(courses);
  } catch (err) {
    console.log(err);
  }
});

app.post("/update/:username/:crname", async (req, res) => {
  // FROM UPDATE COURSE PAGE TO GET VIDEONAMES OF VIDEOS INSIDE THAT COURSE
  const corName = req.body.coursename;
  const username = req.body.username;
  try {
    const selectedCourse = await Course.findOne({
      username: username,
      courseName: corName,
    });
    res.send(selectedCourse);
  } catch (err) {
    console.log(err);
  }
});

app.post("/mycontent/:username", async (req, res) => {
  // FROM MY CONTENT PAGE TO GET CONTENT OF USER NOTES ANS SCREENSHOTS
  const userName = req.body.username;
  try {
    const user = await User.findOne({
      username: userName,
    });
    const userdata = user.userData;
    let Courses = [];

    for (let i = 0; i < userdata.length; i++) {
      if (userdata[i].content !== "" || userdata[i].screenshots.length !== 0) {
        Courses.push(userdata[i]);
      }
    }

    // console.log(Courses);
    res.send({ courses: Courses });
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/mycontent/notes/:username/:crname/:foundername",
  async (req, res) => {
    //FROM MY CONTENT NOTES PAGE TO GET NOTE CONTENT
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;

    try {
      const selectedUserData = await User.findOne({
        username: userName,
        userData: {
          $elemMatch: {
            founderName: foundername,
            courseName: crname,
          },
        },
      });
      if (selectedUserData) {
        console.log("user found my content Notes get req backend");
        const noteContentArray = selectedUserData.userData;
        let desiredUserData = noteContentArray.find((single) => {
          return (
            single.founderName === foundername && single.courseName === crname
          );
        });
        res.send(desiredUserData.content);
      } else {
        console.log("user not found my content Notes get req backend");
        const newUserDataElement = {
          founderName: foundername,
          courseName: crname,
          content: "",
          liked: false,
          views: [],
          screenshots: [],
        };
        await User.updateOne(
          { username: userName },
          { $push: { userData: newUserDataElement } }
        );
        res.send(newUserDataElement.content);
      }
    } catch (err) {
      console.log(err);
      res.send("fir wahi baat");
    }
  }
);

app.post(
  "/mycontent/screenshots/:username/:crname/founder/:foundername", //FROM MY CONTENT SLIDESHOW PAGE TO GET SCREENSHOTS
  async (req, res) => {
    const userName = req.body.username;
    const crname = req.body.coursename;
    const foundername = req.body.foundername;
    try {
      const user = await User.findOne({ username: userName });
      const userData = user.userData;
      const desiredUserData = userData.find((single) => {
        return (
          single.founderName == foundername && single.courseName === crname
        );
      });
      res.send(desiredUserData);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

// app.get("/update", async (req, res) => {
//   try {
//     fs.unlinkSync("./public/videos/1685390873761tut2.mp4");
//   } catch (err) {
//     console.log(err);
//   }
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

app.listen(8000, function () {
  console.log("Server started on port 8000");
});
