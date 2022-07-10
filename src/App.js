import React, { Component } from "react";
import { ApolloProvider } from "@apollo/client";
import mixpanel from "mixpanel-browser";
import * as Sentry from "@sentry/browser";
import Routes from "./Routes";
import { client } from "./common/apollo/ApolloClient";
import { getFirebaseInstance } from "./common/firebase";
import AuthContext from "./common/contexts/auth";
import TrackingContext from "./common/contexts/tracking";
import "./common/utils/facebook";

class App extends Component {
  constructor(props) {
    super(props);
    this.firebase = getFirebaseInstance();
    this.state = {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
      },
      tracking:
        process.env.NODE_ENV === "production" &&
        process.env.REACT_APP_TRACKING_ID
          ? mixpanel
          : null,
    };
  }

  componentDidMount() {
    this.firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        // User signed in
        user
          .getIdToken(true)
          .then((idToken) => {
            this.setState({
              auth: {
                user: {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                  idToken: idToken,
                  emailVerified: user.emailVerified,
                },
                isAuthenticated: true,
                apis: this.firebase.auth,
                isLoading: false,
              },
            });
            window.sessionStorage.setItem("__bauhub_token", idToken);
            this.state.tracking && this.state.tracking.identify(user.uid);
            this.state.tracking && this.state.tracking.track("Login");
          })
          .catch((error) => {
            Sentry.captureException(error);
          });
      } else {
        // User is signed out.
        this.setState({
          auth: {
            user: null,
            isAuthenticated: false,
            isLoading: false,
          },
        });
        window.sessionStorage.removeItem("__bauhub_token");
      }
    });
  }

  render() {
    return (
      <TrackingContext.Provider value={this.state.tracking}>
        <AuthContext.Provider value={this.state.auth}>
          <ApolloProvider client={client}>
            <Routes />
          </ApolloProvider>
        </AuthContext.Provider>
      </TrackingContext.Provider>
    );
  }
}

export default App;
