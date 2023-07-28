import React, { useEffect, useState } from "react";
import Note from "./Note";
import captureVideoFrame from "capture-video-frame";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles.css";
import CameraIcon from "@mui/icons-material/Camera";
import HomeIcon from "@mui/icons-material/Home";
import HorizontalScroll from "react-scroll-horizontal";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

function Play() {
  const history = useHistory();
  const [imagePathArray, setImagePathArray] = useState([]);
  const [preview, setPreview] = useState("normal");
  const username = localStorage.getItem("username");
  const courseName = localStorage.getItem("coursename");
  const videoName = localStorage.getItem("videoname");
  const founderName = localStorage.getItem("foundername");

  const backObj = {
    username: username,
    coursename: courseName,
    videoname: videoName,
    foundername: founderName,
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

  //------------------------------------FUNCTION TO GET SCREENSHOTS FROM DATABASE----------------------------------------

  async function getScreenshots() {
    const url =
      "/image/get/" +
      username +
      "/" +
      courseName +
      "/" +
      videoName +
      "/" +
      founderName;

    const response = await axios.post(url, backObj);
    try {
      // console.log(response.data.screenshots);
      setImagePathArray(() => {
        const ssarr = response.data.screenshots;
        return ssarr;
      });
    } catch (err) {
      console.log("getss se error");
      console.log(err);
    }
  }

  //----------------------GETTING VIDEO LINK-------------------------------------------------------------------

  const getUser = async function () {
    const url =
      "/course/" +
      username +
      "/" +
      courseName +
      "/" +
      videoName +
      "/founder/" +
      founderName;
    // const url = "" + location.pathname;
    console.log("play:");
    console.log(url);
    const response = await axios.post(url, backObj);
    // console.log(response.data);
    console.log("response link of get in Play:");
    console.log(response.data.link);
    // console.log("hello", response.data.link);
    const vidd = document.getElementById("myVideTag");
    vidd.setAttribute("src", response.data.link);
    console.log("play useeffect note content:");
  };
  useEffect(() => {
    isLogged();
    getUser();
    getScreenshots();
    // eslint-disable-next-line
  }, []);

  async function deleteScreenshot(pubid) {
    // /delete/screenshot/:username/:crname/founder/:foundername
    const deleteSSurl =
      "/delete/screenshot/" +
      username +
      "/" +
      courseName +
      "/founder/" +
      founderName;
    console.log("deleteSSurl:");
    console.log(deleteSSurl);
    const deleteObj = {
      username: username,
      foundername: founderName,
      coursename: courseName,
      // link: exactPath,
      exactpath: pubid,
      // "https://res.cloudinary.com/dumycx6l2/image/upload/v1687714695/l3pjuokrj8wuzekwlmkr.png",
    };
    try {
      const response = await axios.post(deleteSSurl, deleteObj);
      alert(response.data);
      console.log(response.data);
      getScreenshots();
    } catch (err) {
      console.log(err);
    }
  }

  function element(single, index) {
    return (
      <div key={index} className="PlayImageAndButtonContainer">
        <div className="imageContainerPlay">
          {/* <div className="slideShowButtonContainer"></div> */}
          <button
            onClick={() => {
              // const pathAsString = single.replace(/\\/g, "/");
              console.log("ye path.string hai play me image ki:");
              console.log(single.pub_id);
              deleteScreenshot(single.pub_id);
            }}
          >
            <DeleteIcon />
          </button>
          <img
            // onClick={(e) => {
            //   if (e.target.style.position === "absolute") {
            //     e.target.style.position = "static";
            //   } else {
            //     e.target.style.position = "absolute";
            //     e.target.style.top = "10px";
            //   }
            // }}
            src={single.link}
            // src={"/" + single}
            alt="test"
            height="500px"
            width="auto"
            // src="/pictures/insta dp.jpg"
          />
        </div>
      </div>
    );
  }

  //------------------------------FUNCTION TO CAPTURE SCREENSHOT AND UPDATING MAP-------------------------------
  async function capture() {
    const frame = captureVideoFrame("myVideTag", "png");
    // console.log("frame:", frame);
    const formData = new FormData();
    formData.append("file", frame.dataUri);
    formData.append("upload_preset", "onlinelearningapp");
    formData.append("cloud_name", "dumycx6l2");
    // formData.append(
    //   "imageDetails",
    //   frame.blob,
    //   `my-screenshot.${frame.format}`
    // );
    try {
      const url = "https://api.cloudinary.com/v1_1/dumycx6l2/image/upload";
      const res = await axios.post(url, formData);
      const sslink = res.data.secure_url;
      const pubid = res.data.public_id;
      console.log("sslink: ", sslink);
      const url2 =
        "/image/upload/" +
        username +
        "/" +
        courseName +
        "/" +
        videoName +
        "/" +
        founderName;

      await axios.post(url2, {
        link: sslink,
        pub: pubid,
        username: username,
        coursename: courseName,
        videoname: videoName,
        foundername: founderName,
      });

      alert("Successfully submitted image");
    } catch (error) {
      console.log("error yaar image");
      console.log(error);
    }

    getScreenshots();
  }

  // function goBack() {
  //   const temp = [...list];
  //   const ind = index;
  //   if (ind !== 0) {
  //     const preUrl =
  //       "/course/" +
  //       username +
  //       "/" +
  //       courseName +
  //       "/" +
  //       temp[ind - 1].tutorialName +
  //       "/founder/" +
  //       founderName;
  //     history.push(preUrl);
  //   }
  // }
  // function goNext() {
  //   const temp = [...list];
  //   const ind = index;
  //   if (ind !== temp.length - 1) {
  //     const preUrl =
  //       "/course/" +
  //       username +
  //       "/" +
  //       courseName +
  //       "/" +
  //       temp[ind + 1].tutorialName +
  //       "/founder/" +
  //       founderName;
  //     history.push(preUrl);
  //   }
  // }

  // function keyPressHandler(event) {
  //   if (event.key === "s") {
  //     setPreview(() => {
  //       return "showmode";
  //     });
  //   } else if (event.key === "e") {
  //     setPreview(() => {
  //       return "normal";
  //     });
  //   }
  //   console.log(event.key);
  // }
  // window.addEventListener("keypress", keyPressHandler);

  function slideShow() {
    setPreview(() => {
      return "showmode";
    });
  }

  //-------------------------------------------------------------------------------------------------------

  return (
    <div className="play">
      <div className="videoAndNotesDiv">
        <div className="videoDiv">
          <div className="videoDivUpper">
            <div className="videoUpperButtonContainer">
              <h2>{videoName}</h2>
            </div>
          </div>

          <div className="videoArea">
            <video
              id="myVideTag"
              // src="https://res.cloudinary.com/dumycx6l2/video/upload/v1687547150/samples/elephants.mp4"
              crossOrigin="anonymous" // to avoid cross origin error when screenshot taken
              loop
              width="100%"
              height="auto"
              autoPlay
              controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
            >
              <source type="video/mp4" />
            </video>
          </div>

          <div className="videoLowerDiv">
            <div className="videoLowerButtonContainer">
              <button
                onClick={slideShow}
                style={{ border: "none", outline: "none" }}
              >
                SLIDESHOW
              </button>
              <button
                id="homeIcon"
                onClick={() => {
                  history.push("/home/" + username);
                }}
              >
                <HomeIcon fontSize="large" sx={{ color: "white" }} />
              </button>
              <button
                className=""
                onClick={() => {
                  history.push(
                    "/course/" +
                      username +
                      "/" +
                      courseName +
                      "/founder/" +
                      founderName
                  );
                }}
              >
                ALL VIDEOS
              </button>
              {/* <button onClick={deleteScreenshot}>del</button> */}
              <button id="captureIcon" onClick={capture}>
                <CameraIcon fontSize="large" sx={{ color: "white" }} />
              </button>
            </div>
          </div>
        </div>

        <Note
          userName={username}
          crname={courseName}
          vidname={videoName}
          foundername={founderName}
        />
      </div>
      {/* <div className="PlayImageCollection">
        {imagePathArray && imagePathArray.map(element)}
      </div> */}
      <div className={preview}>
        {/* <div className="excapeSlideshow"></div> */}
        <button
          id="escapeSlideshow"
          onClick={() => {
            setPreview("normal");
          }}
        >
          <CloseIcon fontSize="large" sx={{ color: "white" }} />
        </button>
        <HorizontalScroll>
          {imagePathArray && imagePathArray.map(element)}
        </HorizontalScroll>
      </div>
    </div>
  );
}

export default Play;
