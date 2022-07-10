import React, { useEffect, useRef } from "react";
import useLoadScript from "./useLoadScript";

const Map = (
  { lat, lng, zoom = 8, style = { height: "400px" }, mapRef },
  { key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}
) => {
  const isScriptLoaded = useLoadScript({ key });
  const mapDomRef = useRef(null);

  useEffect(() => {
    if (isScriptLoaded && mapDomRef && mapDomRef.current) {
      const map = new window.google.maps.Map(mapDomRef.current, {
        center: { lat: lat, lng: lng },
        zoom: zoom,
      });
      mapRef && map && mapRef(map);
    }
  }, [isScriptLoaded, mapDomRef, mapRef, lat, lng, zoom]);

  if (!isScriptLoaded) {
    return null;
  }

  return (
    <div ref={mapDomRef} style={style}>
      {" "}
    </div>
  );
};

export default Map;
