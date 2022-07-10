import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useQuery, gql } from "@apollo/client";
import * as Icon from "react-bootstrap-icons";

const GET_DETAIL_INFO = gql`
  query($id: ID!, $at: Int) {
    getBOM(id: $id, at: $at) {
      objectid
      name
      unit
      category
      count
      objects {
        objectid
        name
        unit
        category
        count
        objects {
          objectid
          name
          unit
          category
          count
          objects {
            objectid
            name
            unit
            category
            count
          }
        }
      }
    }
  }
`;
const BOMview = ({ bomviewItemEvent, display, gqldata }) => {
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
  const [activegroups, setactivegroups] = useState({});
  const [DBdata, setDBdata] = useState([]);

  const { data } = useQuery(GET_DETAIL_INFO, {
    variables: { id: gqldata.id, at: gqldata.objectid },
  });

  const set_level = useCallback((baseData, level, pid) => {
    let allArray = [];
    for (let i = 0; i < baseData.length; i++) {
      let temp = {};
      temp["objectid"] = baseData[i].objectid;
      temp["name"] = baseData[i].name;
      temp["category"] = baseData[i].category;
      temp["count"] = baseData[i].count;
      temp["unit"] = baseData[i].unit;
      temp["level"] = level;
      if (baseData[i].objects) {
        temp["objects"] = set_level(
          baseData[i].objects,
          level + 1,
          baseData[i].objectid
        );
      } else {
        temp["objects"] = [];
      }
      allArray.push(temp);
    }
    return allArray;
  }, []);

  const setCollapse = (params) => {
    if (activegroups[params.objectid] === true) {
      setactivegroups({ ...activegroups, [params.objectid]: false });
    } else {
      setactivegroups({ ...activegroups, [params.objectid]: true });
    }
  };

  useEffect(() => {
    if (data && data.getBOM) {
      let Rimdata = set_level(data.getBOM[0].objects, 0, 0);
      setDBdata(Rimdata);
    }
  }, [data, set_level]);

  const Children = ({ items }) => {
    return (
      <Fragment>
        {items.map((item, i) => (
          <Fragment key={i}>
            <div className="rowl">
              <div className="rowl2">
                <div className="trow">
                  <div
                    className="showTree"
                    style={{ paddingLeft: `${item.level * 20}px` }}
                  >
                    <div className="w-4 toggleicon">
                      {item.objects && item.objects.length ? (
                        <Fragment>
                          <div
                            className="changeToggle"
                            onClick={() => setCollapse(item)}
                          >
                            {activegroups[item.objectid] ? (
                              <div className="open">
                                <Icon.ChevronDown />
                              </div>
                            ) : (
                              <div className="close">
                                <Icon.ChevronRight />
                              </div>
                            )}
                          </div>
                        </Fragment>
                      ) : (
                        <div className="space"></div>
                      )}
                    </div>
                    <div className="itemTableTile">{item.name}</div>
                  </div>
                  <div style={{ width: "15%" }}>{`${
                    Math.round(item.count * 100) / 100
                  }  ${item.unit}`}</div>
                  <div style={{ width: "15%" }}></div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    {/* <img src="/images/icon/icons/Sicon1.svg" alt="icon" />
                    <img
                      src="/images/icon/icons/Sicon2.svg"
                      className="ml-1"
                      alt="icon"
                    /> */}
                  </div>
                  <div style={{ width: "25%", textAlign: "right" }}>
                    {"$" + Math.floor(Math.random() * 1000)}
                    <div
                      className="pie-chart Sicon"
                      style={{
                        width: 18,
                        height: 18,
                        marginLeft: 5,
                        background: `radial-gradient(circle closest-side, white 0, white 2.5%, transparent 5%, transparent 100%, white 0  ), conic-gradient(#151515 0, #151515 ${Math.floor(
                          Math.random() * 100
                        )}%, #d8d8d8 0, #d8d8d8 100%)`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {item.objects &&
            item.objects.length &&
            activegroups[item.objectid] ? (
              <Children items={item.objects} />
            ) : null}
          </Fragment>
        ))}
      </Fragment>
    );
  };

  useEffect(() => {
    if (display) {
      document.getElementById("BOMViewer").style.display = "block";
    }
  }, [display]);

  return (
    <div className="col-md-12 pt-5" id="BOMViewer" style={{ display: "none" }}>
      <div className="totaPpriceWrap">
        <div className="totaPprice">
          $848,680
          <div
            id="totalpriceCircle"
            style={{
              background: `radial-gradient(circle closest-side, white 0, white 2.5%, transparent 5%, transparent 100%, #eeeeee 0), conic-gradient(#151515 0, #151515 60%, #ffffff 0, #ffffff 100%)`,
            }}
          ></div>
        </div>
      </div>
      <div className="headerToolbar">
        {/* {gqldata.projectName.length > 20 ? (
          <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">{gqldata.projectName}</Tooltip>
            }
          >
            <span>
              <div
                className="projectTitleDetial"
                onClick={() => bomviewItemEvent()}
              >
                {gqldata.projectName}
              </div>
            </span>
          </OverlayTrigger>
        ) : (
          <span>
            <div
              className="projectTitleDetial"
              onClick={() => bomviewItemEvent()}
            >
              {gqldata.projectName}
            </div>
          </span>
        )} */}
        <span
          className="BackCatatory projectTitleDetial"
          onClick={() => bomviewItemEvent()}
        >
          <Icon.ChevronLeft className="backIcon" />
          <b>Back to Categories</b>
        </span>
      </div>
      <div className="mainTalbeWrap">
        <div className="col-md-12 mainTalbe">
          <div className="mainTalbe-first">
            <div className="table-first">
              <img
                src={
                  "/images/icon/icons/" +
                  (categoryNames.indexOf(gqldata.category) !== -1
                    ? gqldata.category
                    : "Generic") +
                  ".svg"
                }
                className="Sicon"
                alt=""
              />
              <div style={{ paddingLeft: 10 }}>
                <b>{gqldata.name}</b>
              </div>
            </div>
            <div className="table-second">
              <b>{`${gqldata.count} ${gqldata.unit}`}</b>
            </div>
            <div className="table-third">{/* <b>500 m3</b> */}</div>
            <div className="table-fourd">
              {/* <img
                src="/images/icon/icons/Sicon1.svg"
                className="Sicon"
                alt=""
              />
              <img
                src="/images/icon/icons/Sicon2.svg"
                className="Sicon ml-1"
                alt=""
              /> */}
            </div>
            <div className="table-five">
              <b>{"$" + Math.round(Math.random() * 1000)}</b>
              <div
                className="pie-chart Sicon chart"
                style={{
                  background: `radial-gradient(circle closest-side, white 0, white 2.5%, transparent 5%, transparent 100%, white 0  ), conic-gradient(#151515 0, #151515 ${Math.floor(
                    Math.random() * 100
                  )}%, #d8d8d8 0, #d8d8d8 100%)`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <Children items={DBdata} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOMview;
