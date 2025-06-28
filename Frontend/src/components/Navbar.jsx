import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai"; // Cross icon

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <nav className={show ? "navbar show_navbar" : "navbar"}>
        <div className="logo">
          <img
            src="/logo.png"
            alt="logo"
            // style={{ height: "100px", width: "auto" }}
          />
          <h4>JobSphere</h4>
        </div>

        <div className="links">
          <ul>
            <li>
              <Link to={"/"} onClick={() => setShow(false)}>
                HOME
              </Link>
            </li>
            <li>
              <Link to={"/jobs"} onClick={() => setShow(false)}>
                JOBS
              </Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link to={"/dashboard"} onClick={() => setShow(false)}>
                  DASHBOARD
                </Link>
              </li>
            ) : (
              <li>
                <Link to={"/login"} onClick={() => setShow(false)}>
                  LOGIN
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Toggle icon */}
        {show ? (
          <AiOutlineClose
            className="hamburger"
            onClick={() => setShow(false)}
          />
        ) : (
          <GiHamburgerMenu
            className="hamburger"
            onClick={() => setShow(true)}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
