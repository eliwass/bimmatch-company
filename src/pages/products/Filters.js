import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

const Filters = ({
  data: unsortedData = [],
  popOverTitle,
  addFilter = () => {},
  removeFilter = () => {},
  checkedValues = [],
}) => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const data = [...unsortedData];
  data &&
    data.sort((a, b) => {
      if (Boolean(checkedValues.find((val) => val.id === a.id))) {
        return -1;
      }
      return 0;
    });
  const initialData = data.length >= 10 ? data.slice(0, 10) : data;
  const popoverData = data.length > 10 && data.slice(10, data.length);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  const onFilterSelect = (e, item) => {
    if (e.target.checked) {
      addFilter(item);
    } else {
      removeFilter(item);
    }
    setShow(false);
  };

  return (
    <>
      {initialData &&
        initialData.map((item) => (
          <div key={item.id} className="custom-control custom-checkbox">
            {Boolean(checkedValues.find((val) => val.id === item.id)) && (
              <input
                id={item.id}
                type="checkbox"
                className="custom-control-input"
                value={item.id}
                defaultChecked={true}
                onChange={(e) => onFilterSelect(e, item)}
              />
            )}
            {!Boolean(checkedValues.find((val) => val.id === item.id)) && (
              <input
                id={item.id}
                type="checkbox"
                className="custom-control-input"
                value={item.id}
                onChange={(e) => onFilterSelect(e, item)}
              />
            )}
            <label htmlFor={item.id} className="custom-control-label">
              {item.displayName}
            </label>
          </div>
        ))}
      {data && data.length > 10 && (
        <p
          className="products-family-popover d-inline-block links mb-4"
          onClick={handleClick}
        >
          Show more
        </p>
      )}

      {data && data.length > 10 && (
        <Overlay
          show={show}
          target={target}
          placement="right"
          container={ref.current}
          rootClose={true}
          onHide={handleClick}
        >
          <Popover className="option-popup">
            <Popover.Title as="h4"></Popover.Title>
            <Popover.Content>
              <div className="popover-content">
                <h4>{popOverTitle}</h4>
                {popoverData &&
                  popoverData.map((item) => (
                    <div
                      key={item.id}
                      className="custom-control custom-checkbox"
                    >
                      {Boolean(
                        checkedValues.find((val) => val.id === item.id)
                      ) && (
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          value={item.id}
                          defaultChecked={true}
                          onChange={(e) => onFilterSelect(e, item)}
                        />
                      )}
                      {!Boolean(
                        checkedValues.find((val) => val.id === item.id)
                      ) && (
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          value={item.id}
                          onChange={(e) => onFilterSelect(e, item)}
                        />
                      )}
                      <label className="custom-control-label">
                        {item.displayName}
                      </label>
                    </div>
                  ))}
                {/* <div className="popover-footer">
                                <div className="text-right">
                                    <a href="" className="apply-button">Apply</a>
                                </div>
                            </div> */}
              </div>
            </Popover.Content>
          </Popover>
        </Overlay>
      )}
    </>
  );
};

export default Filters;
