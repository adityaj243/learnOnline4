import React, { useEffect, useState } from "react";
import "../styles.css";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import UpdateCourseCard from "./UpdateCourseCard";

function UpdateCourse() {
  // const location = useLocation();
  const history = useHistory();
  // const path = location.pathname;
  const username = localStorage.getItem("username");
  const coursename = localStorage.getItem("coursename");
  const backObj = {
    username: username,
    coursename: coursename,
  };
  const url = "/update/" + username + "/" + coursename;

  const [videoList, setVideoList] = useState([]);

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

  const getUser = async function () {
    try {
      const response = await axios.post(url, backObj);
      setVideoList(response.data.courseContent);
      // console.log(response.data);
      // setcoursename(response.data.courseName);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    isLogged();
    getUser();
    // eslint-disable-next-line
  }, []);

  function showVideos(single, index) {
    return (
      <UpdateCourseCard
        key={index}
        nameOfVideo={single.tutorialName}
        linkOfVideo={single.tutorialLink}
        userName={username}
        corrName={coursename}
      />
    );
  }

  return (
    <div className="mainCourseDiv">
      <div className="courseLeftDiv">
        <div className="teacherPhotoDiv">
          <img
            src="/pictures/usericon4.png"
            width="100"
            height="100"
            alt="teacher icon"
            className="courseTeacherIcon"
          />
          <h3 className="techerName">{username}</h3>
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
              COURSES
            </button>
            <button
              className="courseLeftButton"
              onClick={() => {
                history.push("/insert/" + username);
              }}
            >
              ADD COURSE
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
                history.push("/about");
              }}
            >
              ABOUT
            </button>
          </div>
        </div>
      </div>

      <div className="courseRightDiv">
        <div className="courseUpperDiv">
          <h1>{coursename}</h1>
        </div>

        <div className="courseVideoList">
          {videoList && videoList.map(showVideos)}
        </div>

        {/* <div className="courseLowerDiv">
          <p>Copyrights©️2023</p>
          <p>~Aditya Joshi</p>
        </div> */}
      </div>
    </div>

    // <div className="mainCourseDiv">
    //   <div className="courseLeftDiv">
    //     <div className="teacherPhotoDiv">
    //       <img
    //         src="../pictures/insta dp.jpg"
    //         width="72"
    //         height="72"
    //         alt="teacher icon"
    //         className="courseTeacherIcon"
    //       />
    //       <h3 className="techerName">Teacher's Name</h3>
    //     </div>
    //     <div className="courseLeftButtonDiv">
    //       <button
    //         className="courseLeftButton"
    //         onClick={() => {
    //           history.push("/update/" + username);
    //         }}
    //       >
    //         Courses
    //       </button>
    //       <button
    //         className="courseLeftButton"
    //         onClick={() => {
    //           history.push("/insert/" + username);
    //         }}
    //       >
    //         INSERT COURSE
    //       </button>
    //       <button className="courseLeftButton">Contacts</button>
    //       <button className="courseLeftButton">About</button>
    //     </div>
    //   </div>

    //   <div className="courseRightDiv">
    //     <div className="courseUpperDiv">
    //       <button>FUNCTIONS</button>
    //     </div>

    //     <div className="courseVideoList">
    //       <h1>{videoList && videoList.map(showVideos)}</h1>
    //     </div>

    //     <div className="courseLowerDiv">
    //       <p>Copyrights©️2023</p>
    //       <p>~Aditya Joshi</p>
    //     </div>
    //   </div>
    // </div>
  );
}

export default UpdateCourse;
