import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Admin_login_function } from "../../api/api";
// import Loader from "../comman/loader";
const Login = () => {
  // clear funtion for clear the local storage when open login page
  localStorage.clear();
  const navigate = useNavigate();
  const [emailerror, setemailerror] = useState(false);
  const [emailVal, setemailVal] = useState("");
  const [passval, setpassval] = useState("");
  const [loadidng, setLoading] = useState(false);

  // onchange for email input field
  const onEmailChange = (e) => {
    setemailVal(e.target.value);
    setemailerror(false);
  };

  //onchange for password input field and hide the email error massage-------
  const onPasswordChange = (e) => {
    setpassval(e.target.value);
    setemailerror(false);
  };

  // funtion for  login button submitted------
  async function sign_up_btn(event) {
    event.preventDefault();
    setLoading(true);
    let result = await Admin_login_function(emailVal, passval);
    const { resCode } = result;
    setLoading(false);

    if (resCode === "103") {
      setemailerror("email not found");
    } else if (resCode === "102") {
      setemailerror("passsword not matched");
    } else if (resCode === "104") {
      setemailerror("please fill Credentials");
    } else {
      const { token, userDetail } = result;

      if (userDetail[0].admin_id === 0) {
        localStorage.setItem("admin_id", userDetail[0].id);
        localStorage.setItem("user_type", userDetail[0].type);
        localStorage.setItem("admin_name", userDetail[0].name);
        localStorage.setItem("admin_email", userDetail[0].email);
        localStorage.setItem("admin_token", token);
      } else {
        localStorage.setItem("employee_id", userDetail[0].id);
        localStorage.setItem("admin_id", userDetail[0].admin_id);
        localStorage.setItem("user_type", userDetail[0].type);
        localStorage.setItem("admin_name", userDetail[0].name);
        localStorage.setItem("admin_email", userDetail[0].email);
        localStorage.setItem("admin_token", token);
      }

      navigate("/home");
    }
  }
  return (
    <>
      {/* {loadidng === true ? <Loader /> : null} */}
      <div className="login-page">
        <div className="login-box">
          <div className="logo">
            <Link to="">
              <b>DMS</b>
            </Link>
            <small>Document Management System</small>
          </div>
          <div className="card">
            <div className="body">
              <form id="sign_in" onSubmit={sign_up_btn}>
                <div className="msg">Sign in to start your session</div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">person</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="email"
                      onChange={(e) => {
                        onEmailChange(e);
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="material-icons">lock</i>
                  </span>
                  <div className="form-line">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      onChange={(e) => onPasswordChange(e)}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-8 p-t-5 text-danger">
                    {emailerror === "email not found"
                      ? "Email not found"
                      : emailerror === "passsword not matched"
                      ? "Password not matched"
                      : emailerror === "please fill Credentials"
                      ? "please fill Credentials"
                      : null}
                  </div>
                  <div className="col-xs-4">
                    <button
                      className="btn btn-block btn-lg bg-pink waves-effect"
                      type="submit"
                    >
                      {" "}
                      <div
                        className={
                          loadidng === true
                            ? "get_link_spinner loader_btn"
                            : "loader_btn"
                        }
                      >
                        <div className="preloader pl-size-xs">
                          <div className="spinner-layer pl-red-grey">
                            <div className="circle-clipper left">
                              <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                              <div className="circle"></div>
                            </div>
                          </div>
                        </div>

                        <span className="get_link_btn">SIGN IN</span>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="row m-t-15 m-b--20">
                  <div className="col-xs-6 ">
                    <Link to="/signup">Admin Registraion!</Link>
                  </div>
                  <div className="col-xs-6 align-right">
                    <Link to="/forgetepassword">Forgot Password?</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <!-- Jquery Core Js --> */}
        <script src="../../plugins/jquery/jquery.min.js"></script>

        {/* <!-- Bootstrap Core Js --> */}
        <script src="../../plugins/bootstrap/js/bootstrap.js"></script>

        {/* <!-- Waves Effect Plugin Js --> */}
        <script src="../../plugins/node-waves/waves.js"></script>

        {/* <!-- Validation Plugin Js --> */}
        <script src="../../plugins/jquery-validation/jquery.validate.js"></script>

        {/* <!-- Custom Js --> */}
        <script src="../../js/admin.js"></script>
        <script src="../../js/pages/examples/sign-in.js"></script>
      </div>
    </>
  );
};

export default Login;
