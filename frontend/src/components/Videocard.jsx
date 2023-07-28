import React from "react";
// import "../styles.css";
import { useHistory } from "react-router-dom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VideocamIcon from "@mui/icons-material/Videocam";
function Videocard(props) {
  const history = useHistory();
  const url =
    "/course/" +
    props.userName +
    "/" +
    props.corrName +
    "/" +
    props.nameOfVideo +
    "/founder/" +
    props.founder;
  return (
    <div className="videoCard">
      <button id="videoicon">
        <VideocamIcon />
      </button>

      <h3>{props.nameOfVideo}</h3>
      <p>{props.views} views</p>

      <button
        id="playicon"
        onClick={() => {
          localStorage.setItem("coursename", props.corrName);
          localStorage.setItem("foundername", props.founder);
          localStorage.setItem("videoname", props.nameOfVideo);
          history.push(url);
        }}
      >
        <PlayCircleIcon />
      </button>
    </div>
  );
}

export default Videocard;
