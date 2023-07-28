import React from "react";
// import axios from "axios";
import Videocard from "./Videocard";
import "../styles.css";

function CourseMap(props) {
  function element(single, index) {
    return (
      <Videocard
        userName={props.userName}
        corrName={props.courseDet.courseName}
        nameOfVideo={single.tutorialName}
        key={index}
      />
    );
  }
  return (
    <>
      {props.courseDet.courseContent &&
        props.courseDet.courseContent.map(element)}
    </>
  );
}

export default CourseMap;
