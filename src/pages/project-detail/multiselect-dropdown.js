import React, { useState } from "react";

const MultiSelect = ({
  selectedValues = [],
  values = [],
  addSelect,
  removeSelect,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const onFilterSelect = (e, item) => {
    if (e.target.checked) {
      addSelect(item);
    } else {
      removeSelect(item);
    }
    setShowDropdown(false);
  };

  return (
    <div className="dashboardcode-bsmultiselect">
      <ul
        className="form-control"
        style={{
          display: "flex",
          flexWrap: "wrap",
          listStyleType: "none",
          marginBottom: "0px",
          height: "auto",
          minHeight: "calc(2.25rem + 2px)",
          padding: "unset",
        }}
        onClick={handleShowDropdown}
      >
        {selectedValues &&
          selectedValues.map((item, index) => (
            <li
              key={item.id}
              className="badge"
              style={{
                paddingLeft: "0px",
                lineHeight: "1.5em",
                fontWeight: "400",
                fontSize: "14px",
              }}
            >
              <span>{item.displayName}</span>
              {index < selectedValues.length - 1 && (
                <span
                  aria-hidden="true"
                  className="close"
                  style={{
                    float: "none",
                    fontWeight: "400",
                    fontSize: "1.5em",
                    lineHeight: "0.9em",
                  }}
                >
                  ,
                </span>
              )}
            </li>
          ))}
      </ul>
      {showDropdown && (
        <ul
          className="dropdown-menu"
          style={{
            display: "block",
            listStyleType: "none",
            position: "absolute",
            transform: "translate3d(0px, 35px, 0px)",
            top: "0px",
            left: "0px",
            willChange: "transform",
            width: "100%",
            height: "300px",
            overflowY: "scroll",
          }}
        >
          {values &&
            values.map((item) => (
              <li key={item.id} className="px-2">
                <div className="custom-control custom-checkbox">
                  {Boolean(
                    selectedValues.find((val) => val.id === item.id)
                  ) && (
                    <input
                      id={item.id}
                      type="checkbox"
                      className="custom-control-input"
                      value={item.id}
                      defaultChecked={true}
                      onChange={(e) => onFilterSelect(e, item)}
                    />
                  )}
                  {!Boolean(
                    selectedValues.find((val) => val.id === item.id)
                  ) && (
                    <input
                      id={item.id}
                      type="checkbox"
                      className="custom-control-input"
                      value={item.id}
                      onChange={(e) => onFilterSelect(e, item)}
                    />
                  )}
                  <label
                    htmlFor={item.id}
                    className="custom-control-label justify-content-start"
                  >
                    {item.displayName}
                  </label>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
