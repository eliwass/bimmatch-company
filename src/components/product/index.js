import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useQuery, gql } from "@apollo/client";

// import ImageSlider from "./image-slider";
import ImageCarousel from "../carousel";
import DistributorMap from "./distributor-map";
import { useTracking } from "../../common/contexts/tracking";
import { getCurrencyForCode } from "../../utils";
import Share from "../share";
// import { useAuth } from "../../common/contexts/auth";
import Download from "./download";

export const GET_PRODUCT_DETAIL = gql`
  query($id: ID!) {
    getProduct(id: $id) {
      id
      displayName
      description
      externalId
      installationType
      styles
      materials
      installationInfo
      warranty
      certifications
      environmentals
      features
      size
      weight
      price {
        unit
        forUnits
        currency
        base
        tax
        discount
        total
      }
      distributors {
        id
        displayName
        mapLocation {
          lat
          lng
        }
        contact {
          address
        }
      }
      categories {
        id
        displayName
      }
      brand {
        id
        displayName
      }
      images {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
      bimFile {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
      cadFile {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
      specFile {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
      installationFile {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
      textureFile {
        displayName
        location
        type
        ETag
        Key
        Bucket
      }
    }
  }
`;

const ProductDetail = ({ product }) => {
  const tracking = useTracking();
  // const auth = useAuth();
  const { loading, data } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { id: product.id },
  });
  const [showDistributorMap, setShowDistributorMap] = useState(false);
  if (loading) {
    return <div className="main-slider">Loading...</div>;
  }

  const productDetail = (data && data.getProduct) || {};

  const {
    displayName,
    images,
    brand,
    categories,
    description,
    materials,
    size,
    distributors,
    bimFile,
    cadFile,
    specFile,
    installationFile,
    textureFile,
  } = productDetail;

  const handleViewDistributors = (e) => {
    e.preventDefault();
    tracking &&
      tracking.track("View Distributors", {
        productId: product.id,
        productName: displayName,
      });
    setShowDistributorMap(true);
  };

  const handleMapClose = () => {
    setShowDistributorMap(false);
  };

  const price =
    productDetail.price &&
    `${
      productDetail.price.currency
        ? getCurrencyForCode(productDetail.price.currency)
        : ""
    } 
    ${productDetail.price.total ? productDetail.price.total : ""} 
    ${productDetail.price.unit ? "/" : ""} 
    ${
      productDetail.price.forUnits && productDetail.price.forUnits > 1
        ? productDetail.price.forUnits
        : ""
    } 
    ${productDetail.price.unit ? productDetail.price.unit : ""}`;

  return (
    <>
      {showDistributorMap && (
        <Modal show={true} centered size="lg" onHide={handleMapClose}>
          <Modal.Body style={{ padding: "0px" }}>
            <DistributorMap distributors={distributors} />
          </Modal.Body>
        </Modal>
      )}
      <div className="main-slider">
        <div className="main-item">
          <div className="left-content slider-col">
            {images && (
              <div className="product-slider-wrap">
                {/* <ImageSlider images={images} /> */}
                <ImageCarousel images={images} />
              </div>
            )}
          </div>
          <div className="right-content">
            <div className="content-wrap">
              <div className="row no-gutters">
                <div className="col-12">
                  <div className="product-head">
                    <h4>{displayName}</h4>
                  </div>
                  <div className="product-option">
                    <ul className="option-list">
                      <li>
                        <Share
                          image={images ? images[0] : null}
                          product={displayName}
                        />
                      </li>
                      <li>
                        {/* <a href="#" className="red-button add-to-project popup-add-project"><span className="icon"></span> ADD TO PROJECT</a> */}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col">
                  <ul className="tag-list">
                    {categories &&
                      categories.map((item, index) => (
                        <li key={index}>{item.displayName}</li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col">
                  {/* <ul className="other-list">
                    <li>{product.brand && product.brand.displayName}</li>
                    <li>3 <img src="images/icon/truck-blue.svg" alt="image" /></li>
                  </ul> */}
                  <h6 className="mt-1 text-secondary">
                    {brand && brand.displayName}
                  </h6>
                </div>
                <div className="col">
                  <h5 className="price" style={{ textTransform: "lowercase" }}>
                    {price}
                  </h5>
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-12">
                  <p className="product-desc">{description}</p>
                </div>
                {materials && (
                  <div className="col-12">
                    <p className="sub-head d-inline-block">Materials:</p>
                    <ul className="tag-list off-white d-inline-block">
                      {materials.split("|").map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* <div className="col-12">
                  <div className="quality-wrap">
                    <div className="image-quality-wrap">
                      <img
                        src="/images/icon/water-efficiency.svg"
                        alt="Water efficiency certificate"
                      />
                    </div>
                    <div className="content-quality-wrap">
                      <p className="text-green">
                        Water
                        <br />
                        Efficiency
                      </p>
                    </div>
                  </div>
                  <div className="quality-wrap">
                    <div className="image-quality-wrap">
                      <img
                        src="/images/icon/regional-priority.svg"
                        alt="regional priority"
                      />
                    </div>
                    <div className="content-quality-wrap">
                      <p className="text-brown">
                        Regional
                        <br />
                        Priority
                      </p>
                    </div>
                  </div>
                </div> */}
                {size && (
                  <div className="col-12">
                    <p className="sub-head d-inline-block">Size:</p>
                    <ul className="tag-list off-white d-inline-block">
                      {size.split("|").map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="col-12">
                  {distributors && distributors.length > 0 && (
                    <div className="form-wrap">
                      <h5>Distributors</h5>
                      <h5>
                        <button
                          className="btn btn-link"
                          onClick={handleViewDistributors}
                        >
                          <img
                            src="/images/icon/truck-blue.svg"
                            alt="distributors"
                          />{" "}
                          See local distributors
                        </button>
                      </h5>
                    </div>
                  )}
                </div>
                <Download
                  bimFile={bimFile}
                  cadFile={cadFile}
                  specFile={specFile}
                  installationFile={installationFile}
                  textureFile={textureFile}
                  id={product.id}
                  displayName={displayName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
