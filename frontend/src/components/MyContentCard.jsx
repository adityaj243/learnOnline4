import React from "react";
import "../styles.css";
import { useHistory } from "react-router-dom";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";

function MyContentCard(props) {
  const history = useHistory();

  return (
    <div>
      <div className="updateCard">
        <button id="videoicon">
          <BookmarkOutlinedIcon />
        </button>
        <h3>{props.nameOfCourse}</h3>

        <button
          id="updateViewIcon"
          onClick={() => {
            localStorage.setItem("coursename", props.nameOfCourse);
            localStorage.setItem("foundername", props.founder);
            history.push(
              "/mycontent/screenshots/" +
                props.myUser +
                "/" +
                props.nameOfCourse +
                "/founder/" +
                props.founder
            );
          }}
        >
          <PhotoLibraryOutlinedIcon />
        </button>
        <button
          id="playicon"
          onClick={() => {
            localStorage.setItem("coursename", props.nameOfCourse);
            localStorage.setItem("foundername", props.founder);
            history.push(
              "/mycontent/notes/" +
                props.myUser +
                "/" +
                props.nameOfCourse +
                "/founder/" +
                props.founder
            );
          }}
        >
          <MenuBookOutlinedIcon />
        </button>
      </div>
    </div>
  );
}

export default MyContentCard;
