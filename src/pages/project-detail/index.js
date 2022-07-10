import React, { useState } from "react";
import * as Sentry from "@sentry/browser";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Layout } from "../../common/layout";
import Viewer from "../../components/viewer";
import BOMview from "../../components/viewer/BOMview";
import DetailTable from "../../components/viewer/detailTable";
import { getProjectManifest } from "../../common/services";
import RecommendedProducts from "./recommended-products";
import InviteTeam from "./invite-team";
import { useAuth } from "../../common/contexts/auth";
import { Button } from "react-bootstrap";

const GET_PROJECT_DETAIL = gql`
  query($id: ID!) {
    getHouse(id: $id) {
      id
      displayName
      model
      location
      images {
        location
        displayName
        type
        Key
      }
      createdBy {
        id
        displayName
        photoUrl
      }
      shareId
      team {
        user
        role
        photoUrl
        displayName
        email
      }
    }
  }
`;

const GET_CATEGARY = gql`
  query($id: ID!) {
    getBOM(id: $id) {
      objectid
      name
      unit
      category
      count
    }
  }
`;

const ATTRIBUTES_TO_GET = ["Category", "Area", "Volume"];

const filterInformationFromForgeObject = (obj) => {
  const properties =
    obj.properties &&
    obj.properties.filter((item) => {
      return (
        item.attributeName && ATTRIBUTES_TO_GET.includes(item.attributeName)
      );
    });

  return (
    properties &&
    properties.reduce((acc, item) => {
      acc[item.attributeName.toLowerCase()] = item.displayValue;
      return acc;
    }, {})
  );
};

const ProjectDetail = () => {
  let { id } = useParams();
  const { user } = useAuth();
  const [menuId, setMenuId] = useState("product");
  const [selectedItem, setSelectedItem] = useState();
  const [isProjectReady, setProjectReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ViewerMode, setViewerMode] = useState(true);
  const [BOMvsTable, setBOMvsTable] = useState(true);
  const [display, setDisplay] = useState(false);
  const [detalieOne, setDetalieOne] = useState({});

  const { loading, data } = useQuery(GET_PROJECT_DETAIL, {
    variables: { id },
    onCompleted: (data) => {
      data &&
        data.getHouse &&
        data.getHouse.model &&
        getStatus(data.getHouse.model);
    },
  });

  const catagery = useQuery(GET_CATEGARY, { variables: { id } });

  const house = data && data.getHouse;
  const isModel = house && Boolean(house.model);
  const formatted_address = house && house.location;
  const remove = (flag) => {
    if (!flag) {
      document.getElementById("forgeViewer").style.display = "none";
      document.getElementById("BOMViewer").style.display = "block";
    } else {
      document.getElementById("forgeViewer").style.display = "block";
      document.getElementById("BOMViewer").style.display = "none";
    }
    setViewerMode(flag);
  };

  const getStatus = (urn) => {
    getProjectManifest({ urn })
      .then((res) => {
        const { progress, status } = res.data;
        switch (status) {
          case "success":
            setProjectReady(true);
            break;
          case "inprogress":
            const p = parseInt(progress.substring(0, progress.indexOf("%")));
            setProgress(p);
            setTimeout(() => getStatus(urn), 500);
            break;
          case "failed":
          default:
          // setError(true);
        }
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  };

  const bomviewItemEvent = (param) => {
    setBOMvsTable(!BOMvsTable);
    setDisplay(true);
    setDetalieOne(param);
  };

  const onItemSelected = (obj) => {
    if (obj && obj.data) {
      setSelectedItem(filterInformationFromForgeObject(obj.data));
    } else {
      setSelectedItem(null);
    }
  };

  if (loading) {
    return <div className="project-detail">Loading...</div>;
  }

  return (
    <Layout>
      <div className="project-detail">
        <div className="content-left">
          <div
            className="project-cube-wrap height-90"
            style={{ paddingBottom: 85 }}
          >
            {isModel && isProjectReady && (
              <div>
                <div className="changeButton">
                  <Button
                    size="sm"
                    variant={ViewerMode === true ? "danger" : "default"}
                    onClick={() => remove(true)}
                  >
                    3D View
                  </Button>

                  <Button
                    size="sm"
                    variant={ViewerMode === false ? "danger" : "default"}
                    onClick={() => remove(false)}
                  >
                    BOM View
                  </Button>
                </div>
                <Viewer
                  urn={house.model}
                  name={house.displayName}
                  onItemSelected={onItemSelected}
                />
                {BOMvsTable ? (
                  <BOMview
                    bomviewItemEvent={bomviewItemEvent}
                    display={display}
                    data={{
                      data: catagery.data.getBOM,
                      projectName: house.displayName,
                    }}
                  />
                ) : (
                  <DetailTable
                    bomviewItemEvent={bomviewItemEvent}
                    display={display}
                    gqldata={{
                      ...detalieOne,
                      id: id,
                      projectName: house.displayName,
                    }}
                  />
                )}
              </div>
            )}
            {isModel && !isProjectReady && (
              <div className="bim-processing-container">
                <ProgressBar animated now={progress} />
                <h5 style={{ margin: "auto" }}>{`${progress}% complete`}</h5>
                <h3 style={{ margin: "auto" }}>PROCESSING PROJECT</h3>
              </div>
            )}
          </div>
        </div>
        <div className="content-right custom-right-panel">
          <div className="content-wrap">
            <div className="image-wrap top-image-view">
              <div className="overlay-text">
                <div className="row">
                  <div className="col-xl-8 col-lg-7 col-md-7 col-sm-7">
                    <div className="edit-content-wrap">
                      <div className="text-wrap">
                        <h5>{house.displayName}</h5>
                        {formatted_address && (
                          <p className="address">
                            <img
                              src="/images/icon/location.svg"
                              className="img-fluid"
                              alt="icon"
                            />
                            {` ${formatted_address}`}
                          </p>
                        )}
                      </div>
                      <div className="edit-wrap">
                        {/* {isEditable && (
                          <button
                            type="button"
                            className="edit-button"
                            data-toggle="modal"
                            data-target="#edit_detail"
                          >
                            <Edit />
                          </button>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="recommended-wrap">
              <ul className="menu-list link">
                <li
                  className={`${menuId === "product" ? "selected" : ""}`}
                  onClick={() => setMenuId("product")}
                >
                  Products
                </li>
                <li
                  className={`${menuId === "team" ? "selected" : ""}`}
                  onClick={() => setMenuId("team")}
                >
                  Team
                </li>
              </ul>
              {menuId === "product" && id && (
                <RecommendedProducts id={id} recommend={selectedItem} />
              )}
              {menuId === "team" && (
                <InviteTeam
                  houseId={id}
                  team={house.team}
                  contextUser={user && user.uid}
                  shareId={house.shareId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
