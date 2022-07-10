import React from "react";
import useLoadScript from "./useLoadScript";

const Marker = (
  { lat, lng, map, icon, onClick },
  { key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}
) => {
  const isScriptLoaded = useLoadScript({ key });
  if (!isScriptLoaded) {
    return null;
  }
  const marker =
    map &&
    window.google &&
    window.google.maps &&
    new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      icon: icon,
    });
  marker && marker.addListener("click", (e) => onClick(e, marker));

  return <></>;
};

export default Marker;
