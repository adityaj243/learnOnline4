import React from "react";
import "../styles.css";

function Vid(props) {
  return (
    <div className="videoDiv">
      <div className="videoButtonDiv">
        <button className="videoButton">MARK AS WATCHED</button>
      </div>

      <div className="video">
        <iframe
          title="unique"
          id="myIframe"
          // ALLOWTRANSPARENCY="true"
          width="100%"
          height="400px"
          allow="autoplay;"
          controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
          // src="https://www.youtube.com/embed/qARXCXvQXKY?autoplay=1"
          // src="/Videos/tut2.mp4?autoplay=1"
          // src="https://docs.google.com/file/d/1wcqOsB01Oy2D1jSFMZcNVdbu9NcTZIrE/preview?autoplay=1&mute=1&enablejsapi=1"
          src={"" + props.link}
        ></iframe>
      </div>

      <div className="videoButtonDiv">
        <button className="videoButton">PREVIOUS</button>
        <button className="videoButton">NEXT</button>
      </div>
    </div>
  );
}

export default Vid;
