import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddUsers } from "../../api/api";
import useValidation from "../comman/useValidation";
import Swal from "sweetalert2";
// import Loader from "../comman/loader";
const Register = () => {
  const [loadidng, setLoading] = useState(false);
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

  const navigate = useNavigate();

  // funtion for validation comes form useValidation hook
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/;
  const validators = {
    name: [
      (value) =>
        value === null || value === ""
          ? "Name is required"
          : /[^A-Za-z 0-9]/g.test(value)
          ? "Cannot use special character "
          : value.length <= 2
          ? "Name should be atleaset 3 charcter"
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
        value === null || value === ""
          ? "Password is required"
          : !passwordRegex.test(value)
          ? "Password must contain at least 5 characters, one letter, one number, and one special character (@$!%*#?&)"
          : value.length <= 4
          ? "Password should be atleaset 5 charcter"
          : null,
    ],
  };

  //useVAlidation custom validation--- import
  const {
    state,
    setState,
    onInputChange,
    errors,
    setErrors,
    validate,
  } = useValidation(initialFormState, validators);

  // function for register admin ---
  const onAddAdmin = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const response = await AddUsers(state);
      setLoading(false);
      if (
        response.response ===
        "email already exist, check your mail or try after sometime"
      ) {
        setErrors("already");
      }
      if (response.message === "user added successfully") {
        Swal.fire({
          title: "Success",
          text: "You registered as a admin",
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
      {/* {loadidng === true ? <Loader /> : null} */}
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
                    onAddAdmin(e);
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
                        maxLength="10"
                        value={state.phone_no}
                        name="phone_no"
                        onChange={(v) => {
                          if (v.target.value.length <= 10) {
                            onInputChange(v);
                          }
                        }}
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
                        type="text"
                        className="form-control"
                        value={state.email}
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
                    {errors === "already" ? (
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

                      <span className="get_link_btn">SIGN UP</span>
                    </div>
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
