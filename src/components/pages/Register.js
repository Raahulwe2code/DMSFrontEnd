import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddUsers } from "../../api/api";
import useValidation from "../comman/useValidation";
import Swal from "sweetalert2";
const Register = () => {
  // intial state for register input form feild--------
  const initialFormState = {
    admin_id: "0",
    type: "admin",
    name: "",
    phone_no: "",
    is_active: "1",
    email: "",
    password: "",
  };

  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  // funtion for validation comes form useValidation hook
  const validators = {
    name: [
      (value) =>
        value === null || value === ""
          ? "Name is required"
          : /[^A-Za-z 0-9]/g.test(value)
          ? "Cannot use special character "
          : null,
    ],
    phone_no: [
      (value) =>
        value === null || value === ""
          ? "Phone number is required"
          : // : /^(\+\d{1,3}[- ]?)?\d{10}$/g.test(value)
          // ? "Invalid Mobile number "
          value.length > 10 || value.length < 10
          ? "Contect number should be 10 digit"
          : null,
    ],
    email: [
      (value) =>
        value === null || value === ""
          ? "Email address is required"
          : !/^\S+@\S+\.\S+$/.test(value)
          ? "Invalid email address"
          : null,
    ],

    password: [
      (value) =>
        value === null || value === "" ? "Password is required" : null,
    ],
  };

  //useVAlidation custom validation--- import
  const { state, setState, onInputChange, errors, validate } = useValidation(
    initialFormState,
    validators
  );

  // function for register admin ---
  const onUserAdd = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await AddUsers(state);

      if (
        response.response ===
        "email already exist, check your mail or try after sometime"
      ) {
        setEmailError(true);
      }
      if (response.message === "user added successfully") {
        Swal.fire({
          title: "Success",
          text: "Registered succuesfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(function() {
          navigate("/");
          setState(initialFormState);
        });
      }
    }
  };

  return (
    <>
      <div className="theme-red ">
        <div className="signup-page">
          <div className="signup-box">
            <div className="logo">
              <Link to="">
                <b>DMS</b>
              </Link>
              <small>Document Management System</small>
            </div>
            <div className="card">
              <div className="body">
                <form
                  onSubmit={(e) => {
                    onUserAdd(e);
                  }}
                >
                  <div className="msg">Registration for Admin</div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">person</i>
                    </span>
                    <div className="form-line">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        value={state.name}
                        name="name"
                        maxLength={30}
                        onChange={onInputChange}
                        autoFocus
                      />
                    </div>
                    {errors.name
                      ? (errors.name || []).map((error, i) => {
                          return (
                            <small className="text-danger" key={i}>
                              {error}
                            </small>
                          );
                        })
                      : null}
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">phone</i>
                    </span>
                    <div className="form-line">
                      <input
                        type="number"
                        className="form-control"
                        // max="10"
                        value={state.phone_no}
                        name="phone_no"
                        onChange={onInputChange}
                        placeholder="Mobile"
                      />
                    </div>
                    {errors.phone_no
                      ? (errors.phone_no || []).map((error, i) => {
                          return (
                            <small className="text-danger" key={i}>
                              {error}
                            </small>
                          );
                        })
                      : null}
                  </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">email</i>
                    </span>
                    <div className="form-line">
                      <input
                        type="email"
                        className="form-control"
                        value={state.email}
                        maxLength={30}
                        name="email"
                        onChange={onInputChange}
                        placeholder="Email Address"
                      />
                    </div>
                    {errors.email
                      ? (errors.email || []).map((error, i) => {
                          return (
                            <small className="text-danger" key={i}>
                              {error}
                            </small>
                          );
                        })
                      : null}
                    {emailError === true ? (
                      <small className="text-danger">
                        Email Already Registered Please try another email
                      </small>
                    ) : null}
                  </div>

                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="material-icons">lock</i>
                    </span>
                    <div className="form-line">
                      <input
                        type="password"
                        className="form-control"
                        value={state.password}
                        name="password"
                        onChange={onInputChange}
                        minLength={4}
                        maxLength={15}
                        placeholder=" Password"
                      />
                    </div>
                    {errors.password
                      ? (errors.password || []).map((error, i) => {
                          return (
                            <small className="text-danger" key={i}>
                              {error}
                            </small>
                          );
                        })
                      : null}
                  </div>

                  <button
                    className="btn btn-block btn-lg bg-pink waves-effect"
                    type="submit"
                  >
                    SIGN UP
                  </button>

                  <div className="m-t-25 m-b--5 align-center">
                    <Link to="/">You already have a membership?</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
