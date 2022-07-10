import React from "react";
import { getFirebaseInstance } from "../../common/firebase";
import { useMutation, gql } from "@apollo/client";
import { useTracking } from "../../common/contexts/tracking";
import { useForm } from "react-hook-form";
import { useState } from "react";

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

const RegisterUser = ({ signInSuccessCallback }) => {
  const [showPassword, setShowPasswordRegister] = useState(true);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState();
  const tracking = useTracking();
  const [createUser] = useMutation(CREATE_USER);

  const handleRegisterNewUser = async (data) => {
    const firebaseInstance = getFirebaseInstance();
    window.sessionStorage.setItem("displayName", data.displayName);
    try {
      const userCredential = await firebaseInstance.auth.createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      const user = userCredential.user;
      await user.updateProfile({ displayName: data.displayName });
      const token = await user.getIdToken();
      window.sessionStorage.setItem("__bauhub_token", token);
      await createUser({
        variables: {
          input: {
            ...userCredential.additionalUserInfo,
            displayName: data.displayName,
            email: data.email,
            organization: data.organization,
            marketing: {
              bimmatch: data.bimmatchMarketing,
              products: data.productsMarketing,
            },
          },
        },
      });
      tracking &&
        tracking.people.set({
          $email: user.email,
          uid: user.uid,
          $distinct_id: user.uid,
          $name: data.displayName,
          USER_ID: data.displayName,
        });
      tracking && tracking.track("Register");
      signInSuccessCallback && signInSuccessCallback(user);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-top-text">Create your Bimmatch account</div>
      <form onSubmit={handleSubmit(handleRegisterNewUser)}>
        <div className="form-group">
          <label>* Name</label>
          <input
            name="displayName"
            className="form-control"
            placeholder="Your full name"
            ref={register({ required: true })}
          />
        </div>
        <div className="form-group">
          <label>Organization</label>
          <input
            name="organization"
            className="form-control"
            placeholder="Organization"
            ref={register}
          />
        </div>
        <div className="form-group">
          <label>* Email</label>
          <input
            name="email"
            className="form-control"
            type="email"
            placeholder="Your Email"
            ref={register({ required: true })}
          />
        </div>
        <div className="form-group eye">
          <label>* Password</label>
          <input
            name="password"
            className="form-control"
            type={showPassword ? "password" : "text"}
            placeholder="Define a password"
            ref={register({ required: true })}
            autoComplete="off"
          />
          <i
            className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
            aria-hidden="true"
            onClick={() => setShowPasswordRegister(!showPassword)}
          ></i>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="bimmatchMarketing"
            className="custom-checkbox"
            ref={register}
          />
          <p>
            I agree to receive marketing communication froms Bimmatter (Bimmatch
            platform)
          </p>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            name="productsMarketing"
            className="custom-checkbox"
            ref={register}
          />
          <p>
            I agree to receive marketing communication froms distributors of
            products featured on the platform
          </p>
        </div>
        <div className="form-group">
          <button type="submit" className="blue-bg-button w-100 colorBotton">
            REGISTER
          </button>
          {error && (
            <p style={{ display: "flex" }} className="registerError">
              {error}
            </p>
          )}
        </div>
      </form>
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
    </div>
  );
};

export default RegisterUser;
