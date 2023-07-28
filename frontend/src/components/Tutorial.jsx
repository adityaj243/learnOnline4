import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Tutorial(props) {
  return (
    <div id={props.Name} className="tutorialContainer">
      <h2>{props.Name}</h2>
      <video preload="auto" width="320" height="240" controls>
        <source src={URL.createObjectURL(props.videoFile)} />
        :your browder does not support video tag
      </video>
      <button
        onClick={() => {
          URL.revokeObjectURL(props.videoFile);
          props.remFunc(props.Name);
          const element = document.getElementById(props.Name);
          element.remove();
        }}
      >
        <DeleteIcon />
      </button>
      <hr />
    </div>
  );
}

export default Tutorial;

// import React from "react";

// function Tutorial(props) {
//   return (
//     <>
//       <div>
//         {props.media &&
//           props.media.map((single, index) => {
//             return (
//               <div key={index}>
//                 <h3>{single.name}</h3>
//                 <video
//                   key={index + 1}
//                   preload="auto"
//                   width="320"
//                   height="240"
//                   controls
//                 >
//                   <source src={URL.createObjectURL(single.vidFile)} />
//                   :your browder does not support video tag
//                 </video>
//                 <button onClick={props.removeVideo}>Remove</button>
//                 <hr />
//               </div>
//             );
//           })}
//       </div>
//     </>
//   );
// }

// export default Tutorial;
