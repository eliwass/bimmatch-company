import React, { useEffect, Fragment } from "react";
import { Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

const BOMview = ({ bomviewItemEvent, display, data }) => {
  const categoryNames = [
    "Windows",
    "Doors",
    "Walls",
    "Gypsum",
    "Partitions",
    "Green Walls",
    "Fire Alarm Devices",
    "Sprinklers",
    "Floors",
    "Ceilings",
    "Plumbing",
    "Pipes",
    "Lighting",
    "Air Terminals",
    "Cable tray Fittings",
    "Cable Trays",
    "Duct",
    "HVAC",
    "MEP",
    "Furniture",
    "Casework",
    "Topography",
    "Planting",
    "Site",
    "Materials",
    "Finishings",
    "Structural",
    "Columns",
    "Stairs",
    "Railings",
    "Electrical",
    "Fixtures",
    "Call Devices",
    "Communication",
    "Telephone",
    "Electrical Equipment",
    "Wire",
    "Conduits",
    "Curtain Walls",
    "Curtain Panels",
    "Curtain Systems",
    "Mechanical Equipment",
    "Elevators",
    "Shaft Openings",
    "Security Devices",
    "Roofs",
    "Parking",
    "Roads",
    "Ramps",
  ];
  useEffect(() => {
    if (display) {
      document.getElementById("BOMViewer").style.display = "block";
    }
  });
  return (
    <div className="pt-5" id="BOMViewer" style={{ display: "none" }}>
      <div className="totaPpriceWrap">
        <div className="totaPprice cardtotaPprice">
          $848,680
          <div
            id="totalpriceCircle"
            style={{
              background: `radial-gradient(circle closest-side, white 0, white 2.5%, transparent 5%, transparent 100%, #eeeeee 0), conic-gradient(#151515 0, #151515 60%, #ffffff 0%, #ffffff 100%)`,
            }}
          ></div>
        </div>
      </div>

      <div className="subtooltitle">
        {/* {data.projectName > 20 ? (
          <OverlayTrigger overlay={<Tooltip>{data.projectName}</Tooltip>}>
            <span className="d-inline-block">
              <div className="projectTitle">{data.projectName}</div>
            </span>
          </OverlayTrigger>
        ) : (
          <span className="d-inline-block">
            <div className="projectTitle">{data.projectName}</div>
          </span>
        )} */}
      </div>
      <div className="cardBody">
        <div className="col-md-12">
          {data.data.map((item, i) => (
            <Fragment key={i}>
              {}
              <Col className="cardItem" md={4} sm="12">
                <Card onClick={() => bomviewItemEvent(item)}>
                  <Card.Body>
                    <Card.Title className="cardHeader">
                      <img
                        src={
                          "/images/icon/icons/" +
                          (categoryNames.indexOf(item.category) !== -1
                            ? item.category
                            : "Generic") +
                          ".svg"
                        }
                        className="Sicon"
                        alt=""
                      />
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">{item.name}</Tooltip>
                        }
                      >
                        <div className="realTitle">{item.name}</div>
                      </OverlayTrigger>
                    </Card.Title>
                    <Card.Text className="pl-5 cardContent">{`${item.count} ${item.unit}`}</Card.Text>
                    <div className="cardFooter">
                      <div className="Sicons">
                        {/* <img
                        src="/images/icon/icons/Sicon1.svg"
                        className="Sicon"
                        alt="icon"
                      />
                      <img
                        src="/images/icon/icons/Sicon2.svg"
                        className="Sicon"
                        alt="icon"
                      />
                      <img
                        src="/images/icon/icons/Sicon3.svg"
                        className="Sicon"
                        alt="icon"
                      /> */}
                      </div>
                      <div className="priceSicon">
                        <span className="cardfooterprice">
                          {"$" + Math.floor(Math.random() * 1000)}
                        </span>
                        <div
                          className="pie-chart Sicon"
                          style={{
                            background: `radial-gradient(circle closest-side, white 0, white 2.5%, transparent 5%, transparent 100%, white 0  ), conic-gradient(#151515 0, #151515 ${Math.floor(
                              Math.random() * 100
                            )}%, #d8d8d8 0, #d8d8d8 100%)`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BOMview;
