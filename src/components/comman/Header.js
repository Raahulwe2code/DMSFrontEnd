import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const Header = () => {
  const [newClass, setNewClass] = useState(false);
  function AddBodyClassFunction() {
    alert("kkkk");
    // document.body.classList.add('salmon');
    // overlay-open ls-closed
    document.body.classList.remove("overlay-open", "ls-closed");

    document.body.classList.add("ls-closed");
  }

  function AddBodyClassFunctionn() {
    // setNewClass(true);
    if (newClass === false) {
      // document.body.classList.remove("ls-closed");
      document.body.classList.add("overlay-open");
      setNewClass(true);
    } else if (newClass === true) {
      document.body.classList.remove("overlay-open");

      document.body.classList.add("ls-closed");
      setNewClass(false);
    }
  }

  return (
    <>
      {/* <!-- Search Bar --> */}
      {/* <div className="search-bar">
        <div className="search-icon">
          <i className="material-icons">search</i>
        </div>
        <input type="text" placeholder="START TYPING..." />
        <div className="close-search">
          <i className="material-icons">close</i>
        </div>
      </div> */}
      {/* <!-- #END# Search Bar --> */}

      {/* <!-- Top Bar --> */}
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link
              to=""
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse"
              aria-expanded="false"
              // onClick={() => {
              //   AddBodyClassFunction();
              // }}
            ></Link>
            <Link
              to=""
              className="bars"
              onClick={() => {
                AddBodyClassFunctionn();
              }}
            ></Link>
            <Link className="navbar-brand" to="/home">
              Document Management System
            </Link>
          </div>
        </div>
      </nav>
      {/* <!-- #Top Bar --> */}

      {/* // sidebar0------------ */}

      <SideBar newClass={newClass} />
    </>
  );
};

export default Header;
