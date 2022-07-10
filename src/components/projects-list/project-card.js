import React from "react";
import { withRouter } from "react-router-dom";
// import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { getBimmatchCDNURL } from "../../utils";
import { withTracking } from "../../common/contexts/tracking";

const ProjectCard = ({ house, history, tracking }) => {
  var imgLocation =
    process.env.NODE_ENV === "development"
      ? house.images && house.images.length > 0 && house.images[0].location
      : house.images && house.images.length > 0 && house.images[0].Key
      ? getBimmatchCDNURL(house.images[0].location, house.images[0].Key)
      : house.images && house.images.length > 0 && house.images[0].location;

  const handleProjectDetails = (e) => {
    tracking &&
      tracking.track("View Project", {
        projectid: house.id,
      });
    history.push(`/project/${house.id}`);
  };

  let createdBy = house && house.createdBy && house.createdBy.displayName;
  // for backward compatibility - start
  if (!createdBy) {
    createdBy = house && house.architect && house.architect.name;
  }
  // for backward compatibility - end

  return (
    <div
      className="card dark-bg"
      style={{ cursor: "pointer" }}
      onClick={handleProjectDetails}
    >
      {house && house.demo && (
        <div className="tag-wrap">
          <h4>
            <Badge variant="secondary">DEMO</Badge>
          </h4>
        </div>
      )}
      <div className="image-wrap">
        {house.images && house.images[0] ? (
          <img alt="card" className="img-fluid w-100" src={imgLocation} />
        ) : (
          <div className="text-center">
            <img
              alt="card"
              className="img-fluid w-100 default-icon"
              src="/images/bimmatch/default.svg"
            />
          </div>
        )}
      </div>
      <div className="cube-wrap">
        {/* <img alt="card image" className="img-fluid w-100" src="images/image-22.jpg" /> */}
      </div>

      <div className="card-block">
        <h4 className="card-title">
          {house.displayName}
          {/* <Button variant="link" className="float-right">
            <img alt="ring" src="/images/icon/ring.svg" />
          </Button> */}
        </h4>
        <p className="card-text">
          <span>Created by</span>
          {createdBy}
        </p>
      </div>
    </div>
  );
};

export default withRouter(withTracking(ProjectCard));
