import React from "react";
import { getCatalogCDNURL, getCurrencyForCode } from "../../utils";
import { Link } from "react-router-dom";

export default ({ product, onViewDetails, showPrices = true }) => {
  const price =
    product.price &&
    `${
      product.price.currency ? getCurrencyForCode(product.price.currency) : ""
    } 
        ${product.price.total ? product.price.total : ""} 
        ${product.price.unit ? "/" : ""} 
        ${
          product.price.forUnits && product.price.forUnits > 1
            ? product.price.forUnits
            : ""
        } 
        ${product.price.unit ? product.price.unit : ""}`;
  // Load Images from CDN is available;
  const imgLocation =
    product.images &&
    product.images[0] &&
    product.images[0].Key &&
    getCatalogCDNURL(product.images[0].location, product.images[0].Key);
  return (
    <div className="card card-block masonry-cart-item">
      <div className="add-to-project-icon">
        <img
          src="/images/icon/pin-fill-white.svg"
          className="img-fluid"
          alt="add to project"
        />
      </div>
      <div className="image-wrap">
        {product.images && product.images[0] && (
          <img
            alt="card"
            className="img-fluid w-100"
            src={imgLocation}
            style={{ cursor: onViewDetails ? "pointer" : "unset" }}
            srcSet={`${imgLocation} 1024w, ${imgLocation}?size=640 640w, ${imgLocation}?size=320 320w`}
          />
        )}
        {onViewDetails && (
          <div className="overlay-hover">
            {/* <a className="add-project-button add-to-text">
                        <span className="center">
                            <span className="icon"></span> 
                            <span className="change-text">ADD TO PROJECT</span>
                        </span>
                    </a> */}
            <Link
              className="view-detail-button"
              onClick={() => onViewDetails && onViewDetails(product)}
              to={{
                pathname: `/products/${product.id}`,
                state: {
                  internal: true,
                },
              }}
            >
              <span>
                <img
                  src="/images/icon/full-view.svg"
                  className="img-fluid"
                  alt="icon"
                />
                VIEW DETAILS
              </span>
            </Link>
          </div>
        )}
      </div>
      <div className="card-block">
        <h4 className="card-title">{product.displayName}</h4>
        <div className="card-text">
          {product.categories &&
            product.categories.map(
              (cat, index) =>
                index < 3 && <span key={cat.id}>{cat.displayName}</span>
            )}
          {/* {product.categories && product.categories.length > 2 && <span>...</span>} */}
        </div>
        <ul className="card-bottom-text">
          <li>{product.brand && product.brand.displayName}</li>
          {/* <li>3<img src="images/icon/truck.svg" className="img-fluid" alt="truck" /></li> */}
        </ul>
        {showPrices && (
          <p className="card-price" style={{ textTransform: "lowercase" }}>
            {" "}
            {price}{" "}
          </p>
        )}
      </div>
    </div>
  );
};
