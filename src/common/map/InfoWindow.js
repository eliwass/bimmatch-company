import React from "react";
import useLoadScript from "./useLoadScript";

const InfoWindow = (
  { content, map, marker },
  { key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}
) => {
  const isScriptLoaded = useLoadScript({ key });
  if (!isScriptLoaded) {
    return null;
  }
  const infoWindow =
    window.google &&
    window.google.maps &&
    new window.google.maps.InfoWindow({
      content,
    });
  infoWindow.open(map, marker);
  return <></>;
};

export default InfoWindow;
