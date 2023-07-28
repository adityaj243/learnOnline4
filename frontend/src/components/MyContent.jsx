import React, { useEffect, useState } from "react";
import "../styles.css";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import MyContentCard from "./MyContentCard";
import UpdateNav from "./UpdateNav";

function MyContent() {
  const history = useHistory();
  // const location = useLocation();
  const username = localStorage.getItem("username");
  const backObj = {
    username: username,
  };
  const url = "/mycontent/" + username;

  const [courses, setCourses] = useState([]);

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
    const response = await axios.post(url, backObj);
    setCourses(() => {
      const arr = response.data.courses;
      return [...arr];
    });
    console.log(response.data.courses);
  };
  useEffect(() => {
    isLogged();
    getUser();
    // eslint-disable-next-line
  }, []);

  function showCourses(single, index) {
    return (
      <MyContentCard
        key={index}
        nameOfCourse={single.courseName}
        myUser={username}
        founder={single.founderName}
      />
    );
  }

  return (
    <div className="homeDiv">
      <div>
        <UpdateNav username={username} />
      </div>

      <div className="updateVideoList">
        {courses && courses.map(showCourses)}
      </div>
    </div>
  );
}

export default MyContent;
