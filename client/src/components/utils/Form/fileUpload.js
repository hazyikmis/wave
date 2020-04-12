import React, { Component } from "react";

import Dropzone from "react-dropzone";
//import {useDropzone} from 'react-dropzone';

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faPlusCircle from "@fortawesome/fontawesome-free-solid/faPlusCircle";

import CircularProgress from "@material-ui/core/CircularProgress";

export default class FileUpload extends Component {
  constructor() {
    super();
    this.state = {
      uploadedFiles: [],
      uploading: false,
    };
  }

  //events are actually files
  onFileDroppedToDropzone = (files) => {
    //console.log(files);
    this.setState({ uploading: true });
    let newFormData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    newFormData.append("file", files[0]);

    axios
      .post("/api/users/uploadimage", newFormData, config)
      .then((response) => {
        console.log(response.data);
        this.setState(
          {
            uploading: false,
            uploadedFiles: [...this.state.uploadedFiles, response.data],
          },
          () => {
            //after setting state, we are informing the parent component...
            this.props.imagesHandler(this.state.uploadedFiles);
          }
        );
      });
  };

  onRemove = (id) => {
    axios.get(`/api/users/removeimage?public_id=${id}`).then((response) => {
      let images = this.state.uploadedFiles.filter((file) => {
        return file.public_id !== id;
      });

      this.setState(
        {
          uploadedFiles: images,
        },
        () => {
          //now tell the parent that the images changed
          this.props.imagesHandler(images);
        }
      );
    });
  };

  showUploadedImages = () =>
    this.state.uploadedFiles.map((item) => (
      <div
        className="dropzone_box"
        key={item.public_id}
        onClick={() => this.onRemove(item.public_id)}
      >
        <div
          className="wrap"
          style={{ background: `url(${item.url}) no-repeat` }}
        ></div>
      </div>
    ));

  static getDerivedStateFromProps(props, state) {
    if (props.reset) {
      return (state = {
        uploadedFiles: [],
      });
    }
  }

  // <Dropzone
  //   onDrop={(e) => this.onFileDroppedToDropzone(e)}
  //   multiple={false}
  //   className="dropzone_box"
  // >
  //   <div className="wrap">
  //     <FontAwesomeIcon icon={faPlusCircle} />
  //   </div>
  // </Dropzone>

  render() {
    const files = this.state.uploadedFiles.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div>
        <section>
          <div className="dropzone clear">
            <Dropzone
              onDrop={this.onFileDroppedToDropzone}
              multiple
              className="dropzone_box"
            >
              {({ getRootProps, getInputProps }) => (
                <section className="container">
                  <div {...getRootProps({ className: "dropzone_box" })}>
                    <input {...getInputProps()} />
                    <div className="wrap">
                      <FontAwesomeIcon icon={faPlusCircle} />
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>

            {this.showUploadedImages()}
            {this.state.uploading ? (
              <div
                className="dropzone_box"
                style={{
                  textAlign: "center",
                  padding: "60px",
                }}
              >
                <CircularProgress style={{ color: "#" }} thickness={7} />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    );
  }
}
