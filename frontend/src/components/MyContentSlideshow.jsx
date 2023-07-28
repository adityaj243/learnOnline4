import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import { useHistory, useLocation } from "react-router-dom";
import HorizontalScroll from "react-scroll-horizontal";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

function MyContentSlideshow() {
  // const location = useLocation();
  const history = useHistory();
  const [imagePathArray, setImagePathArray] = useState([]);
  const userName = localStorage.getItem("username");
  const crname = localStorage.getItem("coursename");
  const foundername = localStorage.getItem("foundername");
  const backObj = {
    username: userName,
    coursename: crname,
    foundername: foundername,
  };

  async function isLogged() {
    const logginObj = {
      urlUsername: userName,
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

  async function deleteScreenshot(path, exactPath) {
    // /delete/screenshot/:username/:crname/founder/:foundername
    const deleteSSurl =
      "/delete/screenshot/" +
      userName +
      "/" +
      crname +
      "/founder/" +
      foundername;
    console.log("deleteSSurl:");
    console.log(deleteSSurl);
    const deleteObj = {
      username: userName,
      foundername: foundername,
      coursename: crname,
      link: path,
      exactpath: exactPath,
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

  async function getScreenshots() {
    const url =
      "/mycontent/screenshots/" +
      userName +
      "/" +
      crname +
      "/founder/" +
      foundername;
    const response = await axios.post(url, backObj);
    try {
      setImagePathArray(() => {
        const ssarr = response.data.screenshots;
        return ssarr;
      });
    } catch (err) {
      console.log("getss se error");
      console.log(err);
    }
  }

  useEffect(() => {
    isLogged();
    getScreenshots();
    // eslint-disable-next-line
  }, []);

  function element(single, index) {
    return (
      <div key={index} className="PlayImageAndButtonContainer">
        <div className="imageContainerPlay">
          {/* <div className="slideShowButtonContainer"></div> */}
          <button
            onClick={() => {
              const pathAsString = single.replace(/\\/g, "/");
              console.log("ye path.string hai play me image ki:");
              console.log(pathAsString);
              deleteScreenshot(pathAsString, single);
            }}
          >
            <DeleteIcon />
          </button>
          <img src={single.link} alt="test" height="500px" width="auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={"showmode"}>
      {/* <div className="excapeSlideshow"></div> */}
      <button
        id="escapeSlideshow"
        onClick={() => {
          window.onpopstate = undefined;
          window.history.back();
        }}
      >
        <CloseIcon fontSize="large" sx={{ color: "white" }} />
      </button>
      <HorizontalScroll>
        {imagePathArray && imagePathArray.map(element)}
      </HorizontalScroll>
    </div>
  );
}

export default MyContentSlideshow;
