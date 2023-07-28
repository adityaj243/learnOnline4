import React, { useState } from "react";
// import "../navbar.css";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { useHistory } from "react-router-dom";
import SearchBar from "./SearchBar";

function Navbar(props) {
  const history = useHistory();
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");
  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else setActive("nav__menu");

    // Icon Toggler
    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else setIcon("nav__toggler");
  };

  return (
    <nav className="nav">
      <div className="nav__item">
        <h2 className="nav__brand">
          <span>Q</span>
          uick
          <span>L</span>earn
          <SchoolIcon />
        </h2>
      </div>
      <SearchBar
        searchQuery={props.searchQ}
        setSearchQuery={props.setSearchQ}
      />
      <ul className={active}>
        <div className="nav__item">
          <li>
            <a href={"/update/" + props.username} className="nav__link">
              MY COURSES
            </a>
          </li>
        </div>

        <div className="nav__item">
          <li>
            <a href={"/mycontent/" + props.username} className="nav__link">
              QUICK REVISION
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <a href={"/insert/" + props.username} className="nav__link">
              ADD YOUR COURSE
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <a href="/about" className="nav__link">
              ABOUT
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <button
              id="logoutbtn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("coursename");
                localStorage.removeItem("foundername");
                localStorage.removeItem("videoname");
                history.push("/");
              }}
            >
              <LogoutIcon fontSize="small" />
              LOGOUT
            </button>
          </li>
        </div>
      </ul>
      <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

export default Navbar;
