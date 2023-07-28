import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useHistory, useLocation } from "react-router-dom";

function MyContentNotes() {
  // const location = useLocation();
  const history = useHistory();

  const [noteContent, setNoteContent] = useState("");
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
  //-------------------------------GET NOTE CONTENT--------------------------------------------------
  async function getNoteContent() {
    // "/get/notes/:username/:crname/:vidname"
    const url =
      "/mycontent/notes/" + userName + "/" + crname + "/" + foundername;
    const response = await axios.post(url, backObj);
    try {
      console.log("frontend Note get:");
      const textArr = document.getElementById("text");
      textArr.setAttribute("value", response.data);
      console.log(response.data);
      setNoteContent(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    isLogged();
    getNoteContent();
    // eslint-disable-next-line
  }, []);
  //---------------------------------------------------------------------------------------

  //----------------------------------SAVE NOTE CONTENT-----------------------------------------------
  async function saveNotes() {
    const currContent = document.getElementById("text");
    const content = JSON.stringify(currContent.value);
    const noteObj = {
      username: userName,
      coursename: crname,
      foundername: foundername,
      content: content,
    };
    const url = "/save/notes/" + userName + "/" + crname + "/" + foundername;
    console.log("mY CONTENT notes URL:");
    console.log(
      //"/save/notes/:username/:crname/:vidname"
      url
    );
    const response = await axios.post(url, noteObj);
    try {
      alert(response.data);
    } catch (error) {
      console.log("error yaar");
      console.log(error);
    }
  }

  function copy() {
    var copyText = document.getElementById("text");
    copyText.select();
    copyText.setSelectionRange(0, 99999999);
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the text: " + copyText.value);
  }
  //---------------------------------------------------------------------------------

  return (
    <div className="MCnoteDiv">
      <div className="MCnoteDivUpper">
        <h2 className="MCnoteHeading">{crname}</h2>
      </div>

      <div className="MCnotesArea">
        <textarea
          rows="20"
          cols="45"
          className="txtmycontent"
          id="text"
          spellCheck="false"
          onChange={(e) => {
            setNoteContent(e.target.value);
          }}
          value={noteContent}
        >
          {noteContent}
        </textarea>
      </div>

      <div className="MCnoteLowerDiv">
        <div className="MCnotesLowerButtonContainer">
          <button onClick={copy}>
            <ContentCopyIcon />
          </button>
          <button className="MCsaveButton" onClick={saveNotes}>
            <SaveIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyContentNotes;
