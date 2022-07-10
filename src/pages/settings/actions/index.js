import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WithLayout from "../../../common/layout";
import { getFirebaseInstance } from "../../../common/firebase";
import { ReactComponent as Success } from "../../../images/icon/success.svg";
import { ReactComponent as Warn } from "../../../images/icon/warn.svg";

const EmailVerificationSuccess = () => {
  return (
    <div className="actions-container">
      <div className="actions-message">
        <Success className="success-icon" />
        <h1 className="success-text">Email confirmation successful!</h1>
      </div>
      <a href="/projects" className="btn btn-outline-secondary">
        Continue
      </a>
    </div>
  );
};

const ErrorInAction = ({ code }) => {
  switch (code) {
    case "auth/invalid-action-code":
      return (
        <div className="actions-container">
          <div className="actions-message">
            <Warn className="warn-icon" />
            <h1 className="warn-text">
              Email verification link expired or invalid.
            </h1>
          </div>
          <a href="/projects" className="btn btn-outline-primary">
            Continue
          </a>
        </div>
      );
    default:
      return (
        <div className="actions-container">
          <div className="actions-message">
            <Warn className="warn-icon" />
            <h1 className="warn-text">Unknow error occured.</h1>
          </div>
          <a href="/projects" className="btn btn-outline-primary">
            Continue
          </a>
        </div>
      );
  }
};

function useQuery() {
  const params = new URLSearchParams(useLocation().search);
  let query = {};
  for (const [key, value] of params) {
    query[key] = value;
  }
  return query;
}

const Actions = () => {
  let { mode, oobCode } = useQuery();
  const [error, setError] = useState();
  const [verifyEmail, setVerifyEmail] = useState();
  useEffect(() => {
    if (mode && oobCode) {
      const firebase = getFirebaseInstance();
      const actionsExe = {
        verifyEmail: async (oobCode) => {
          return await firebase.auth.applyActionCode(oobCode);
        },
      };
      actionsExe[mode](oobCode)
        .then((result) => {
          setVerifyEmail(true);
        })
        .catch((err) => {
          setError(err.code);
        });
    }
  }, [mode, oobCode]);

  return (
    <div className="settings">
      <div className="container">
        {verifyEmail && <EmailVerificationSuccess />}
        {error && <ErrorInAction code={error} />}
      </div>
    </div>
  );
};

export default WithLayout(Actions);
