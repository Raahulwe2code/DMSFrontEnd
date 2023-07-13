import axios from "axios";
const admin_token = localStorage.getItem("admin_token");

export const AddClientByadmin = async (props) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/add_clients`,
    props
  );
  return response.data;
};

export const getAllClients = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/get_clients`,
    {
      admin_id: id,
    }
  );
  return response.data;
};

export const AddUsers = async (props) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/add_users`,
    props
  );
  return response.data;
};

export const getAllUsers = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/get_users`,
    {
      admin_id: id,
    }
  );
  return response.data;
};

export const getAllUserswithFilter = async (id, name, type, currentPage) => {
  var limit = 3;
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/search_clients?admin_id=${id}&page=${currentPage}&limit=${limit}`,
    {
      name: name,
      type: type,
    }
  );
  return response.data;
};
export const Admin_login_function = async (email, password) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/admin_login`,
    {
      email: email,
      password: password,
    }
  );
  return response.data;
};

export const getUserByID = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/getUserById`,
    {
      id: id,
    }
  );
  return response.data;
};

export const UpdateUser = async (props) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/update_user`,
    props,
    {
      headers: { admin_token: admin_token },
    }
  );
  return response.data;
};

export const deleteUserfunction = async (id) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/delete_user`,
    {
      id: id,
      is_deleted: "1",
    }
  );
  return response.data;
};

export const getAllEmployeeswithFilter = async (id, name, currentPage) => {
  var limit = 2;
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/search_user?admin_id=${id}&page=${currentPage}&limit=${limit}`,
    {
      name: name,
    }
  );
  return response.data;
};
export const getClientByID = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/get_client_by_Id`,
    {
      id: id,
    }
  );
  return response.data;
};

export const UpdateClient = async (props) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/update_client`,
    props
  );
  return response.data;
};

export const deleteClientfunction = async (id) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/delete_client`,
    {
      id: id,
      is_deleted: "1",
    }
  );
  return response.data;
};

export const AddDocument = async (props) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/document_upload`,
    props
  );
  return response.data;
};

export const getDocument = async (id, name, type, currentPage, limit) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/search_document?client_id=${id}&page=${currentPage}&limit=${limit}`,
    {
      document_title: name,
      document_type: type,
    }
  );
  return response.data;
};

export const deleteDocumentfunction = async (id) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/delete_document`,
    {
      id: id,
      is_deleted: "1",
    }
  );
  return response.data;
};

export const createZipAndUpload = async (email, content, clientNmae) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("file", content, `${clientNmae}.zip`);
  formData.append("client_name", clientNmae);
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/send_mail`,
    formData
  );
  return response.data;
};

export const ForgetPasswordFunction = async (email) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/forget_password`,
    { email: email }
  );
  return response.data;
};

export const ResetPasswordFunction = async (password, token) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/reset_password`,
    { password: password },
    {
      headers: { email_token: token },
    }
  );
  return response.data;
};

export const GetDashBoardDetails = async (admin_id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASEURL}/get_dashboard_details`,
    { admin_id: admin_id }
  );
  return response.data;
};

export const ProfileUpdatefuntion = async (
  id,
  name,
  phone_no,
  email,
  profile_picture,
  profile_type
) => {
  const response = await axios.put(
    `${process.env.REACT_APP_BASEURL}/user_profile_update`,
    {
      id: id,
      name: name,
      phone_no: phone_no,
      email: email,
      profile_picture: profile_picture,
      profile_picture_type: profile_type,
    }
  );
  return response.data;
};
