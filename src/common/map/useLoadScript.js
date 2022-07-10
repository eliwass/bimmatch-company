import { useState, useEffect } from "react";
import * as Sentry from "@sentry/browser";
import { LoadScript } from "../utils";

const useLoadScript = ({ key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}) => {
  const [isScriptLoaded, setScriptLoaded] = useState(false);
  useEffect(() => {
    LoadScript(
      `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,places`
    )
      .then((isLoaded) => {
        // wait until "window.google.maps" object is getting created
        const checkValidity = () => {
          if (!(window.google && window.google.maps)) {
            setTimeout(checkValidity, 5);
          } else {
            setScriptLoaded(isLoaded);
          }
        };
        setTimeout(checkValidity, 5);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  });

  return isScriptLoaded;
};

export default useLoadScript;
