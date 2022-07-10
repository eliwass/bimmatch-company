import React, { useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import Login from "../../components/login";
import { useAuth } from "../../common/contexts/auth";

const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember($id: ID!) {
    addTeamMember(id: $id)
  }
`;

const Invite = () => {
  const { id } = useParams();
  const history = useHistory();
  const { isLoading, isAuthenticated } = useAuth();
  const [addTeamMember] = useMutation(ADD_TEAM_MEMBER);

  const successCallback = useCallback(async () => {
    try {
      const res = await addTeamMember({
        variables: {
          id,
        },
      });
      if (res.data.addTeamMember) {
        history.push(`/project/${res.data.addTeamMember}`);
      }
    } catch (err) {
      console.log(err);
    }
  }, [history, id, addTeamMember]);

  useEffect(() => {
    if (isAuthenticated) {
      successCallback();
    }
  }, [isAuthenticated, successCallback]);

  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return (
      <Login
        show={true}
        handleClose={() => {}}
        signInSuccessCallback={successCallback}
      />
    );
  }
  return null;
};

export default Invite;
