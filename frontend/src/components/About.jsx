import SchoolIcon from "@mui/icons-material/School";
import StarOutlineSharpIcon from "@mui/icons-material/StarOutlineSharp";
import { useHistory } from "react-router-dom";
const date = new Date();

function About() {
  let history = useHistory();
  return (
    <div className="aboutMainDiv">
      <div class="top-container">
        <nav className="nav">
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
                <a></a>
              </li>
            </div>
            <div className="nav__item">
              <li>
                <a></a>
              </li>
            </div>
            <div className="nav__item">
              <li>
                <a></a>
              </li>
            </div>
            <div className="nav__item">
              <li>
                <a></a>
              </li>
            </div>
            <div className="nav__item">
              <li>
                <a></a>
              </li>
            </div>
          </ul>
          <button onClick={history.goBack} id="backAboutButton">
            BACK
          </button>
        </nav>
      </div>

      <div class="middle-container">
        <div class="profile">
          <img class="dp" src="images\instadp.jpg" alt="" />
          <h2>
            <strong>
              WELCOME TO QUICK LEARN
              <SchoolIcon fontSize="large" />
            </strong>
          </h2>
          <p class="intro">
            <strong>
              We respect your time, Join us to discover how to be a smart
              learner!
            </strong>
          </p>
        </div>
        <hr />
        <div class="skills">
          <h2>
            <strong>
              <StarOutlineSharpIcon />
              QUICK REVISION
              <StarOutlineSharpIcon />
            </strong>
          </h2>
          <div class="skill-row">
            <img
              class="singing"
              src="/pictures/ssicon2.png"
              alt="sing-img"
              height="auto"
              width="25%"
            />
            <h3>
              <strong>SNAPSHOTS</strong>
            </h3>
            <p>
              <strong>
                We stand a much better chance of remembering thing and lists if
                we associate them with images. Our platform allows us to take
                quick snaps while watching lessons.
              </strong>
            </p>
          </div>
          <div class="skill-row">
            <img
              class="videoEditing"
              src="/pictures/noteicon.png"
              alt="videoE-img"
              height="auto"
              width="32%"
            />
            <h3>
              <strong>HANDY NOTES</strong>
            </h3>
            <p>
              <strong>
                Making, organising, and updating notes while watching lessons
                will save your time and effort. They will support you during
                revision time and speed up the procedure.
              </strong>
            </p>
          </div>
        </div>
        <hr />
        <div class="contact-me">
          <h2>
            <strong>Get In Touch</strong>
          </h2>
          {/* <h3 class="contact-me-h3">
            <strong>Wanna have some coffee together ?</strong>
          </h3> */}
          {/* <p class="contact-me-p">
            <strong>
              Are you also their to love brownie as much as I do ? Bring some
              Vanilla Ice Cream with you.
            </strong>
          </p> */}
          <a class="btn" href="mailto:adityaj243@email.com">
            CONTACT ME
          </a>
        </div>
      </div>

      <div class="bottom-container">
        <a
          class="footer-link"
          href="https://www.linkedin.com/in/aditya-joshi-533100221"
        >
          <strong>LinkedIn</strong>
        </a>
        {/* <a
          class="footer-link"
          href="https://www.facebook.com/profile.php?id=100007187290325&mibextid=ZbWKwL"
        >
          <strong>Facebook</strong>
        </a> */}
        <p class="endP">{"©" + date.getFullYear() + "~Aditya Joshi"}</p>
      </div>
    </div>
  );
}

export default About;
