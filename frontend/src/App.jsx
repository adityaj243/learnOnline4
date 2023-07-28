import React from "react";
import Play from "./components/Play";
import Course from "./components/Course";
import Home from "./components/Home";
import Insert from "./components/Insert";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";
import Update from "./components/Update";
import MyContent from "./components/MyContent";
import MyContentNotes from "./components/MyContentNotes";
import MyContentSlideshow from "./components/MyContentSlideshow";
import UpdateCourse from "./components/UpdateCourse";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route
        exact
        path="/course/:username/:crname/:vidname/founder/:foundername"
      >
        <Play />
      </Route>
      <Route exact path="/course/:username/:crname/founder/:founderName">
        <Course />
      </Route>
      <Route exact path="/about">
        <About />
      </Route>
      <Route exact path="/home/:username">
        <Home />
      </Route>
      <Route exact path="/insert/:username">
        <Insert />
      </Route>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
      <Route exact path="/update/:username">
        <Update />
      </Route>
      <Route exact path="/update/:username/:crname">
        <UpdateCourse />
      </Route>
      <Route exact path="/mycontent/:username">
        <MyContent />
      </Route>
      <Route
        exact
        path="/mycontent/notes/:username/:crname/founder/:foundername"
      >
        <MyContentNotes />
      </Route>
      <Route
        exact
        path="/mycontent/screenshots/:username/:crname/founder/:foundername"
      >
        <MyContentSlideshow />
      </Route>
    </Router>
  );
}

export default App;
