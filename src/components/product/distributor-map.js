import React, { useState, useEffect, useReducer } from "react";
import { Map, Marker, useMap, InfoWindow } from "../../common/map";

const defaultFocus = {
  lat: 37.3860517,
  lng: -122.0838511,
  style: { height: "600px" },
};

const toString = (obj) => {
  return obj ? obj.toString() : "";
};

const DistributorMap = ({ distributors }) => {
  const [map, mapRef] = useMap();
  const [selectedMarker, setSelectedMarker] = useState();
  // eslint-disable-next-line no-unused-vars
  const [selectedDistributors, dispatchSelectedDistributors] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "add":
          return [...state, action.payload];
        case "remove":
          return [...state].filter((item) => item !== action.payload);
        default:
          throw new Error("Error in Distributor Map");
      }
    },
    []
  );

  useEffect(() => {
    window.__bimmatch_map_marker_onClick = (ele) => {
      const id = ele.getAttribute("data-id");
      const type = ele.getAttribute("data-type");
      dispatchSelectedDistributors({
        type,
        payload: id,
      });
    };
  }, []);

  const onClickMarker = (marker, distributor, e) => {
    setSelectedMarker({ marker, distributor });
  };

  let infoContents = "";

  if (selectedMarker && selectedMarker.distributor) {
    infoContents = `
            <p>${toString(selectedMarker.distributor.displayName)}</p>
            <br/>
            <p>${toString(selectedMarker.distributor.contact.address)}</p>
            <br/>
            <p>${toString(selectedMarker.distributor.contact.phone)}</p>
            <br/>
            <p>
                <a role="button" style="color: #519EF3" data-id="${
                  selectedMarker.distributor.id
                }" data-type="add" onclick="__bimmatch_map_marker_onClick(this)"> Select </a>
            </p>
        `;
  }

  const focus = distributors && distributors[0] && distributors[0].mapLocation;
  return (
    <div className="d-flex flex-row">
      <div className="flex-fill">
        <Map {...{ ...defaultFocus, ...focus }} mapRef={mapRef} />
        {distributors &&
          distributors.map(
            (distributor, index) =>
              distributor.mapLocation && (
                <Marker
                  key={index}
                  {...distributor.mapLocation}
                  map={map}
                  onClick={(e, marker) => onClickMarker(marker, distributor, e)}
                />
              )
          )}
        {selectedMarker && (
          <InfoWindow
            content={infoContents}
            map={map}
            marker={selectedMarker.marker}
          />
        )}
      </div>
      {/* <div className="p-2 border">
                <h5>Selected Distributors</h5>
            </div> */}
    </div>
  );
};

export default DistributorMap;
