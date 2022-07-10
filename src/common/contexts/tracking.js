import React, { useContext } from "react";

const TrackingContext = React.createContext();

export default TrackingContext;

export const withTracking = (Component) => (props) => (
  <TrackingContext.Consumer>
    {(tracking) => <Component {...props} tracking={tracking} />}
  </TrackingContext.Consumer>
);

export const useTracking = () => {
  return useContext(TrackingContext);
};
