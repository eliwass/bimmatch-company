import { useState, useCallback } from "react";

const useMap = () => {
  const [map, setMap] = useState(null);
  const mapRef = useCallback((map) => {
    if (map !== null) {
      setMap(map);
    }
  }, []);
  return [map, mapRef];
};

export default useMap;
