import React, { useEffect, useState } from "react";
import $ from "jquery";
import pdfLogo from "../comman/images/PDF.png";
import msDoc from "../comman/images/msss.jpg";
import msXls from "../comman/images/excel.png";
import Header from "../comman/Header";

import { Link, useSearchParams } from "react-router-dom";
import {
  AddDocument,
  createZipAndUpload,
  deleteDocumentfunction,
  getDocument,
} from "../../api/api";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LightGallery from "lightgallery/react/Lightgallery.es5";
import "lightgallery/css/lightgallery.css";

import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-rotate.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgVideo from "lightgallery/plugins/video";
import lgShare from "lightgallery/plugins/share";
import lgRotate from "lightgallery/plugins/rotate";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Loader from "../comman/loader";

import ReactPaginate from "react-paginate";

const Gallary = () => {
  const [searchparams] = useSearchParams();
  const [clientToken, setClientToken] = useState("");
  let encoded;

  // let checkboxUrl = [];

  const [isEmptyDocument, setIsEmptyDocument] = useState(null);
  const [getStateLoader, setGetStateLoader] = useState(false);
  const [downlaodLoader, setDownloadLoader] = useState(false);
  const [isSelectboxChecked, setIsSelectBoxChecked] = useState(false);
  const [copyUrl, setCopyUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(12);
  const [loadidng, setLoading] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const admin_id = localStorage.getItem("admin_id");
  const [fileUrls, setFileUrls] = useState([]);
  const [searchDocumentName, setSearchDocumentName] = useState("");
  const [searchDocumenttype, setSearchDocumentType] = useState("");
  const [customvalidated, setcustomValidated] = useState("");
  const [modelshow, setModelshow] = useState(false);
  const [emailBtnLoader, setEmailBtnLoader] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [DocumentUpload, setDocumentUpload] = useState(null);

  const [getDocumentData, setGetDocmentData] = useState([]);
  const [apicall, setapicall] = useState(false);

  const [clienttId, setClientID] = useState("");

  const clientNamee = localStorage.getItem("client_name");
  const clientEmail = localStorage.getItem("client_email");
  const [senderEmail, setSenderEmail] = useState(clientEmail);

  const [modelView, setModelView] = useState(false);
  const [modelVieww, setModelVieww] = useState(false);
  const id = searchparams.get("client_id");

  // useEffect function for get client id from parameter-----------------
  useEffect(() => {
    if (
      searchparams.get("client_id") === null ||
      searchparams.get("client_id") === "" ||
      searchparams.get("client_id") === undefined
    ) {
      setClientID("");
    } else {
      setClientID(searchparams.get("client_id"));
    }

    if (
      searchparams.get("client_token") === null ||
      searchparams.get("client_token") === "" ||
      searchparams.get("client_token") === undefined
    ) {
      setClientToken("");
    } else {
      setClientToken(searchparams.get("client_token"));
    }

    if (searchparams.get("loading") === "false") {
      setLoading(true);
    }
  }, [id, clienttId, clientToken]);

  // onchange for document name set and empty custom validation state----
  const OndocumentName = (e) => {
    setDocumentName(e.target.value);
    setcustomValidated("");
  };

  //intial state of model input field-- for upload documnet--------------------
  const initialFormState = {
    admin_id: admin_id,
    client_id: clienttId,
    client_name: clientNamee,
    document_title: documentName,
    document_type: documentType,
    document_url: DocumentUpload,
  };

  // funtion for close model and reset document name and customvalidation and upload input field
  const onCloseModel = () => {
    setModelView(false);
    setModelVieww(false);
    setDocumentName("");
    setcustomValidated("");
    setDocumentUpload(null);
  };

  // funtion for model open and reset customvalidation and document name and customvalidation
  const onModelOpen = async () => {
    setModelView(true);
    setModelshow(false);
    setcustomValidated("");
    setDocumentName("");
    setDocumentUpload(null);
  };

  // funtion for base 64 file reader for upload document -------------
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
      imgvalidation === "png;base64" ||
      imgvalidation === "pdf;base64" ||
      imgvalidation === "csv;base64" ||
      imgvalidation === "msword;base64" ||
      imgvalidation ===
        "vnd.openxmlformats-officedocument.wordprocessingml.document;base64" ||
      imgvalidation === "vnd.ms-excel;base64" ||
      imgvalidation ===
        "vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64"
    ) {
      const productimg = rest.join("-");
      setDocumentUpload(productimg);

      setcustomValidated("");
    } else {
      setcustomValidated("imgformat");
    }

    imgvalidation = imgvalidation.replace(";base64", "");

    setDocumentType(imgvalidation);
    // e.target.value = null;
  };

  // funtion for add document
  const addDocument = async (e) => {
    e.preventDefault();

    if (documentName === "") {
      setcustomValidated("name is empty");
    } else if (DocumentUpload === null) {
      setcustomValidated("document is empty");
    } else {
      setSubmitLoader(true);

      const response = await toast.promise(AddDocument(initialFormState), {
        pending: "Document upload  pending",
        // success: "Upload compelete👌",
      });

      if (response.message === "Document upload successfully") {
        toast.success("Document Upload Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });

        getDocumentByid(clienttId);
        setModelView(false);

        setDocumentName("");
        setDocumentUpload(null);
        setapicall(true);
      }
      setSubmitLoader(false);
      $("#img_64").val("");
      setModelView(false);
      setapicall(false);
    }
  };

  // useEffect get document based on client id----
  useEffect(() => {
    getDocumentByid(clienttId);
  }, [apicall, searchDocumentName, searchDocumenttype, currentPage, limit]);

  //function for get document based on client id
  const getDocumentByid = async (clienttId) => {
    setGetStateLoader(true);
    const response = await getDocument(
      id,
      searchDocumentName,
      searchDocumenttype,
      currentPage,
      limit
    );
    setLoading(false);
    setGetStateLoader(false);
    setGetDocmentData(response.data);

    if (searchDocumentName === "" && searchDocumenttype === "") {
      if (response.data.length > 0) {
        setIsEmptyDocument(false);
      } else {
        setIsEmptyDocument(true);
      }
    }

    if (response.totalPages === null) {
      setPageCount(1);
    } else {
      setPageCount(response.totalPages);
    }

    setapicall(false);
  };

  // onchange funtion for search document and api call ------------
  const DocumentNameOnChange = (e) => {
    setSearchDocumentName(e.target.value);
    setapicall(true);
  };

  // onchange funtion for search document with type and api call-----------
  const DocumentTypeOnChange = (e) => {
    setSearchDocumentType(e.target.value);
    setapicall(true);
  };

  // onchange funtion for get document data and add the isChecked attribute in get document JSON and  its value-----------------------
  const handleSelectAllChange = (v) => {
    setIsSelectBoxChecked(v.target.checked);
    setGetDocmentData((prevData) => {
      return prevData.map((item) => {
        return { ...item, isChecked: v.target.checked };
      });
    });
  };

  const unSelectAllChange = () => {
    setGetDocmentData((prevData) => {
      return prevData.map((item) => {
        return { ...item, isChecked: false };
      });
    });
  };

  // onchange funtion for checkbox value get and add into JSON if checkbox value is true/checked....
  const handleCheckboxChange = (event, id) => {
    setGetDocmentData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          return { ...item, isChecked: event.target.checked };
        }
        return item;
      })
    );
  };

  // onclick funtion for download  document and if do'nt select any documet than warning message is show------
  const handleDownload = async () => {
    let newArray = getDocumentData.filter(function(el) {
      return el.isChecked === true;
    });

    if (newArray.length === 0) {
      toast.error("Please Select any one for download", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      setDownloadLoader(true);
      const checkboxUrl = newArray.map((item) => item.document_url);

      const zip = new JSZip();

      try {
        // Fetch each file and add it to the zip
        const promises = checkboxUrl.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Failed to fetch file");
            }
            const data = await response.blob();
            const fileName = getFileNameFromURL(url); // Implement this function to extract the file name from the URL

            zip.file(fileName, data);
          } catch (error) {
            setDownloadLoader(false);
            unSelectAllChange();
            setIsSelectBoxChecked(false);
            console.error("Error fetching file:", error);
            // Handle errors, e.g., show an error toast for the failed file fetch
            toast.error("Failed to fetch a file. Please try again.", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            });
            throw error; // Rethrow the error to be caught in the Promise.all block
          }
        });

        await Promise.all(promises);

        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });

        const startTime = Date.now(); // Record the start time

        const endTime = Date.now(); // Record the end time
        const elapsed = endTime - startTime; // Calculate the elapsed time in milliseconds

        if (elapsed > 300000) {
          // More than 5 minutes
          toast.error("File size exceeded", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000, // Close the toast after 5 seconds
          });
        }

        saveAs(content, `${clientNamee}_Document.zip`);

        setDownloadLoader(false);
        unSelectAllChange();
        setIsSelectBoxChecked(false);
      } catch (error) {
        console.error("Error generating the zip file:", error);
        // Handle other errors if necessary
      }
    }
  };
  // onclick funtion for open mail box and if not select any document then warning message is show--
  const handleOpenMailBox = async () => {
    let newArray = getDocumentData.filter(function(el) {
      return el.isChecked === true;
    });

    if (newArray.length === 0) {
      toast.error("Please Select any one for Mail", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      setModelVieww(true);

      newArray.map((item) => {
        setFileUrls((prevArray) => [...prevArray, item.document_url]);
        return {};
      });
    }
  };

  // funtion for delete document  and sweet alert------
  const onDeleteModelClick = (name, id) => {
    Swal.fire({
      title: "Warning",
      text: `You want to delete ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSubmitLoader(true);
        const response = await deleteDocumentfunction(id);
        if (response.message === "delete document successfully") {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          setapicall(true);
          setSubmitLoader(false);
        }
      }
    });
    setapicall(false);
    setSubmitLoader(false);
  };

  //funtion for get file name from document_url array
  const getFileNameFromURL = (url) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  //funtion for create zip and and send upload on server in certain folder------
  const sendFiles = async (e) => {
    e.preventDefault();
    if (senderEmail === "") {
      setcustomValidated("email is empty");
    } else {
      setEmailBtnLoader(true);
      const zip = new JSZip();

      try {
        // Fetch each file and add it to the zip

        const promises = fileUrls.map(async (url) => {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Fetch error");
          }
          const data = await response.blob();
          const fileName = getFileNameFromURL(url);
          zip.file(fileName, data);
        });

        // Wait for all files to be added to the zip
        await Promise.all(promises);

        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });

        // Send the email and handle the response with a timeout
        let emailSent = false;
        const response = await Promise.race([
          createZipAndUpload(senderEmail, content, clientNamee),
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                message: "email took more than 3 minutes to send",
              });
            }, 60000); // 3 minutes timeout
          }),
        ]);

        setEmailBtnLoader(false);
        setIsSelectBoxChecked(false);

        if (response.message === "email send successfully") {
          // Email sent successfully
          emailSent = true;
          toast.success("Email sent successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }

        if (!emailSent) {
          // Email took more than 3 minutes to send
          toast.error("Sending email took longer than 3 minutes.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      } catch (error) {
        // Fetch error occurred while fetching the files
        toast.error("An error occurred while fetching the files.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setFileUrls([]);
        getDocumentByid(clienttId);
        setapicall(true);
      } finally {
        setEmailBtnLoader(false);
      }

      // Other logic for handling email sending and resetting state as needed
      getDocumentByid(clienttId);
      setSenderEmail("");
      setModelVieww(false);
      setapicall(true);
    }
  };

  // onclick funtion for select current page
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  //onchange funtion for get email value which is enter by the user ----------
  const handleInputChange = (e) => {
    setSenderEmail(e.target.value);
    setcustomValidated("");
  };

  // useEffect funtion for set the copy url value  with token ---------------
  const url = window.location.origin;
  useEffect(() => {
    setCopyUrl(`${url}/doumentUpload?client_token=${clientToken}`);
  }, [copyUrl]);

  // onclick function for copy clip board the path---------
  const copyClipBoradFuntion = () => {
    var copyText = document.getElementById("myInputforCopy");

    try {
      // Copy the text inside the text field
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(copyText.value)
          .then(() => {
            console.log("Text copied to clipboard");
          })
          .catch((error) => {
            console.error("Failed to copy text: ", error);
          });
      } else {
        // Fallback for browsers without clipboard API support
        var textArea = document.createElement("textarea");
        textArea.value = copyText.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log("Text copied to clipboard");
      }
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }

    // Alert the copied text
    toast.success("Copied to Clipborad", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  };
  const scrollApicall = async () => {
    // setGetScrolldata(true);

    const response = await getDocument(
      id,
      searchDocumentName,
      searchDocumenttype,
      currentPage,
      limit
    );
    setGetDocmentData((prevData) => [...prevData, ...response.data]);
    setCurrentPage((prevPage) => prevPage + 1);
    // setGetDocmentData(response.data);
  };

  return (
    <>
      <div className="theme-red ">
        <Header getstateLoader={getStateLoader} />
        {/* <SideBar /> */}
        {loadidng ? <Loader /> : null}
        {downlaodLoader ? <Loader /> : null}
        <section className="content">
          <div className="container-fluid">
            {/* <!-- Image Gallery --> */}

            <div className="block-header zip_downlode">
              <h2>{clientNamee.toUpperCase()}'S DOCUMENTS</h2>
              {getDocumentData.length === 0 ? null : (
                <div className="download_emai_btn d-flex">
                  <button
                    className="btn btn-info"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <i className="material-icons">get_app</i>
                  </button>
                  <button
                    id="mailBox"
                    className="btn btn-primary text-end"
                    onClick={handleOpenMailBox}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Email"
                  >
                    <i className="material-icons">email</i>
                  </button>

                  <input
                    type="text"
                    value={copyUrl}
                    id="myInputforCopy"
                    style={{ display: "none" }}
                    readOnly
                  ></input>
                  <button
                    id="mailBox"
                    className="btn  text-end"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Copy"
                    style={{ backgroundColor: "#bbbbbb" }}
                    onClick={copyClipBoradFuntion}
                  >
                    <i className="material-icons">content_copy</i>
                  </button>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="card document_card">
                  <div className="block-header">
                    {getDocumentData.length === 0 ? null : (
                      <div className="show_rows" style={{ display: "none" }}>
                        <label>Show:</label>
                        <select
                          className="form-control "
                          value={limit}
                          name="type"
                          onChange={(e) => setLimit(e.target.value)}
                        >
                          <option value={0}>All</option>
                          <option value={4}>4</option>
                          <option value={8}>{8}</option>
                          <option value={12}>{12}</option>
                        </select>
                      </div>
                    )}

                    <div className="text-right" style={{ width: "100%" }}>
                      <button
                        className="btn btn-success"
                        // data-toggle="modal"
                        // data-target="#exampleModal"
                        onClick={() => onModelOpen()}
                      >
                        ADD DOCUMENTS
                      </button>
                    </div>
                  </div>

                  <div className="body">
                    {isEmptyDocument ? null : (
                      <div className="row ">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <div className="form-line">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search by document name"
                                onChange={(e) => DocumentNameOnChange(e)}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="col-sm-5 filter_name_ext"
                          style={{ display: "none" }}
                        >
                          <div className="col-sm-6">
                            <select
                              className="form-control "
                              value={searchDocumenttype}
                              name="type"
                              onChange={(e) => DocumentTypeOnChange(e)}
                            >
                              <option value="" className="text-center">
                                -- Please select document type --
                              </option>
                              <option value="">All</option>
                              <option value="jpg">Jpg</option>
                              <option value="jpeg">Jpeg</option>
                              <option value="png">Png</option>
                              <option value="pdf">Pdf</option>
                              <option value="csv">Csv</option>
                              <option value="doc">Doc</option>
                              <option value="docx">Docx</option>
                              <option value="xls">Xls</option>
                              <option value="xlsx">Xlsx</option>
                            </select>
                          </div>
                        </div>
                        {getDocumentData.length === 0 ? null : (
                          <div className="col-sm-8 text-right">
                            <label>
                              <input
                                type="checkbox"
                                checked={isSelectboxChecked}
                                onChange={handleSelectAllChange}
                              />
                              <span> Select All</span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      id="aniimated-thumbnials"
                      className="list-unstyled row clearfix"
                      style={{ height: "300px", overflowY: "scroll" }}
                      onScroll={(e) => {
                        const element = e.target;
                        if (
                          element.scrollTop + element.clientHeight >=
                            element.scrollHeight &&
                          !getStateLoader
                        ) {
                          scrollApicall();
                        }
                      }}
                    >
                      {getDocumentData.length === 0 ? (
                        <h1 className="text-center">No record Found</h1>
                      ) : (
                        getDocumentData.map((item) => {
                          return (
                            <React.Fragment key={item.id}>
                              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 doucment_box">
                                {item.document_type === "pdf" ? (
                                  <React.Fragment key={item.id}>
                                    <Link
                                      to={item.document_url}
                                      target="_blank"
                                    >
                                      <img
                                        className="img-responsive thumbnail"
                                        src={pdfLogo}
                                        alt={pdfLogo}
                                      />
                                    </Link>
                                    <h4 style={{ textAlign: "center" }}>
                                      {" "}
                                      {item.document_title}.{item.document_type}
                                    </h4>

                                    <div className="profile_edit_delete">
                                      {/* <i
                                      class="material-icons text-primary"
                                      data-toggle="modal"
                                      data-target="#exampleModal"
                                      // onClick={() =>
                                      //   onUpdateModelClick(item.id)
                                      // }
                                    >
                                      edit
                                    </i> */}
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={item.isChecked}
                                          onChange={(e) => {
                                            handleCheckboxChange(e, item.id);
                                          }}
                                        />
                                      </label>
                                      <i
                                        className="material-icons text-danger"
                                        onClick={() =>
                                          onDeleteModelClick(
                                            item.document_title,
                                            item.id
                                          )
                                        }
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </React.Fragment>
                                ) : item.document_type === "doc" ||
                                  item.document_type === "docx" ? (
                                  <>
                                    <Link
                                      to={item.document_url}
                                      target="_blank"
                                    >
                                      <img
                                        className="img-responsive thumbnail"
                                        src={msDoc}
                                        alt={msDoc}
                                      />
                                    </Link>
                                    <h4 style={{ textAlign: "center" }}>
                                      {" "}
                                      {item.document_title}.{item.document_type}
                                    </h4>

                                    <div className="profile_edit_delete">
                                      {/* <i
                                      class="material-icons text-primary"
                                      data-toggle="modal"
                                      data-target="#exampleModal"
                                      // onClick={() =>
                                      //   onUpdateModelClick(item.id)
                                      // }
                                    >
                                      edit
                                    </i> */}
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={item.isChecked}
                                          onChange={(e) => {
                                            handleCheckboxChange(e, item.id);
                                          }}
                                        />
                                      </label>
                                      <i
                                        className="material-icons text-danger"
                                        onClick={() =>
                                          onDeleteModelClick(
                                            item.document_title,
                                            item.id
                                          )
                                        }
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </>
                                ) : item.document_type === "xls" ||
                                  item.document_type === "xlsx" ||
                                  item.document_type === "csv" ? (
                                  <>
                                    <Link
                                      to={item.document_url}
                                      target="_blank"
                                    >
                                      <img
                                        className="img-responsive thumbnail"
                                        src={msXls}
                                        alt={msXls}
                                      />
                                    </Link>
                                    <h4 style={{ textAlign: "center" }}>
                                      {" "}
                                      {item.document_title}.{item.document_type}
                                    </h4>
                                    <div className="profile_edit_delete">
                                      {/* <i
                                    class="material-icons text-primary"
                                    data-toggle="modal"
                                    data-target="#exampleModal"
                                    // onClick={() =>
                                    //   onUpdateModelClick(item.id)
                                    // }
                                  >
                                    edit
                                  </i> */}
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={item.isChecked}
                                          onChange={(e) => {
                                            handleCheckboxChange(e, item.id);
                                          }}
                                        />
                                      </label>

                                      <i
                                        className="material-icons text-danger"
                                        onClick={() =>
                                          onDeleteModelClick(
                                            item.document_title,
                                            item.id
                                          )
                                        }
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <LightGallery
                                      speed={200}
                                      plugins={[
                                        lgThumbnail,
                                        lgZoom,
                                        lgShare,
                                        lgRotate,
                                        lgVideo,
                                        lgAutoplay,
                                      ]}
                                    >
                                      {/* <a href="https://procodestore.com/wp-content/uploads/2021/03/164508084_271381191136191_654097929788476286_n.jpg">
                                 <img
                                   alt="img1"
                                   src="https://procodestore.com/wp-content/uploads/2021/03/164508084_271381191136191_654097929788476286_n.jpg"
                                 />
                               </a>
                               <a href="https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60">
                                 <img
                                   alt="img2"
                                   src="https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
                                 />
                               </a>
                                 */}
                                      {/* <a href="https://images.unsplash.com/photo-1679746584014-fb31d4eb0a5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60">
                                 <img
                                   alt="img3"
                                   src="https://images.unsplash.com/photo-1679746584014-fb31d4eb0a5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
                                 />
                               </a> */}

                                      <Link to={item.document_url}>
                                        <img
                                          alt={item.document_title}
                                          className="img-responsive thumbnail"
                                          src={item.document_url}
                                        />
                                      </Link>
                                      <h4 style={{ textAlign: "center" }}>
                                        {" "}
                                        {item.document_title}.
                                        {item.document_type}
                                      </h4>
                                    </LightGallery>
                                    <div className="profile_edit_delete">
                                      {/* <i
                                      class="material-icons text-primary"
                                      data-toggle="modal"
                                      data-target="#exampleModal"
                                      // onClick={() =>
                                      //   onUpdateModelClick(item.id)
                                      // }
                                    >
                                      edit
                                    </i> */}

                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={item.isChecked}
                                          onChange={(e) => {
                                            handleCheckboxChange(e, item.id);
                                          }}
                                        />
                                      </label>

                                      <i
                                        className="material-icons text-danger"
                                        onClick={() =>
                                          onDeleteModelClick(
                                            item.document_title,
                                            item.id
                                          )
                                        }
                                      >
                                        delete
                                      </i>
                                    </div>
                                  </>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                    {getDocumentData.length === 0 ? null : (
                      <div
                        className="footer_pagination text-center"
                        style={{ display: "none" }}
                      >
                        <ReactPaginate
                          breakLabel="..."
                          pageCount={pageCount}
                          pageRangeDisplayed={3}
                          marginPagesDisplayed={2}
                          onPageChange={handlePageChange}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className={modelView === true ? "show_modal" : ""}>
          <div className="back_drop"></div>
          <div
            // className={
            //   Modelclassvalue === "modal fade"
            //     ? "modal fade"
            //     : modelClass === true
            //     ? "modal fade"
            //     : "modal fade in"
            // }
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            // aria-labelledby="exampleModalLabel"
            // aria-hidden="true"
            className={"modal"}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {modelshow === true ? "Update Client" : " Add Document"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    disabled={
                      submitLoader === true
                        ? true
                        : submitLoader === false
                        ? false
                        : false
                    }
                    onClick={() => onCloseModel()}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="body">
                    <form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        addDocument(e);
                      }}
                    >
                      <div className="row clearfix">
                        <div className="modal_label col-md-2 form-control-label">
                          <label htmlFor="name"> Title</label>
                          <small className="text-danger">*</small>
                        </div>
                        <div className="modal_input col-md-10">
                          <div className="form-group">
                            <div className="form-line">
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={documentName}
                                onChange={(e) => {
                                  OndocumentName(e);
                                }}
                                className="form-control"
                                placeholder="Enter document name"
                              />
                              {customvalidated === "name is empty" ? (
                                <small className="text-danger">
                                  {" "}
                                  Document name is empty
                                </small>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row clearfix">
                        <div className="modal_label col-md-2 form-control-label">
                          <label htmlFor="name">Documents </label>
                          <small className="text-danger">*</small>
                        </div>
                        <div className="modal_input col-md-10">
                          <div className="form-group">
                            <div className="form-line">
                              <input
                                type="file"
                                id="img_64"
                                name={"img_64"}
                                // value={DocumentUpload}
                                onChange={(e) => imguploadchange(e)}
                                className="form-control"
                              />
                            </div>
                            {customvalidated === "document is empty" ? (
                              <small className="text-danger">
                                {" "}
                                please Select file first
                              </small>
                            ) : null}

                            {customvalidated === "imgformat" ? (
                              <span
                                className="mt-2   text-center fs-6 text-danger"
                                type="invalid"
                              >
                                Document Format should be in jpg, jpeg or png,
                                doc, docx, xls, xlsx and pdf
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row clearfix">
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            id="closeButton1"
                            disabled={
                              submitLoader === true
                                ? true
                                : submitLoader === false
                                ? false
                                : false
                            }
                            onClick={() => onCloseModel()}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary email_send_btn"
                            disabled={
                              submitLoader === true
                                ? true
                                : submitLoader === false
                                ? false
                                : false
                            }
                          >
                            <div
                              className={
                                submitLoader === true
                                  ? "show_loader loader_btn"
                                  : "none loader_btn"
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

                              <span>Add</span>
                            </div>
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
        <div className={modelVieww === true ? "show_modal" : ""}>
          <div className="back_drop"></div>
          <div
            // className={
            //   Modelclassvalue === "modal fade"
            //     ? "modal fade"
            //     : modelClass === true
            //     ? "modal fade"
            //     : "modal fade in"
            // }
            id="exampleModal1"
            tabIndex="-1"
            role="dialog"
            // aria-labelledby="exampleModalLabel"
            // aria-hidden="true"
            className={"modal"}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Send Document
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    disabled={
                      emailBtnLoader === true
                        ? true
                        : emailBtnLoader === false
                        ? false
                        : false
                    }
                    onClick={() => onCloseModel()}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="body">
                    <form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        sendFiles(e);
                      }}
                    >
                      <div className="row clearfix">
                        <div className="col-sm-2 form-control-label">
                          <label htmlFor="name"> Email</label>
                          <small className="text-danger">*</small>
                        </div>
                        <div className=" col-sm-10 w-100">
                          <div className="form-group">
                            <div className="form-line">
                              <input
                                type="text"
                                id="email"
                                name="email"
                                value={senderEmail}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter document name"
                              />
                            </div>
                            {customvalidated === "email is empty" ? (
                              <small
                                className="text-danger"
                                style={{ marginLeft: "12px" }}
                              >
                                {" "}
                                Email is Required!!
                              </small>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row clearfix">
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            id="closeButton1"
                            disabled={
                              emailBtnLoader === true
                                ? true
                                : emailBtnLoader === false
                                ? false
                                : false
                            }
                            onClick={() => onCloseModel()}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary email_send_btn"
                            disabled={
                              emailBtnLoader === true
                                ? true
                                : emailBtnLoader === false
                                ? false
                                : false
                            }
                          >
                            <div
                              className={
                                emailBtnLoader === true
                                  ? "show_loader loader_btn"
                                  : "none loader_btn"
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

                              <span>Send Mail</span>
                            </div>
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
        <ToastContainer />
      </div>
    </>
  );
};

export default Gallary;
