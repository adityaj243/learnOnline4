import React, { useEffect, useState } from "react";
import "../styles.css";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Videocard from "./Videocard";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import MenuIcon from "@mui/icons-material/Menu";

function Course() {
  // const location = useLocation();
  const history = useHistory();
  // const path = location.pathname;
  const username = localStorage.getItem("username"); //username is requires same as url of current page
  const coursename = localStorage.getItem("coursename");
  const foundername = localStorage.getItem("foundername");
  const backObj = {
    username: username,
    coursename: coursename,
    foundername: foundername,
  };
  const url =
    "/course/" + username + "/" + coursename + "/founder/" + foundername; //"/course/:username/:crname/founder/:founderName"
  // const url = "" + path;     //"/course/:username/:crname/founder/:founderName"

  //-------------function to get username--------------
  // function getUsername(path) {
  //   for (var i = 8; i < path.length; i++) {
  //     if (path[i] === "/") {
  //       return path.substring(8, i);
  //     }
  //   }
  // }
  // const username = getUsername(path); //username is requires same as url of current page
  const [courseDetails, setCourseDetails] = useState({});
  const [likeStatus, setLikeStatus] = useState(false);
  const [showLeftDiv, setShowLeftDiv] = useState(false);

  const handleToggleClick = () => {
    setShowLeftDiv(!showLeftDiv);
  };

  async function isLogged() {
    const logginObj = {
      urlUsername: username,
    };
    try {
      const response = await axios.post("/islogged", logginObj, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (!response.data.auth) {
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  //--------------------------------------------------------

  const getUser = async function () {
    const response = await axios.post(url, backObj);
    // console.log("course:");
    // console.log(response.data);
    try {
      setCourseDetails(response.data.courses);
      setLikeStatus(response.data.liked);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    isLogged();
    getUser();
    // eslint-disable-next-line
  }, []);

  function element(single, index) {
    return (
      <Videocard
        userName={username}
        corrName={courseDetails.courseName}
        nameOfVideo={single.tutorialName}
        founder={courseDetails.username}
        key={index}
        views={courseDetails.courseContent[index].views}
      />
    );
  }

  async function addLike() {
    const likeURL =
      "/like/" + username + "/" + coursename + "/founder/" + foundername;
    try {
      setLikeStatus(true);
      const response = await axios.post(likeURL, backObj);
      alert(response.data);
    } catch (err) {
      console.log("addlike error at course page", err);
    }
  }

  async function unLike() {
    const unlikeURL =
      "/unlike/" + username + "/" + coursename + "/founder/" + foundername;
    try {
      setLikeStatus(false);
      const response = await axios.post(unlikeURL, backObj);
      alert(response.data);
    } catch (err) {
      console.log("unlike error at course page", err);
    }
  }

  return (
    <div className="mainCourseDiv">
      <div className={`${showLeftDiv ? "show" : "courseLeftDiv"}`}>
        <div className="teacherPhotoDiv">
          <img
            src="/pictures/usericon4.png"
            width="100"
            height="100"
            alt="teacher icon"
            className="courseTeacherIcon"
          />
          <h3 className="techerName">{courseDetails.username}</h3>
        </div>
        <div className="courseLeftButtonDiv">
          <div className="courseruler"></div>
          <div className="courseLeftButtonContainer">
            <button
              className="courseLeftButton"
              onClick={() => {
                history.push("/home/" + username);
              }}
            >
              HOME
            </button>
            <button
              className="courseLeftButton"
              onClick={() => {
                history.push("/update/" + username);
              }}
            >
              MY COURSES
            </button>
            <button
              className="courseLeftButton"
              onClick={() => {
                history.push(
                  "/mycontent/notes/" +
                    username +
                    "/" +
                    courseDetails.courseName +
                    "/founder/" +
                    courseDetails.username
                );
              }}
            >
              NOTES
            </button>
            <button
              className="courseLeftButton"
              onClick={() => {
                history.push(
                  "/mycontent/screenshots/" +
                    username +
                    "/" +
                    courseDetails.courseName +
                    "/founder/" +
                    courseDetails.username
                );
              }}
            >
              SCREENSHOTS
            </button>
          </div>
        </div>
      </div>

      <div className="courseRightDiv">
        {likeStatus === false ? (
          <button className="courseLikeBtn" onClick={addLike}>
            <ThumbUpOutlinedIcon></ThumbUpOutlinedIcon>like
          </button>
        ) : (
          <button className="courseLikeBtn" onClick={unLike}>
            <ThumbDownOffAltOutlinedIcon></ThumbDownOffAltOutlinedIcon>unlike
          </button>
        )}
        <div className="courseUpperDiv">
          <div className="toggleButton" onClick={handleToggleClick}>
            <MenuIcon />
          </div>
          <h1>{courseDetails.courseName}</h1>
        </div>

        <div className="courseVideoList">
          {courseDetails.courseContent &&
            courseDetails.courseContent.map(element)}
        </div>

        {/* <div className="courseLowerDiv">
          <p>Copyrights©️2023</p>
          <p>~Aditya Joshi</p>
        </div> */}
      </div>
    </div>
  );
}

export default Course;

// import React, { useEffect, useState } from "react";
// import "../styles.css";
// import axios from "axios";
// import { useLocation, useHistory } from "react-router-dom";
// import Videocard from "./Videocard";
// import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
// import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";

// function Course() {
//   // const location = useLocation();
//   const history = useHistory();
//   // const path = location.pathname;
//   const username = localStorage.getItem("username"); //username is requires same as url of current page
//   const coursename = localStorage.getItem("coursename");
//   const foundername = localStorage.getItem("foundername");
//   const backObj = {
//     username: username,
//     coursename: coursename,
//     foundername: foundername,
//   };
//   const url =
//     "/course/" +
//     username +
//     "/" +
//     coursename +
//     "/founder/" +
//     foundername; //"/course/:username/:crname/founder/:founderName"
//   // const url = "" + path;     //"/course/:username/:crname/founder/:founderName"

//   //-------------function to get username--------------
//   // function getUsername(path) {
//   //   for (var i = 8; i < path.length; i++) {
//   //     if (path[i] === "/") {
//   //       return path.substring(8, i);
//   //     }
//   //   }
//   // }
//   // const username = getUsername(path); //username is requires same as url of current page
//   const [courseDetails, setCourseDetails] = useState({});
//   const [likeStatus, setLikeStatus] = useState(false);

//   async function isLogged() {
//     const logginObj = {
//       urlUsername: username,
//     };
//     try {
//       const response = await axios.post(
//         "/islogged",
//         logginObj,
//         {
//           headers: {
//             "x-access-token": localStorage.getItem("token"),
//           },
//         }
//       );
//       if (!response.data.auth) {
//         history.push("/");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   //--------------------------------------------------------

//   const getUser = async function () {
//     const response = await axios.post(url, backObj);
//     // console.log("course:");
//     // console.log(response.data);
//     try {
//       setCourseDetails(response.data.courses);
//       setLikeStatus(response.data.liked);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     isLogged();
//     getUser();
//     // eslint-disable-next-line
//   }, []);

//   function element(single, index) {
//     return (
//       <Videocard
//         userName={username}
//         corrName={courseDetails.courseName}
//         nameOfVideo={single.tutorialName}
//         founder={courseDetails.username}
//         key={index}
//         views={courseDetails.courseContent[index].views}
//       />
//     );
//   }

//   async function addLike() {
//     const likeURL =
//       "/like/" +
//       username +
//       "/" +
//       coursename +
//       "/founder/" +
//       foundername;
//     try {
//       setLikeStatus(true);
//       const response = await axios.post(likeURL, backObj);
//       alert(response.data);
//     } catch (err) {
//       console.log("addlike error at course page", err);
//     }
//   }

//   async function unLike() {
//     const unlikeURL =
//       "/unlike/" +
//       username +
//       "/" +
//       coursename +
//       "/founder/" +
//       foundername;
//     try {
//       setLikeStatus(false);
//       const response = await axios.post(unlikeURL, backObj);
//       alert(response.data);
//     } catch (err) {
//       console.log("unlike error at course page", err);
//     }
//   }

//   return (
//     <div className="mainCourseDiv">
//       <div className="courseLeftDiv">
//         <div className="teacherPhotoDiv">
//           <img
//             src="/pictures/usericon4.png"
//             width="100"
//             height="100"
//             alt="teacher icon"
//             className="courseTeacherIcon"
//           />
//           <h3 className="techerName">{courseDetails.username}</h3>
//         </div>
//         <div className="courseLeftButtonDiv">
//           <div className="courseruler"></div>
//           <div className="courseLeftButtonContainer">
//             <button
//               className="courseLeftButton"
//               onClick={() => {
//                 history.push("/home/" + username);
//               }}
//             >
//               HOME
//             </button>
//             <button
//               className="courseLeftButton"
//               onClick={() => {
//                 history.push("/update/" + username);
//               }}
//             >
//               MY COURSES
//             </button>
//             <button
//               className="courseLeftButton"
//               onClick={() => {
//                 history.push(
//                   "/mycontent/notes/" +
//                     username +
//                     "/" +
//                     courseDetails.courseName +
//                     "/founder/" +
//                     courseDetails.username
//                 );
//               }}
//             >
//               NOTES
//             </button>
//             <button
//               className="courseLeftButton"
//               onClick={() => {
//                 history.push(
//                   "/mycontent/screenshots/" +
//                     username +
//                     "/" +
//                     courseDetails.courseName +
//                     "/founder/" +
//                     courseDetails.username
//                 );
//               }}
//             >
//               SCREENSHOTS
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="courseRightDiv">
//         {likeStatus === false ? (
//           <button className="courseLikeBtn" onClick={addLike}>
//             <ThumbUpOutlinedIcon></ThumbUpOutlinedIcon>like
//           </button>
//         ) : (
//           <button className="courseLikeBtn" onClick={unLike}>
//             <ThumbDownOffAltOutlinedIcon></ThumbDownOffAltOutlinedIcon>unlike
//           </button>
//         )}
//         <div className="courseUpperDiv">
//           <h1>{courseDetails.courseName}</h1>
//         </div>

//         <div className="courseVideoList">
//           {courseDetails.courseContent &&
//             courseDetails.courseContent.map(element)}
//         </div>

//         {/* <div className="courseLowerDiv">
//           <p>Copyrights©️2023</p>
//           <p>~Aditya Joshi</p>
//         </div> */}
//       </div>
//     </div>
//   );
// }

// export default Course;
