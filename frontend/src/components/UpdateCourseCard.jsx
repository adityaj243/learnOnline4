import React from "react";
import axios from "axios";
import "../styles.css";
import { useHistory } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";

function UpdateCourseCard(props) {
  const history = useHistory();
  // <UpdateCourseCard
  //     key={index}
  //     nameOfVideo={single.tutorialName}
  //     linkOfVideo={single.tutorialLink}
  //     userName={username}
  //     corrName={coursename}
  //   />
  async function removeVideo() {
    try {
      const url =
        "/update/delete/video/" +
        props.userName +
        "/" +
        props.corrName +
        "/" +
        props.nameOfVideo;
      const deleteVideoObj = {
        username: props.userName,
        coursename: props.corrName,
        videoname: props.nameOfVideo,
      };
      const response = await axios.post(url, deleteVideoObj);
      console.log("when video removed:");
      alert(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="updateCard">
        <button id="videoicon">
          <VideocamIcon />
        </button>
        <h3>{props.nameOfVideo}</h3>

        <button
          id="updateViewIcon"
          onClick={() => {
            localStorage.setItem("videoname", props.nameOfVideo);
            localStorage.setItem("coursename", props.corrName);
            localStorage.setItem("foundername", props.userName);
            history.push(
              "/course/" +
                props.userName +
                "/" +
                props.corrName +
                "/" +
                props.nameOfVideo +
                "/founder/" +
                props.userName
            );
          }}
        >
          <ArrowForwardIosOutlinedIcon />
        </button>
        <button
          id="playicon"
          onClick={() => {
            var answer = window.confirm(
              "Are you sure you want to detele selected video from the course ?"
            );
            if (answer) {
              removeVideo();
              window.location.reload(false);
            }
          }}
        >
          <DeleteForeverIcon />
        </button>
      </div>
    </div>

    // <div>
    //   <a
    //     href={
    //       "/course/" +
    //       props.userName +
    //       "/" +
    //       props.corrName +
    //       "/" +
    //       props.nameOfVideo +
    //       "/founder/" +
    //       props.userName
    //     }
    //   >
    //     <div className="videoCard">
    //       <p style={{ margin: "0" }}>{props.nameOfVideo}</p>
    //     </div>
    //   </a>
    //   <button onClick={removeVideo}>Remove Video</button>
    // </div>
  );
}

export default UpdateCourseCard;
