import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { gql } from "@apollo/client";
import Alert from "react-bootstrap/Alert";
import WithLayout from "../../common/layout";
import Login from "../../components/login";
import { withAuth } from "../../common/contexts/auth";
import ProjectsList from "../../components/projects-list";

const GET_HOUSES = gql`
  query GetHouses($after: String, $first: Int) {
    getHouses(after: $after, first: $first) {
      totalCount
      edges {
        node {
          id
          displayName
          demo
          images {
            location
            displayName
            type
            Key
          }
          createdBy {
            id
            displayName
          }
          architect {
            name
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const Projects = ({ auth }) => {
  const { isAuthenticated, isLoading } = auth;
  const history = useHistory();
  const [displaySignIn, setDisplaySignIn] = useState(false);
  const [showAlert, setAlert] = useState(!isAuthenticated);
  const handleCreateProject = (e) => {
    if (isAuthenticated) {
      history.push("/project/new");
    }
    setDisplaySignIn(true);
  };
  const displaySignInHandler = () => {
    setDisplaySignIn(false);
  };

  return (
    <div className="project-list">
      <div className="container">
        {!isLoading && !isAuthenticated && showAlert && (
          <Alert className="bimmatch-alert text-white">
            {"You are logged out. "}
            <p
              className="d-inline-block links text-danger"
              onClick={() => {
                setDisplaySignIn(!displaySignIn);
              }}
            >
              Sign In
            </p>
            {" to see your projects."}
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => {
                setAlert(false);
              }}
            >
              <img
                src="/images/icon/close-white.svg"
                style={{ width: "20px", display: "block" }}
                alt="close"
              />
            </button>
          </Alert>
        )}
        <div className="row">
          <div className="col-lg-10 col-md-10 d-none d-xl-block d-lg-block d-md-block">
            <h1>Projects</h1>
          </div>
          <div className="col-lg-2 col-md-2 d-none d-xl-block d-lg-block d-md-block">
            <button className="red-bg-button" onClick={handleCreateProject}>
              CREATE NEW PROJECT
            </button>
          </div>
        </div>
        <ProjectsList
          graphQuery={GET_HOUSES}
          first={15}
          outputKey={"getHouses"}
        />
      </div>
      {!(auth && auth.isAuthenticated && displaySignIn) && (
        <Login show={displaySignIn} handleClose={displaySignInHandler} />
      )}
    </div>
  );
};

export default WithLayout(withAuth(Projects));
