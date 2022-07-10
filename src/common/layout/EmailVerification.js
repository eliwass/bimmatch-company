import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../contexts/auth";
import { useMutation, gql } from "@apollo/client";

const SEND_EMAIL_VERIFICATION = gql`
  mutation SendVerificationEmail {
    sendVerificationEmail
  }
`;

const EmailVerification = () => {
  const [resent, setResent] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sendEmail] = useMutation(SEND_EMAIL_VERIFICATION);

  const handleResend = async () => {
    setResent(true);
    try {
      await sendEmail();
    } catch (err) {
      console.log("Error", err);
    }
  };

  if (isLoading) return null;

  if (!isAuthenticated) return null;

  if (user && user.emailVerified) return null;

  const displayName =
    user.displayName || window.sessionStorage.getItem("displayName");

  return (
    <Modal
      className="login-signup"
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h2>{"Email Confirmation"}</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="emailverify-container">
          <h1 className="emailverify-top-text">{`${displayName}, it’s great to bimmatch with you`}</h1>
          <div className="emailverify-middle-text">
            <h3>One last step - Let’s verify your Email address.</h3>
            <div> We have just sent you an email for verification.</div>
            <div>
              <div>Didn’t get the verification email?</div>
              {!resent && (
                <button
                  className="btn emailverify-button"
                  onClick={handleResend}
                >
                  RESEND
                </button>
              )}
              {resent && (
                <button className="btn emailverify-button">Sent</button>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default EmailVerification;
