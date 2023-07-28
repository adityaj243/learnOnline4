import React from "react";
import axios from "axios";
import "../styles.css";
import { useHistory } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

function UpdateCard(props) {
  const history = useHistory();
  const url = "/update/" + props.myUser + "/" + props.nameOfCourse;

  async function deleteCourse() {
    const deleteURL =
      "/update/delete/course/" + props.myUser + "/" + props.nameOfCourse;
    const courseObj = {
      username: props.myUser,
      coursename: props.nameOfCourse,
    };
    try {
      const response = await axios.post(deleteURL, courseObj);
      console.log(response.data);
      alert(response.data);
    } catch (err) {
      //   console.log("here:");
      console.log(err);
    }
  }

  return (
    <div>
      <div className="updateCard">
        <button id="videoicon">
          <AutoStoriesIcon />
        </button>
        <h3>{props.nameOfCourse}</h3>

        <button
          id="updateViewIcon"
          onClick={() => {
            const currcrname = localStorage.getItem("coursename");
            localStorage.setItem("prevcourse", currcrname);
            localStorage.setItem("coursename", props.nameOfCourse);
            // localStorage.setItem("username", props.myUser);
            history.push(url);
          }}
        >
          <ArrowForwardIosOutlinedIcon />
        </button>
        <button
          id="playicon"
          onClick={() => {
            var answer = window.confirm(
              "Are you sure you want to detele selected course ?"
            );
            if (answer) {
              deleteCourse();
              window.location.reload(false);
            }
          }}
        >
          <DeleteForeverIcon />
        </button>
      </div>
    </div>
  );
}

export default UpdateCard;
