import React, { useContext } from "react";

const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  apis: null,
  isLoading: false,
});

export default AuthContext;

export const withAuth = (Component) => (props) => (
  <AuthContext.Consumer>
    {(auth) => <Component {...props} auth={auth} />}
  </AuthContext.Consumer>
);

export const useAuth = () => {
  return useContext(AuthContext);
};
