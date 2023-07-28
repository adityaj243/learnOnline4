import React from "react";
import SchoolIcon from "@mui/icons-material/School";

function AboutNav() {
  <>
    {/* <nav className="nav"> */}
    <div className="nav__item">
      <h2 className="nav__brand">
        <span>Q</span>
        uick
        <span>L</span>earn
        <SchoolIcon />
      </h2>
    </div>
    <ul className="nav__menu">
      <div className="nav__item">
        <li>
          <a href="" className="nav__link">
            My Courses
          </a>
        </li>
      </div>
      <div className="nav__item">
        <li>
          <a href="#" className="nav__link">
            About
          </a>
        </li>
      </div>
      <div className="nav__item">
        <li>
          <a href="" className="nav__link">
            Quick Revision
          </a>
        </li>
      </div>
      <div className="nav__item">
        <li>
          <a href="" className="nav__link">
            INSERT A COURSE
          </a>
        </li>
      </div>
      <div className="nav__item">
        <li>
          <a href="#" className="nav__link">
            Contact
          </a>
        </li>
      </div>
    </ul>
    {/* </nav> */}
  </>;
}

export default AboutNav;
