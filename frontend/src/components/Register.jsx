import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../styles.css";

function Register() {
  const history = useHistory();
  const [registerContent, setRegisterContent] = useState({
    username: "",
    password: "",
  });
  //---------------------POSTING----------------------------------------------------------
  async function handleClick(event) {
    event.preventDefault();
    try {
      const result = await axios.post("/register", registerContent);
      if (result.data === "Username already exist") {
        alert("Username already exist");
      } else {
        alert(result.data);
        history.push("/");
      }
    } catch (error) {
      console.log("error yaar");
      console.log(error);
    }
  }

  //---------------------UPDATING CHANGES----------------------------------------------------------
  function changeHandler(event) {
    const nameOfChangedInput = event.target.name;
    const valueOfChangedInput = event.target.value;

    setRegisterContent(function (previousValue) {
      if (nameOfChangedInput === "username") {
        return {
          username: valueOfChangedInput,
          password: previousValue.password,
        };
      } else if (nameOfChangedInput === "password") {
        return {
          username: previousValue.username,
          password: valueOfChangedInput,
        };
      }
    });
  }
  //---------------------RETURN----------------------------------------------------------

  return (
    <div className="loginPage">
      <div className="center">
        <h1>Register</h1>
        <form>
          <div className="txt_field">
            <input
              type="text"
              onChange={changeHandler}
              autoComplete="off"
              name="username"
              value={registerContent.username}
            ></input>
            <span></span>
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              onChange={changeHandler}
              name="password"
              value={registerContent.password}
            ></input>
            <span></span>
            <label>Password</label>
          </div>
          <button id="submitButton" onClick={handleClick}>
            Register
          </button>
          <div className="signup_link">
            Already a member? <a href="/">login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
