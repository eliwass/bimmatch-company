import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import RegisterUser from "./register";
import LoginUser from "./login";

const Login = ({
  show,
  handleClose,
  showProjectMessage = false,
  signInSuccessCallback,
}) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Modal
      className="login-signup"
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h2>{!showLogin ? "Sign up" : "Sign in"}</h2>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => handleClose(false)}
        >
          <img src="/images/icon/close.svg" className="img-fluid" alt="close" />
        </button>
      </Modal.Header>
      <Modal.Body>
        {!showLogin ? (
          <>
            <RegisterUser signInSuccessCallback={signInSuccessCallback} />
            <div className="modal-footer">
              <p style={{ color: "#F3516B" }}>
                <button
                  href="#"
                  data-toggle="modal"
                  onClick={() => setShowLogin(!showLogin)}
                  data-dismiss="modal"
                  style={{ color: "#F3516B", border: "0", background: "none" }}
                >
                  <img
                    src="images/icon/prev-blue.svg"
                    alt="icon"
                    style={{ height: "15px" }}
                  />{" "}
                  Back to Sign In
                </button>
              </p>
            </div>
          </>
        ) : (
          <div>
            <LoginUser signInSuccessCallback={signInSuccessCallback} />
            <div className="modal-footer">
              <p>
                New to Bimmatch?{" "}
                <span>
                  <button
                    data-toggle="modal"
                    href="#"
                    onClick={() => setShowLogin(!showLogin)}
                    data-dismiss="modal"
                    style={{
                      color: "#F3516B",
                      border: "0",
                      background: "none",
                    }}
                  >
                    Sign up
                  </button>
                </span>
              </p>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Login;
