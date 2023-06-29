import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Admin_login_function } from "../../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [emailerror, setemailerror] = useState(false);
  const [emailVal, setemailVal] = useState("");
  const [passval, setpassval] = useState("");

  // onchange for email input field
  const onEmailChange = (e) => {
    setemailVal(e.target.value);
    setemailerror(false);
  };

  //onchange for password input field
  const onPasswordChange = (e) => {
    setpassval(e.target.value);
    setemailerror(false);
  };

  // funtion for  login button submitted------
  async function sign_up_btn(event) {
    event.preventDefault();
    let result = await Admin_login_function(emailVal, passval);
    const { resCode } = result;
    console.log("rescode---" + resCode);
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
      <div class="login-page">
        <div class="login-box">
          <div class="logo">
            <Link to="">
              <b>DMS</b>
            </Link>
            <small>Document Management System</small>
          </div>
          <div class="card">
            <div class="body">
              <form id="sign_in" onSubmit={sign_up_btn}>
                <div class="msg">Sign in to start your session</div>
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="material-icons">person</i>
                  </span>
                  <div class="form-line">
                    <input
                      type="text"
                      class="form-control"
                      name="email"
                      placeholder="email"
                      onChange={(e) => {
                        onEmailChange(e);
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                <div class="input-group">
                  <span class="input-group-addon">
                    <i class="material-icons">lock</i>
                  </span>
                  <div class="form-line">
                    <input
                      type="password"
                      class="form-control"
                      name="password"
                      onChange={(e) => onPasswordChange(e)}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-8 p-t-5 text-danger">
                    {emailerror === "email not found"
                      ? "Email not found"
                      : emailerror === "passsword not matched"
                      ? "Password not matched"
                      : emailerror === "please fill Credentials"
                      ? "please fill Credentials"
                      : null}
                  </div>
                  <div class="col-xs-4">
                    <button
                      class="btn btn-block bg-pink waves-effect"
                      type="submit"
                    >
                      SIGN IN
                    </button>
                  </div>
                </div>
                <div class="row m-t-15 m-b--20">
                  <div class="col-xs-6 ">
                    <Link to="/signup">Admin Registraion!</Link>
                  </div>
                  <div class="col-xs-6 align-right">
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
