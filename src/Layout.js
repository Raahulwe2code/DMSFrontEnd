import React from "react";
import { Route, Routes } from "react-router-dom";

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
import DoumentUpload from "./components/pages/DoumentUpload";
import LoginSuperAdmin from "./components/superAdminPage/LoginSuperAdmin";
import HomeSuperAdmin from "./components/superAdminPage/HomeSuperAdmin";
import DoumentUploadSuperAdmin from "./components/superAdminPage/DoumentUploadSuperAdmin";
import EmployeeSuperAdmin from "./components/superAdminPage/EmployeeSuperAdmin";
import ClientsSuperAdmin from "./components/superAdminPage/ClientsSuperAdmin";
import SuperAdminBlankPage from "./components/superAdminPage/SuperAdminBlankPage";
import GallarySuperAdmin from "./components/superAdminPage/GallarySuperAdmin";
import AllAdminSuperAdmin from "./components/superAdminPage/AllAdminSuperAdmin";
import SuperAdminAuthWrapper from "./components/comman/SuperAdminAuthWrapper";

const Layout = () => {
  let path = window.location.pathname;

  const superAdmin = path.includes("/superAdmin");

  return (
    <>
      <div className="theme-red ">
        {superAdmin === true ? (
          <Routes>
            <Route path={"/superAdmin/Login"} element={<LoginSuperAdmin />} />

            <Route exact element={<SuperAdminAuthWrapper />}>
              <Route path={"/superAdmin/Home"} element={<HomeSuperAdmin />} />
              <Route
                path={"/superAdmin/AllAdmin"}
                element={<AllAdminSuperAdmin />}
              />
              <Route
                path={"/superAdmin/doumentUpload"}
                element={<DoumentUploadSuperAdmin />}
              />

              <Route
                path={"/superAdmin/Employee"}
                element={<EmployeeSuperAdmin />}
              />
              <Route
                path={"/superAdmin/clients"}
                element={<ClientsSuperAdmin />}
              />

              <Route path={"*"} element={<SuperAdminBlankPage />} />
              <Route
                path={"/superAdmin/gallary"}
                element={<GallarySuperAdmin />}
              />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route e path={"/signup"} element={<Register />} />
            <Route path={"/forgetepassword"} element={<ForgetPassword />} />
            <Route path={"/resetpassword"} element={<ResetPassword />} />
            <Route path={"/doumentUpload"} element={<DoumentUpload />} />

            <Route exact element={<AuthWrapper />}>
              <Route path={"/home"} element={<Home />} />
              <Route path={"/users"} element={<Users />} />
              <Route path={"/clients"} element={<Clients />} />
              <Route path={"/profile"} element={<Profile />} />
              <Route path={"*"} element={<BlankPage />} />
              <Route path={"/gallary"} element={<Gallary />} />
            </Route>
          </Routes>
        )}
      </div>
    </>
  );
};

export default Layout;
