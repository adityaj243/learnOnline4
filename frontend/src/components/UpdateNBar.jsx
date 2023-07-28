import React, { useState } from "react";
// import "../navbar.css";

function UpdateNbar(props) {
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
          <span>Q</span>uick
          <span>L</span>earning
        </h2>
      </div>
      <ul className={active}>
        <div className="nav__item">
          <li>
            <a href={"/update/" + props.username} className="nav__link">
              My Courses
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <a href={"/home/" + props.username} className="nav__link">
              Home
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <a href="#" className="nav__link">
              Portfolio
            </a>
          </li>
        </div>
        <div className="nav__item">
          <li>
            <a href={"/insert/" + props.username} className="nav__link">
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
      <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
}

export default UpdateNbar;
