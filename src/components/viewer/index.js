import React, { useRef, useState, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/browser";
import { getAutodeskToken } from "../../common/services";
import { LoadScript, LoadStyle } from "../../common/utils";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";

const timeout = 100;

const useInitialize = () => {
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    if (!isReady) {
      const promises = [];
      promises.push(
        LoadStyle(
          `https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css`
        )
      );
      promises.push(
        LoadScript(
          `https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js`
        )
      );
      Promise.all(promises)
        .then((isLoaded) => {
          const checkValidity = () => {
            if (!(window.Autodesk && window.Autodesk.Viewing)) {
              setTimeout(checkValidity, timeout);
            } else {
              const options = {
                env: "AutodeskProduction",
                api: "derivativeV2", // for models uploaded to EMEA change this option to 'derivativeV2_EU'
                getAccessToken: function (onTokenReady) {
                  getAutodeskToken()
                    .then(({ data }) => {
                      onTokenReady(data.access_token, data.expires_in);
                    })
                    .catch((error) => {
                      Sentry.captureException(error);
                    });
                },
              };
              window.Autodesk.Viewing.Initializer(options, () => {
                console.log("Autodesk Viewer Successfully Initialized");
                setReady(true);
              });
            }
          };
          setTimeout(checkValidity, timeout);
        })
        .catch((error) => {
          Sentry.captureException(error);
        });
    }
  });

  return isReady;
};

const Viewer = ({ urn, onItemSelected, isScreenShotRequired, name }) => {
  const isReady = useInitialize();
  const forgeViewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  if (document.getElementsByClassName("adsk-viewing-viewer")[0]) {
    document.getElementsByClassName("adsk-viewing-viewer")[0].style.height =
      "95%";
  }
  useEffect(() => {
    if (isReady && forgeViewerRef && forgeViewerRef.current) {
      let viewer = new window.Autodesk.Viewing.GuiViewer3D(
        document.getElementById("forgeViewer")
      );
      const startedCode = viewer.start();
      if (startedCode > 0) {
        setViewer(null);
        console.error("Failed to create a Viewer: WebGL not supported.");
        return;
      }
      setViewer(viewer);
    } else {
      setViewer(null);
    }
  }, [isReady]);

  useEffect(() => {
    viewer &&
      window.Autodesk.Viewing.Document.load(`urn:${urn}`, (viewerDocument) => {
        var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
        viewer && viewer.loadDocumentNode(viewerDocument, defaultModel);
      });
    return () => {
      viewer && viewer.finish();
      window.Autodesk.Viewing.shutdown();
    };
  }, [urn, viewer]);

  const onSelectionChange = useCallback(
    (event) => {
      if (event.dbIdArray.length === 1) {
        viewer &&
          viewer.getProperties(event.dbIdArray[0], (data) => {
            if (isScreenShotRequired) {
              var screenShot = viewer.getScreenShotBuffer(
                null,
                null,
                (screenShot) => {
                  onItemSelected &&
                    onItemSelected({ data: data, screenShot: screenShot });
                }
              );
              onItemSelected &&
                onItemSelected({ data: data, screenShot: screenShot });
            } else {
              onItemSelected && onItemSelected({ data: data });
            }
          });
      } else {
        onItemSelected && onItemSelected(null);
      }
    },
    [viewer, onItemSelected, isScreenShotRequired]
  );

  useEffect(() => {
    viewer &&
      viewer.addEventListener(
        window.Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        onSelectionChange
      );
    return () => {
      viewer &&
        viewer.removeEventListener(
          window.Autodesk.Viewing.SELECTION_CHANGED_EVENT,
          onSelectionChange
        );
    };
  }, [viewer, onSelectionChange]);
  return (
    <div id="forgeViewer" ref={forgeViewerRef}>
      {/* {name.length > 20 ? (
        <OverlayTrigger overlay={<Tooltip>{name}</Tooltip>}>
          <span
            className="d-inline-block"
            style={{ position: "absolute", left: 40, top: 68, zIndex: "999" }}
          >
            <div className="projectTitle">{name}</div>
          </span>
        </OverlayTrigger>
      ) : (
        <span
          className="d-inline-block"
          style={{ position: "absolute", left: 40, top: 68, zIndex: "999" }}
        >
          <div className="projectTitle">{name}</div>
        </span>
      )} */}
    </div>
  );
};

export default Viewer;
