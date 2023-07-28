import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function Note(props) {
  const heading = "NOTES";
  const [noteContent, setNoteContent] = useState("");

  //-------------------------------GET NOTE CONTENT--------------------------------------------------
  async function getNoteContent() {
    // "/get/notes/:username/:crname/:vidname"
    const url =
      "/get/notes/" +
      props.userName +
      "/" +
      props.crname +
      "/" +
      props.vidname +
      "/" +
      props.foundername;

    const viewURL =
      "/views/" +
      props.userName +
      "/" +
      props.crname +
      "/" +
      props.vidname +
      "/founder/" +
      props.foundername;

    const backObj = {
      username: props.userName,
      coursename: props.crname,
      videoname: props.vidname,
      foundername: props.foundername,
    };
    const response = await axios.post(url, backObj);
    try {
      console.log("frontend Note get:");
      const textArr = document.getElementById("text");
      textArr.setAttribute("value", response.data);
      console.log(response.data);
      setNoteContent(response.data);

      const viewResponse = await axios.post(viewURL, backObj);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getNoteContent();
    // eslint-disable-next-line
  }, []);
  //---------------------------------------------------------------------------------------

  //----------------------------------SAVE NOTE CONTENT-----------------------------------------------
  async function saveNotes() {
    const currContent = document.getElementById("text");
    const content = JSON.stringify(currContent.value);
    const noteObj = {
      content: content,
      username: props.userName,
      coursename: props.crname,
      videoname: props.vidname,
      foundername: props.foundername,
    };
    const url =
      "/save/notes/" +
      props.userName +
      "/" +
      props.crname +
      "/" +
      props.vidname +
      "/" +
      props.foundername;
    console.log("Note URL:");
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
    alert("COPIED !");
  }
  //---------------------------------------------------------------------------------

  return (
    <div className="noteDiv">
      <div className="noteDivUpper">
        <h2 className="noteHeading">{heading}</h2>
      </div>

      <div className="notesArea">
        <textarea
          rows="20"
          cols="45"
          className="txt"
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

      <div className="noteLowerDiv">
        <div className="notesLowerButtonContainer">
          <button onClick={copy}>
            <ContentCopyIcon />
          </button>
          <button className="saveButton" onClick={saveNotes}>
            <SaveIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
