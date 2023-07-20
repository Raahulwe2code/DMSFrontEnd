import React, { useEffect, useState } from "react";
import {
  GetDashBoardDetails,
  getUserByID,
  ProfileUpdatefuntion,
} from "../../api/api";

import Header from "../comman/Header";
import userImage from "../comman/images/userLogo.jpg";
import useValidation from "../comman/useValidation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
  let encoded;
  const [getData, setGetData] = useState([]);
  const [apicall, setapicall] = useState(false);
  const user_type = localStorage.getItem("user_type");
  const [ProfileUpload, setProfileUpload] = useState("");
  const [ProfileType, setProfileType] = useState("");
  const [customvalidated, setcustomValidated] = useState("");
  const [getDashBoardData, setDashBoardData] = useState([]);

  const id =
    user_type === "admin"
      ? localStorage.getItem("admin_id")
      : localStorage.getItem("employee_id");

  const admin_id = localStorage.getItem("admin_id");

  //intial form state for profile data-------------
  const initialFormState = {
    id: "",
    name: "",
    phone_no: "",
    email: "",
    profile_picture: ProfileUpload,
    profile_picture_type: ProfileType,
  };

  // UseEffect funtion for get user details and get deshboard details ----------------------
  useEffect(() => {
    getUserDetails(id);
    getDashBorad_details(admin_id);
  }, [apicall, id, admin_id]);

  //funtion for get user details by id- and set the state---------------
  const getUserDetails = async (id) => {
    const response = await getUserByID(id);
    setGetData(response[0]);
    setState(response[0]);
    setapicall(false);
  };

  // funtion for get deshboard details by id----------------------
  const getDashBorad_details = async (admin_id) => {
    const response = await GetDashBoardDetails(admin_id);
    setDashBoardData(response[0]);
  };

  // validators variable for validate the profile input feild--------------------
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
  };

  // import useValidation function validation----
  const {
    state,
    setState,
    onInputChange,
    errors,

    validate,
  } = useValidation(initialFormState, validators);

  // funtion for base 64 file reader
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      const { name } = file;
      fileReader.addEventListener("load", () => {
        resolve({ name: name, base64: fileReader.result });
      });
      fileReader.readAsDataURL(file);
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // onChange function for document upload and formate validation
  const imguploadchange = async (e) => {
    encoded = await convertToBase64(e.target.files[0]);
    const [first, ...rest] = encoded.base64.split(",");
    let imgvalidation = first.split("/").pop();

    if (
      imgvalidation === "jpeg;base64" ||
      imgvalidation === "jpg;base64" ||
      imgvalidation === "png;base64"
    ) {
      const productimg = rest.join("-");
      setProfileUpload(productimg);

      setcustomValidated("");
    } else {
      setcustomValidated("imgformat");
    }

    imgvalidation = imgvalidation.replace(";base64", "");
    setProfileType(imgvalidation);
    // e.target.value = null;
  };

  //funtion for update the profile of Employee and admin---------------------
  const onUserUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      const response = await toast.promise(
        ProfileUpdatefuntion(
          state.id,
          state.name,
          state.phone_no,
          state.email,
          ProfileUpload,
          ProfileType
        ),
        {
          pending: "Profile is updating",
          // success: "Upload compelete👌",
        }
      );

      // const response = await ProfileUpdatefuntion(
      //   state.id,
      //   state.name,
      //   state.phone_no,
      //   state.email,
      //   ProfileUpload,
      //   ProfileType
      // );

      if (response.message === "Updated user profile successfully") {
        toast.success("Profile update successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        getUserDetails(id);
        setapicall(true);
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Header />
      <section className="content">
        <div className="container-fluid">
          <div className="row clearfix">
            <div className="col-xs-12 col-sm-3">
              <div className="card profile-card">
                <div className="profile-header">&nbsp;</div>
                <div className="profile-body">
                  <div className="image-area">
                    {/* <img
                      src={getData.profile_picture}
                      alt="AdminBSB - Profile Image"
                      style={{ height: "150px", width: "150px" }}
                    /> */}
                    <img
                      alt={getData.profile_picture}
                      src={
                        getData.profile_picture
                          ? getData.profile_picture
                          : userImage
                      }
                      style={{ height: "150px", width: "150px" }}
                    />
                  </div>
                  <div className="content-area">
                    <h3>{getData.name}</h3>
                    <p>Mobile:- {getData.phone_no}</p>
                    <p> {getData.type === "employee" ? "Employee" : "Admin"}</p>
                  </div>
                </div>
                <div className="profile-footer">
                  <ul>
                    <li>
                      <span>Client</span>
                      <span>{getDashBoardData.clients}</span>
                    </li>
                    {user_type === "admin" ? (
                      <li>
                        <span>Employee</span>
                        <span>{getDashBoardData.employee}</span>
                      </li>
                    ) : null}

                    <li>
                      <span>Document</span>
                      <span>{getDashBoardData.document}</span>
                    </li>
                  </ul>
                  <button className="btn btn-primary btn-lg waves-effect btn-block">
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-9">
              <div className="card">
                <div className="body">
                  <div>
                    <ul className="nav nav-tabs" role="tablist">
                      <li role="presentation" className="active">
                        <a
                          href="#profile_settings"
                          aria-controls="profile_settings"
                          role="tab"
                          data-toggle="tab"
                        >
                          Profile
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content">
                      <div
                        role="tabpanel"
                        className="tab-pane fade in active"
                        id="profile_settings"
                      >
                        <form
                          className="form-horizontal"
                          onSubmit={onUserUpdate}
                        >
                          <div className="form-group">
                            <label
                              htmlFor="NameSurname"
                              className="col-sm-2 control-label"
                            >
                              Name
                            </label>
                            <div className="col-sm-10">
                              <div className="form-line">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  name="name"
                                  value={state.name}
                                  onChange={onInputChange}
                                  placeholder="Enter name"
                                />
                              </div>
                              {errors.name
                                ? (errors.name || []).map((error, i) => {
                                    return (
                                      <small
                                        className="text-danger error_massage"
                                        key={i}
                                      >
                                        {error}
                                      </small>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="phone_no"
                              className="col-sm-2 control-label"
                            >
                              Phone No.
                            </label>
                            <div className="col-sm-10">
                              <div className="form-line">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="phone_no"
                                  value={state.phone_no}
                                  onChange={onInputChange}
                                />
                              </div>
                              {errors.phone_no
                                ? (errors.phone_no || []).map((error, i) => {
                                    return (
                                      <small
                                        className="text-danger error_massage"
                                        key={i}
                                      >
                                        {error}
                                      </small>
                                    );
                                  })
                                : null}
                            </div>
                          </div>

                          <div className="form-group">
                            <label
                              htmlFor="InputSkills"
                              className="col-sm-2 control-label"
                            >
                              Profile Picture
                            </label>

                            <div className="col-sm-10">
                              <div className="form-line">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="profile_picture"
                                  onChange={(e) => imguploadchange(e)}
                                />
                              </div>

                              {customvalidated === "imgformat" ? (
                                <span
                                  className="mt-2   text-center fs-6 text-danger"
                                  type="invalid"
                                >
                                  Image Format should be in jpg, jpeg or png,
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <div className="form-group">
                            <label
                              htmlFor="Email"
                              className="col-sm-2 control-label"
                            >
                              Email
                            </label>
                            <div className="col-sm-10">
                              <div className="form-line">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  value={state.email}
                                  onChange={onInputChange}
                                  placeholder="Email"
                                />
                              </div>
                              {errors.email
                                ? (errors.email || []).map((error, i) => {
                                    return (
                                      <small
                                        className="text-danger error_massage"
                                        key={i}
                                      >
                                        {error}
                                      </small>
                                    );
                                  })
                                : null}
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                              <button type="submit" className="btn btn-danger">
                                Update profile
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Profile;
