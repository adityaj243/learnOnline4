import React, { useState, useEffect } from "react";
import Tutorial from "./Tutorial";
import Loading from "./Loading";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";

function Insert() {
  const history = useHistory();
  // const location = useLocation();
  const username = localStorage.getItem("username");
  // const username = location.pathname.slice(8);

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

  useEffect(() => {
    isLogged();
    // eslint-disable-next-line
  }, []);

  const [courseName, setCourseName] = useState("");
  const [videoName, setVideoName] = useState("");
  const [videoNames, setVideoNames] = useState([]);
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState([]);
  const [showMedia, setShowMedia] = useState([]);
  const [links, setLinks] = useState([]);
  const [pubId, setPubid] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(pubId);

  //------------------------ADDING NEW TO THE LIST------------------------------------------------------------
  async function addFile() {
    setLoading(true);
    setCourseName(() => {
      const cn = document.getElementById("cn").value;
      return cn;
    });
    if (document.getElementById("vn").value !== "") {
      setFiles((prevVal) => {
        return [...prevVal, singleFile[0]]; // we use this operator for array otherwise changes will not be updated
      });

      setVideoNames((prevVal) => {
        const tempName = document.getElementById("vn").value;
        return [...prevVal, tempName];
      });

      setShowMedia((prevVal) => {
        const mediaObj = {
          name: document.getElementById("vn").value,
          vidFile: document.getElementById("formVideoFile").files[0],
        };
        return [...prevVal, mediaObj];
      });

      const formdata = new FormData();
      const tempfile = document.getElementById("formVideoFile").files[0];

      formdata.append("file", tempfile);
      formdata.append("upload_preset", "onlinelearningapp");
      formdata.append("cloud_name", "dumycx6l2");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dumycx6l2/video/upload",
          formdata
        );
        console.log(res.data.secure_url);
        setLinks((pre) => {
          const li = res.data.secure_url;
          return [...pre, li];
        });
        setPubid((pre) => {
          const pubId = res.data.public_id;
          console.log("res public id:", res.data.public_id);
          return [...pre, pubId];
        });
        // alert("Successfully submitted");
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("PLEASE ENTER VIDEO NAME!");
    }
    setLoading(false);
  }
  //------------------------------------------------------------------------------------------------------------

  //--------------------------------LAUNCHING A COURSE-----------------------------------------------------------

  const handleSubmit = (e) => {
    // e.preventDefault();
    async function launch() {
      const vns = [...videoNames];
      const crn = courseName;
      const li = [...links];
      const pub_ids = [...pubId];
      const obj1 = {
        username: username,
        nameOfCourse: crn,
        videoNames: vns,
        links: li,
        pub_id: pub_ids,
      };
      console.log("obj1:");
      console.log(obj1);
      const resp = await axios.post("/insert/" + username, obj1);
    }

    launch();
  };
  //-------------------------------------------------------------------------------------------------

  async function removeVideoFromList(Name) {
    // setLoading(true);
    console.log("index:");
    console.log(Name);
    const arrOfVideos = [...videoNames];
    let index;
    for (let i = 0; i < arrOfVideos.length; i++) {
      if (arrOfVideos[i] === Name) {
        index = i;
        break;
      }
    }
    setVideoNames((pre) => {
      const newarr = [...pre];
      newarr.splice(index, 1);
      return [...newarr];
    });
    setFiles((pre) => {
      const newarr = [...pre];
      newarr.splice(index, 1);
      return [...newarr];
    });

    try {
      const pubidtemp = pubId[index];
      console.log("ye id index wali jgh:", pubidtemp);
      console.log("front pubid: ", pubidtemp);
      const resp = await axios.post("/deleteCloudinaryVideo", {
        pub: pubidtemp,
      });
      alert(resp.data);
    } catch (err) {
      console.log(err);
    }

    setLinks((pre) => {
      const newarr = [...pre];
      newarr.splice(index, 1);
      return [...newarr];
    });

    setPubid((pre) => {
      const newarr = [...pre];
      newarr.splice(index, 1);
      return [...newarr];
    });
    // setLoading(false);
  }

  function element(single, index) {
    return (
      <Tutorial
        key={index}
        i={index}
        Name={single.name}
        videoFile={single.vidFile}
        remFunc={removeVideoFromList}
      />
    );
  }

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
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
                  onClick={() => history.push("/home/" + username)}
                >
                  HOME
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
                    history.push("/mycontent/" + username);
                  }}
                >
                  QUICK REVISION
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
            <div className="insertUpperDiv">
              <div className="insertUpperBrand">
                <h2 className="nav__brand">
                  <span>Q</span>uick
                  <span>L</span>earning
                  <SchoolIcon />
                </h2>
              </div>
              <div className="insertUpperButtonDiv">
                {/* <button>Contacts</button>
            <button>About</button> */}
                {/* <button
              onClick={() => {
                history.push("/");
              }}
            >
              Logout
            </button> */}
              </div>
            </div>
            {/* <form > */}
            <div className="insertArea">
              <div className="form">
                <div className="insertFormDiv">
                  <h1>ADD YOUR COURSE</h1>
                  <div className="inputsInsertPage">
                    <label>Course Name:</label>
                    <input
                      type="text"
                      id="cn"
                      name="courName"
                      placeholder="Type here"
                      autoComplete="off"
                      onChange={(e) => {
                        setCourseName(e.target.value);
                      }}
                      value={courseName}
                    />
                  </div>
                  <div className="inputsInsertPage">
                    <label>Video Name:</label>
                    <input
                      type="text"
                      id="vn"
                      name="vidName"
                      placeholder="Type here"
                      autoComplete="off"
                      onChange={(e) => {
                        setVideoName(e.target.value);
                      }}
                      value={videoName}
                    />
                  </div>
                  <div className="fileinput">
                    {/* <label>Choose Video:</label> */}
                    <input
                      type="file"
                      id="formVideoFile"
                      multiple
                      name="formVideoFile"
                      accept=".mp4,.mkv"
                      onChange={(e) => {
                        setSingleFile(e.target.files);
                      }}
                      files={singleFile}
                    />
                  </div>
                  <div className="inserFormButtonDiv">
                    <div className="btnsInsert">
                      <button onClick={addFile}>
                        <VideoCallIcon />
                      </button>
                      <button
                        onClick={() => {
                          setLoading(true);
                          const cousenameinput =
                            document.getElementById("cn").value;
                          if (cousenameinput === "") {
                            alert("Enter course name first");
                          } else {
                            var answer = window.confirm(
                              "Are you sure you want to launch the course ?"
                            );
                            if (answer) {
                              handleSubmit();
                            }
                          }
                          setLoading(false);
                        }}
                      >
                        LAUNCH COURSE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="videoBuffer">
                {showMedia && showMedia.map(element)}
              </div>
            </div>

            {/* <div className="courseLowerDiv">
          <p>Copyrights©️2023</p>
          <p>~Aditya Joshi</p>
        </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default Insert;
