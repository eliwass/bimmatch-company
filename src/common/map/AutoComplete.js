import React, { useEffect, useRef, useState } from "react";
import useLoadScript from "./useLoadScript";

const AutoComplete = React.forwardRef(
  (
    { name, onChange, className, placeholder, type },
    ref,
    { key = process.env.REACT_APP_GOOGLE_MAP_KEY } = {}
  ) => {
    const isScriptLoaded = useLoadScript({ key });
    const autocompleteRef = useRef(null);
    const [place, setPlace] = useState("");

    useEffect(() => {
      if (isScriptLoaded && autocompleteRef && autocompleteRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteRef.current,
          { types: ["geocode"] }
        );
        window.google.maps.event.addListener(
          autocomplete,
          "place_changed",
          function (d) {
            const place = autocomplete.getPlace();
            setPlace(place.formatted_address);
          }
        );
      }
    }, [isScriptLoaded, autocompleteRef]);

    if (!isScriptLoaded) {
      return null;
    }
    return (
      <>
        <input
          name={name}
          type={type}
          ref={autocompleteRef}
          className={className}
          placeholder={placeholder}
        />
        <input
          name={name}
          type={"hidden"}
          ref={ref}
          value={place}
          onChange={onChange}
        />
      </>
    );
  }
);

export default AutoComplete;
