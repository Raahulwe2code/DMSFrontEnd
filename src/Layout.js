import React, { useEffect, useState } from "react";
import { Route, Navigate, Routes } from "react-router-dom";

import Home from "./components/pages/Home";
import BlankPage from "./components/pages/BlankPage";
import ForgetPassword from "./components/pages/ForgetPassword";
import Gallary from "./components/pages/Gallary";
import Login from "./components/pages/login";
import Register from "./components/pages/Register";
import Clients from "./components/pages/Clients";
import Users from "./components/pages/Users";
import AuthWrapper from "./components/comman/AuthWrapper";
import ResetPassword from "./components/pages/ResetPassword";
import Profile from "./components/pages/Profile";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const adminToken = localStorage.getItem("admin_token");

  console.log("admin--" + isLoggedIn);
  useEffect(() => {
    if (adminToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);
  return (
    <>
      <div className="theme-red ">
        <Routes>
          {/* <Route exact path="/" element={<Login />} /> */}

          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Login />
              ) : isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Login />
              )
            }
          />
          <Route e path={"/signup"} element={<Register />} />
          <Route path={"/forgetepassword"} element={<ForgetPassword />} />
          <Route path={"/resetpassword"} element={<ResetPassword />} />
          <Route exact element={<AuthWrapper />}>
            <Route path={"/home"} element={<Home />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/clients"} element={<Clients />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"*"} element={<BlankPage />} />
            <Route path={"/gallary"} element={<Gallary />} />
          </Route>
        </Routes>
        {/* <Routes>
          <Route exact element={<AuthWrapper />}>
            <Route exact path={"/home"} element={<Home />} />
            <Route exact path={"/users"} element={<Users />} />
            <Route exact path={"/clients"} element={<Clients />} />
            <Route exact path={"/blank"} element={<BlankPage />} />
            <Route exact path={"/gallary"} element={<Gallary />} />
          </Route>
        </Routes> */}
      </div>
    </>
  );
};

export default Layout;
