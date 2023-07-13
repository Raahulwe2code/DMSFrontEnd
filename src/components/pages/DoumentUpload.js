import React from "react";
import Logo from "../../../src/dms.png";
import Upload from "../../../src/upload.png";
import Pdf from "../../../src/PDF.png";
function DoumentUpload() {
  return (
    <div>
      <div className="col-sm-6 main_continer">
        <div className="dms_logo">
          <img src={Logo} />
        </div>
        <div className="main_form">
          <div className="file_upload">
            <input type="file"></input>
            <div className="logo_upload">
              <img src={Upload} />
              <p className="text-center">Click To Upload</p>
            </div>
          </div>
          <div className="file_name_add">
            <div className="file_name_input">
              <label>Doument Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter file name"
              ></input>
            </div>
            <div className="sumbit_btn">
              <button class="btn bg-light-blue">ADD</button>
            </div>
          </div>
        </div>
        <div className="uploaded_document">
          <h3>Uploaded Document</h3>
          <div className="uploaded_file">
            <div className="file_name">
              <span>PDF</span><p>Gourav_choudhary_adher.pfd</p>
            </div>
          </div>
          <div className="uploaded_file">
          <div className="file_name">
          <img src={Pdf} />
           <span >PDF</span><p>Gourav_choudhary_adher.pfd</p>
          </div>
        </div>
        <div className="uploaded_file">
        <div className="file_name">
          <span>PDF</span><p>Gourav_choudhary_adher.pfd</p>
        </div>
      </div>
      <div className="uploaded_file">
      <div className="file_name">
        <span>PDF</span><p>Gourav_choudhary_adher.pfd</p>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}

export default DoumentUpload;
