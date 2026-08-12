import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Career from "./Pages/Career";
import ResetPassword from "./Pages/ResetPassword";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

import { useState } from "react";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [forgotPassword, setForgotPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <Routes>

      <Route
        path="/"
        element={
          <Home
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
            setShowModal={setShowModal}
          />
        }
      />

      <Route
        path="/career"
        element={
          <Career
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
            setShowModal={setShowModal}
          />
        }
      />

      <Route
        path="/about"
        element={
          <About
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
            setShowModal={setShowModal}
          />
        }
      />

      <Route
        path="/contact"
        element={
          <Contact
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
            setShowModal={setShowModal}
          />
        }
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

    </Routes>
  );
}

export default App;