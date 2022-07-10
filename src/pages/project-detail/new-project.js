import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { withRouter } from "react-router-dom";
import Dropzone from "react-dropzone";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Layout } from "../../common/layout";
import { AutoComplete } from "../../common/map";
import { useAuth } from "../../common/contexts/auth";
import { createProject } from "../../common/services";

const NewProject = ({ history }) => {
  const auth = useAuth();
  const { register, handleSubmit } = useForm();
  const [isUploadStarted, setUploadStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [bimFile, setBimFile] = useState();
  const [previewImageFile, setPreviewImageFile] = useState();
  const size = 50;

  const onUploadProgress = (progressEvent) => {
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  };

  const handleCreateProject = async (data) => {
    try {
      setUploadStarted(true);
      const formData = new FormData();
      formData.append("inputData", JSON.stringify(data));
      if (bimFile) {
        formData.append("bimFile", bimFile);
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      const result = await createProject(
        { data: formData },
        { onUploadProgress }
      );
      const { id } = result.data || {};
      if (id) {
        history.push(`/project/${id}`);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const onImageUpload = (accepedFile) => {
    if (accepedFile && accepedFile.length > 0) {
      setImageFile(accepedFile[0]);
      setPreviewImageFile(URL.createObjectURL(accepedFile[0]));
    }
  };

  const onBimFileUpload = (accepedFile) => {
    if (accepedFile && accepedFile.length > 0) {
      setBimFile(accepedFile[0]);
    }
  };

  if (auth && !auth.isLoading && !auth.isAuthenticated) {
    return <div> You are not allowed to create project!</div>;
  }

  return (
    <Layout>
      <div className="project-detail project-create">
        <form onSubmit={handleSubmit(handleCreateProject)}>
          <div className="content-left">
            <div style={{ padding: "20px" }}>
              <div className="bim-upload">
                <div className="project-cube-wrap upload-wrap">
                  <Dropzone
                    onDrop={onBimFileUpload}
                    maxSize={1024 * 1024 * size}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="file-upload-wrap home-uploader bim-upload-wrap"
                      >
                        <input
                          {...getInputProps()}
                          className="bim_upload"
                          accept=".rvt,.dwg"
                        />
                        <div className="imageuploadify well file-upload-wrap-two bim-img">
                          <div className="content-wrap">
                            {!bimFile && (
                              <div className="imageuploadify-overlay icon-wrap">
                                <div className="main-icon"></div>
                              </div>
                            )}
                            {bimFile && (
                              <div className="selected-file-container">
                                <div className="main-icon"></div>
                                <h3 style={{ margin: "10px" }}>
                                  {bimFile.name}
                                </h3>
                              </div>
                            )}
                            {isUploadStarted && (
                              <ProgressBar animated now={progress} max={100} />
                            )}
                            <div className="imageuploadify-images-list text-center content">
                              <button
                                type="button"
                                autofocusclass="drag-button"
                                className="drag-button 5-mb"
                              >
                                Drop or click here to upload your architecture
                                plan
                              </button>
                              <span className="imageuploadify-message drag-message">
                                Up to 50mb BIM file
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>
              </div>
              <div
                className="left-bottom-section"
                style={{ borderRadius: "20px" }}
              >
                <div className="left-bottom-box"></div>
              </div>
            </div>
          </div>
          <div className="content-right custom-right-panel">
            <div className="content-wrap">
              <div className="form-tag height-90">
                <div className="form-wrap">
                  <p>* Project name</p>
                  <div className="form-group">
                    <input
                      name="displayName"
                      type="text"
                      className="form-control input-two check_field_change"
                      placeholder="Type a name"
                      ref={register({ required: true })}
                    />
                  </div>
                  <p>* Project type</p>
                  <div className="form-group">
                    <div className="select-style">
                      <select
                        name="typeOfProject"
                        className="form-control"
                        defaultValue="Select a type"
                        ref={register({ required: true })}
                      >
                        <option disabled> Select a type </option>
                        <option value="residential">Residential</option>
                        <option value="office">Office</option>
                        <option value="industrial">Industrial</option>
                        <option value="public">Public</option>
                      </select>
                    </div>
                  </div>
                  <p>* Location</p>
                  <div className="form-group">
                    <div className="search-style">
                      <AutoComplete
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="search"
                        ref={register({ required: true })}
                      />
                    </div>
                  </div>
                  <p>Project thumbnail</p>
                  <div className="form-group file-upload-wrap">
                    <Dropzone
                      onDrop={onImageUpload}
                      maxSize={1024 * 1024 * 2}
                      accept="image/*"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className="content-wrap upload-wrap"
                          style={{
                            cursor: "pointer",
                            maxWidth: "200px",
                            maxHeight: "200px",
                            minHeight: "200px",
                            textAlign: "center",
                          }}
                        >
                          {previewImageFile && (
                            <img
                              alt="preview"
                              src={previewImageFile}
                              style={{
                                margin: "auto",
                                maxWidth: "100%",
                                height: "auto",
                              }}
                            />
                          )}
                          {!previewImageFile &&
                            "Drop or click here to upload an image of your project"}
                          <input
                            {...getInputProps()}
                            type="file"
                            name="image"
                            style={{ display: "none" }}
                          />
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </div>
                <div className="button-wrap button-lg">
                  <div className="form-group text-right">
                    <button
                      onClick={() => history.push("/projects")}
                      className="red-button submit_button float-left text-uppercase"
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                    <button
                      type="submit"
                      className="red-bg-button submit_button float-right text-uppercase"
                    >
                      {" "}
                      Create{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default withRouter(NewProject);
