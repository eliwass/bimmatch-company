import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "./common/contexts/auth";

export default ({ component: Component, ...rest }) => {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <Route
          {...rest}
          render={(props) =>
            auth.isAuthenticated ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      )}
    </AuthContext.Consumer>
  );
};
