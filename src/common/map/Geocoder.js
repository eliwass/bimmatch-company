import { LoadScript } from "../utils";

const Geocoder = async (
  { address },
  { key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}
) => {
  const isLoaded = await LoadScript(
    `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry,places`
  );
  if (!isLoaded) {
    return null;
  }
  const geocoder =
    window.google && window.google.maps && new window.google.maps.Geocoder();
  const location = await new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        reject(status);
        throw new Error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  });
  return location;
};

export default Geocoder;
