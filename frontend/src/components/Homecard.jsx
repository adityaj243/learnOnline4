import React from "react";
import { useHistory } from "react-router-dom";
import "../styles.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Homecard(props) {
  const history = useHistory();
  const url =
    "/course/" +
    props.usersName +
    "/" +
    props.nameOfCourse +
    "/founder/" +
    props.founder;
  return (
    // <div className="card">
    //   <div className="image">
    //     <img src="/pictures/courseicon.png" alt="user" />
    //   </div>
    //   <hr />
    //   <div className="title">
    //     <h1>{props.nameOfCourse}</h1>
    //     {/* <p>{props.likes+" "+props.views}</p> */}
    //   </div>
    //   <div class="des">
    //     <p className="description">
    //       You can Add Desccription You can Add Desccription You can Add
    //       Desccription
    //     </p>
    //     <p className="courseFounder">{"~" + props.founder}</p>
    //   </div>
    //   <button
    //     onClick={() => {
    // localStorage.setItem("coursename", props.nameOfCourse);
    // localStorage.setItem("foundername", props.founder);
    //       history.push(url);
    //     }}
    //   >
    //     View Course
    //   </button>
    // </div>
    // <div className="ag-format-container">
    //   <div className="ag-courses_box">
    <div class="ag-courses_item">
      <a
        href={url}
        onClick={() => {
          localStorage.setItem("coursename", props.nameOfCourse);
          localStorage.setItem("foundername", props.founder);
        }}
        class="ag-courses-item_link"
      >
        <div class="ag-courses-item_bg"></div>

        <div class="ag-courses-item_title">{props.nameOfCourse}</div>

        <div class="ag-courses-item_date-box">
          <div className="homeLikesAndViews">
            <FavoriteBorderIcon></FavoriteBorderIcon>
            <span class="ag-courses-item_date">{props.likes}</span>
          </div>

          <div className="homeLikesAndViews">
            <PlayCircleOutlineIcon></PlayCircleOutlineIcon>
            <span class="ag-courses-item_date">{props.views}</span>
          </div>

          <div className="homeLikesAndViews">
            <PersonOutlineIcon></PersonOutlineIcon>
            <span class="ag-courses-item_date">{props.founder}</span>
          </div>
        </div>
      </a>
      {/* </div>
      </div> */}
    </div>
  );
}

export default Homecard;
