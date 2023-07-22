import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";

const SuperAdminAuthWrapper = () => {
  const location = useLocation(); // current location

  const SuperAdminLogged = localStorage.getItem("super_admin_token");
  return SuperAdminLogged === null ||
    SuperAdminLogged === "" ||
    SuperAdminLogged === undefined ? (
    <Navigate
      to="/superAdmin/Login"
      replace
      state={{ from: location }} // <-- pass location in route state
    />
  ) : (
    <Outlet />
  );
};

export default SuperAdminAuthWrapper;
