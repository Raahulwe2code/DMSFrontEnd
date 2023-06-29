import React from "react";
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

const Layout = () => {
  const adminToken = localStorage.getItem("admin_token");
  console.log("admin--" + adminToken);
  return (
    <>
      <div className="theme-red ">
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}

          <Route
            path="/"
            element={adminToken ? <Navigate to="/home" /> : <Login />}
          />

          <Route path={"/signup"} element={<Register />} />
          <Route path={"/forgetepassword"} element={<ForgetPassword />} />
        </Routes>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route path={"/home"} element={<Home />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/clients"} element={<Clients />} />
            <Route path={"/blank"} element={<BlankPage />} />
            <Route path={"/gallary"} element={<Gallary />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default Layout;
