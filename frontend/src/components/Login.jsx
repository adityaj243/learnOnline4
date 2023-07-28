import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
// import "../style_login.css";

function Login() {
  const history = useHistory();
  const [registerContent, setRegisterContent] = useState({
    username: "",
    password: "",
  });

  async function isLoggedUserAuth() {
    try {
      const response = await axios.get("/isUserAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (response.data.auth) {
        history.push("/home/" + response.data.username);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    isLoggedUserAuth();
    // eslint-disable-next-line
  }, []);

  //---------------------POSTING--------------------------------------------------------
  async function handleClick(event) {
    event.preventDefault();
    try {
      const result = await axios.post("/login", registerContent);
      console.log(result.data);
      if (!result.data.auth) {
        alert("PLEASE REGISTER FIRST !");
        history.push("/register");
      } else {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("username", registerContent.username);
        history.push("/home/" + registerContent.username);
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

  return (
    <div className="loginPage">
      <div className="center">
        <h1>Login</h1>
        <form>
          <div className="txt_field">
            <input
              type="text"
              name="username"
              required
              autoComplete="off"
              onChange={changeHandler}
              value={registerContent.username}
            ></input>
            <span></span>
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              name="password"
              required
              onChange={changeHandler}
              value={registerContent.password}
            ></input>
            <span></span>
            <label>Password</label>
          </div>
          <button id="submitButton" onClick={handleClick}>
            Login
          </button>
          <div className="signup_link">
            Not a member? <a href="/register">Signup</a>
          </div>
        </form>
        {/* <div className="homeLowerDiv">
        <div className="homeCopyRight">
          <p>Copyrights©️2023</p>
          <p>~Aditya Joshi</p>
        </div>
      </div> */}
      </div>
    </div>
  );
}

export default Login;
