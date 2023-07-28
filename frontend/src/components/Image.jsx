import React from "react";
import "../styles.css";
import captureVideoFrame from "capture-video-frame";
import axios from "axios";

function Image() {
  async function capture() {
    const frame = captureVideoFrame("myVideTag", "png");
    const img = document.getElementById("my-screenshot");
    img.setAttribute("src", frame.dataUri);
    // console.log(frame);

    const formData = new FormData();
    formData.append(
      "imageDetails",
      frame.blob,
      `my-screenshot.${frame.format}`
    );

    try {
      await axios.post("/image/upload", formData);
      alert("Successfully submitted image");
    } catch (error) {
      console.log("error yaar image");
      console.log(error);
    }
  }

  return (
    <div>
      {/* <video
        id="myVideTag"
        loop
        key="video"
        width="100%"
        height="460px"
        muted
        controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
      >
        <source src="../videos/tut3.mp4" type="video/mp4" />
      </video> */}

      <iframe
        title="unique"
        id="myVideTag"
        // ALLOWTRANSPARENCY="true"
        width="100%"
        height="400px"
        allow="autoplay;"
        controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
        // src="https://www.youtube.com/embed/qARXCXvQXKY?autoplay=1"
        // src="/Videos/tut2.mp4?autoplay=1"
        // src="https://docs.google.com/file/d/1wcqOsB01Oy2D1jSFMZcNVdbu9NcTZIrE/preview?autoplay=1&mute=1&enablejsapi=1"
        //   src={"" + props.link}
        src="../videos/tut3.mp4"
      ></iframe>

      <hr />

      <img
        id="my-screenshot"
        style={{ height: "460px", width: "50%" }}
        alt="test"
        // src="/pictures/insta dp.jpg"
      />

      <button onClick={capture}>Capture</button>
    </div>
  );
}

export default Image;
