import React from "react";
import { getCatalogCDNURL, getCurrencyForCode } from "../../utils";
import { Link } from "react-router-dom";

const ProductItem = ({ product = {}, onViewDetails }) => {
  const { displayName, categories } = product;
  const imgLocation =
    product.images &&
    product.images[0].Key &&
    getCatalogCDNURL(null, product.images[0].Key);
  const category =
    categories && categories.length > 0 && categories[0].displayName;
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

  const handleViewDetails = (e) => {
    onViewDetails(product);
  };
  return (
    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
      <div className="product-wrap">
        <div className="image-wrap">
          <div
            className="image background-image"
            style={{ backgroundImage: `url(${imgLocation})` }}
          ></div>
          <div className="overlay-hover">
            <Link
              className="view-detail-button"
              data-toggle="modal"
              data-target="#product_system_view"
              tabIndex="0"
              to={{
                pathname: `/products/${product.id}`,
                state: {
                  internal: true,
                },
              }}
              onClick={handleViewDetails}
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
        </div>
        <div className="product-content">
          <h6>{displayName}</h6>
          {/* <p className="quality-img">
                        <img src="/images/icon/regional-priority.svg" className="img-fluid" alt="icon" />
                        <img src="/images/icon/water-efficiency.svg" className="img-fluid" alt="icon" />
                    </p> */}
          <p className="category">{category}</p>
          {price && <p className="price text-right">{price}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
