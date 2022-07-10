import React, { useRef, useEffect, useState } from "react";
import "firebaseui/dist/firebaseui.css";
import { getFirebaseInstance } from "../../common/firebase";
import { useMutation, gql } from "@apollo/client";
import { useTracking } from "../../common/contexts/tracking";
import { useForm } from "react-hook-form";

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

const LoginUser = ({ signInSuccessCallback }) => {
  const [showPassword, setShowPassword] = useState(false);
  const firebaseuiRef = useRef(null);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState();
  const tracking = useTracking();
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const createUserIfNotExists = async (authResult) => {
      const token = await authResult.user.getIdToken();
      window.sessionStorage.setItem("__bauhub_token", token);
      const user = await createUser({
        variables: {
          input: {
            isNewUser: authResult.additionalUserInfo.isNewUser,
            email: authResult.additionalUserInfo.profile.email,
            displayName: authResult.additionalUserInfo.profile.name,
          },
        },
      });
      return Boolean(user);
    };
    const firebase = getFirebaseInstance();
    const uiConfig = {
      signInFlow: "popup",
      signInOptions: firebase.providers,
      privacyPolicyUrl: "/policy/terms-and-conditions",
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          if (
            tracking &&
            authResult &&
            authResult.additionalUserInfo.isNewUser
          ) {
            tracking &&
              tracking.people.set({
                $email: authResult.user.email,
                uid: authResult.user.uid,
                $distinct_id: authResult.user.uid,
                $name: authResult.user.displayName,
                USER_ID: authResult.user.displayName,
              });
            tracking && tracking.track("Sign In");
          }
          createUserIfNotExists(authResult).then(() => {
            signInSuccessCallback &&
              signInSuccessCallback(authResult, redirectUrl);
          });
          return false;
        },
        uiShown: () => {},
      },
    };
    firebaseuiRef &&
      firebaseuiRef.current &&
      firebase.ui.start("#firebaseui-auth-container", uiConfig);
  }, [signInSuccessCallback, tracking, createUser]);

  const handleLogin = async (data) => {
    const firebaseInstance = getFirebaseInstance();
    try {
      const userCredential = await firebaseInstance.auth.signInWithEmailAndPassword(
        data.email,
        data.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      window.sessionStorage.setItem("__bauhub_token", token);
      tracking &&
        tracking.people.set({
          $email: user.email,
          uid: user.uid,
          $distinct_id: user.uid,
          $name: user.displayName,
          USER_ID: user.displayName,
        });
      tracking && tracking.track("Sign In");
      signInSuccessCallback && signInSuccessCallback(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="left">
          <p style={{ textAlign: "center", marginBottom: "17px" }}>
            Sign in with your Bimmatch account
          </p>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="form-group">
              <input
                name="email"
                className="form-control input-two"
                type="email"
                placeholder="Email *"
                ref={register({ required: true })}
              />
            </div>
            <div className="form-group eye">
              <input
                name="password"
                className="form-control input-two"
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                ref={register({ required: true })}
                autoComplete="off"
              />
              <i
                className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                aria-hidden="true"
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="blue-bg-button w-100 colorBotton"
              >
                SIGN IN
              </button>
              {error && (
                <p style={{ display: "flex" }} className="registerError">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
        <div className="center">
          <div>OR</div>
          <div className="divider"></div>
        </div>
        <div className="right">
          <p style={{ textAlign: "center" }}>
            Sign in with your network account
          </p>
          <div
            id="firebaseui-auth-container"
            className="firebaseui-auth-container"
            ref={firebaseuiRef}
          ></div>
        </div>
      </div>
      <div className="login-notice">
        {"By submitting your details you agree to our "}
        <a
          href="/policy/terms-and-conditions.html"
          alt="Terms and Conditions"
          target="_blank"
        >
          Terms of Use
        </a>
        {" and "}
        <a
          href="/policy/terms-and-conditions.html"
          alt="Privacy Policy"
          target="_blank"
        >
          Privacy Policy
        </a>
      </div>
    </>
  );
};

export default LoginUser;
