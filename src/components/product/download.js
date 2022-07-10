import React, { useState } from "react";
import Login from "../login";
import { getDownloadUrl } from "../../common/services";
import { useAuth } from "../../common/contexts/auth";
import { useTracking } from "../../common/contexts/tracking";
import { ReactComponent as DownloadIcon } from "../../images/icon/download_grey.svg";

const Download = ({
  bimFile,
  cadFile,
  specFile,
  installationFile,
  textureFile,
  id,
  displayName,
}) => {
  const tracking = useTracking();
  const auth = useAuth();
  const [displaySignIn, setDisplaySignIn] = useState(false);

  const displaySignInHandler = (bool) => {
    setDisplaySignIn(bool);
  };

  const noDownload = !Boolean(
    bimFile || cadFile || specFile || installationFile || textureFile
  );
  const fileDownloadHandler = (evt, obj) => {
    if (auth && auth.isAuthenticated) {
      tracking && tracking.track("Product Download", obj);
    } else {
      displaySignInHandler(!displaySignIn);
      evt.preventDefault();
      evt.stopPropagation();
    }
  };
  return (
    <>
      {!(auth && auth.isAuthenticated) && (
        <Login show={displaySignIn} handleClose={displaySignInHandler} />
      )}
      <div className="col-12 mt-3">
        <div className="download-wrap">
          <div className="text-wrap">
            <p>
              <DownloadIcon height="16px" /> Downloads{" "}
            </p>
          </div>
          <div className="item-wrap">
            {noDownload && <p className="my-1">No downloads available</p>}
            {bimFile && (
              <h5>
                <a
                  href={getDownloadUrl(bimFile.Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    fileDownloadHandler(e, {
                      productId: id,
                      productName: displayName,
                      type: "RVT",
                      Key: bimFile.Key,
                      metaName: bimFile.displayName,
                    });
                  }}
                >
                  RVT
                </a>
              </h5>
            )}
            {cadFile && (
              <h5>
                <a
                  href={getDownloadUrl(cadFile.Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    fileDownloadHandler(e, {
                      productId: id,
                      productName: displayName,
                      type: "CAD",
                      Key: cadFile.Key,
                      metaName: cadFile.displayName,
                    })
                  }
                >
                  CAD
                </a>
              </h5>
            )}
            {specFile && (
              <h5>
                <a
                  href={getDownloadUrl(specFile.Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    fileDownloadHandler(e, {
                      productId: id,
                      productName: displayName,
                      type: "SPEC",
                      Key: specFile.Key,
                      metaName: specFile.displayName,
                    })
                  }
                >
                  SPEC
                </a>
              </h5>
            )}
            {installationFile && (
              <h5>
                <a
                  href={getDownloadUrl(installationFile.Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    fileDownloadHandler(e, {
                      productId: id,
                      productName: displayName,
                      type: "INSTALLATION",
                      Key: installationFile.Key,
                      metaName: installationFile.displayName,
                    })
                  }
                >
                  INSTALLATION
                </a>
              </h5>
            )}
            {textureFile && (
              <h5>
                <a
                  href={getDownloadUrl(textureFile.Key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    fileDownloadHandler(e, {
                      productId: id,
                      productName: displayName,
                      type: "TEXTURE",
                      Key: textureFile.Key,
                      metaName: textureFile.displayName,
                    })
                  }
                >
                  TEXTURE
                </a>
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Download;
