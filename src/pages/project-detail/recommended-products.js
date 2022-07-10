import React, { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";
import Button from "react-bootstrap/Button";
import MultiSelect from "./multiselect-dropdown";
import ProductItem from "./product-item";
import { withTracking } from "../../common/contexts/tracking";

// const DEFAULT_DISTANCE = 50;

const SEARCH = gql`
  query RecommendProducts(
    $id: ID!
    $from: Int
    $size: Int
    $input: SearchInput
  ) {
    recommendProducts(id: $id, from: $from, size: $size, input: $input) {
      hits {
        total
        results {
          id
          displayName
          images {
            location
            displayName
            type
            Key
          }
          categories {
            id
            displayName
          }
          brand {
            id
            displayName
          }
          price {
            unit
            forUnits
            currency
            total
          }
        }
      }
      facets {
        id
        buckets {
          id
          displayName
          count
        }
        otherCount
      }
    }
  }
`;

const FACET_MAPPINGS = {
  categories: "Products Types ",
  brand: "Brands ",
  distributors: "Distributors ",
  distance: "Distance (in KM) ",
};

const FACET_KEYS = Object.keys(FACET_MAPPINGS);

const getFacetsQuery = (selectedFacetsLocal) => {
  let inputFacets = [];
  if (selectedFacetsLocal && selectedFacetsLocal.length > 0) {
    inputFacets = selectedFacetsLocal.reduce((acc, facet) => {
      const facetInput = acc.find((val) => val.id === facet.facetId);
      if (!facetInput) {
        return [...acc, { id: facet.facetId, values: [facet.id] }];
      } else {
        facetInput.values.push(facet.id);
      }
      return acc;
    }, []);
  }
  return inputFacets;
};

const default_page = { size: 9, from: 0 };

const RecommendedProducts = ({ id, location, tracking, recommend }) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  // const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  const initialQueryText =
    window.sessionStorage.getItem("rp_query") || undefined;
  const initialFacets = JSON.parse(
    window.sessionStorage.getItem("rp_facets") || "[]"
  );
  const [searchQuery, setSearchQuery] = useState(initialQueryText);
  const [selectedFacets, setSelectedFacets] = useState(initialFacets);
  const variables = {
    input: {
      facets: getFacetsQuery(selectedFacets),
      text: searchQuery,
    },
    ...default_page,
    id,
  };
  const { loading, data } = useQuery(SEARCH, {
    variables,
    onCompleted: (data) => {
      setShowPopover(false);
    },
  });

  const addFacet = (item, facetId) => {
    const newFacets = [...selectedFacets, { ...item, facetId }];
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("rp_facets", JSON.stringify(newFacets));
  };
  const removeFacet = (item, facetId) => {
    const newFacets = selectedFacets.filter((facet) => facet.id !== item.id);
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("rp_facets", JSON.stringify(newFacets));
  };
  const removeFacets = (items) => {
    const newFacets = selectedFacets.filter((facet) =>
      items.find((ele) => ele.id !== facet.id)
    );
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("rp_facets", JSON.stringify(newFacets));
  };
  const resetFacets = () => {
    const newFacets = [];
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("rp_facets", JSON.stringify(newFacets));
  };

  useEffect(() => {
    let text = recommend && recommend.category.trim().replace(/Revit/i, "");
    setSearchQuery(text);
  }, [recommend]);

  const onViewDetails = (selectedProduct) => {
    selectedProduct &&
      tracking &&
      tracking.track("View Product", {
        type: "Matched Products",
        productid: selectedProduct.id,
        productname: selectedProduct.displayName,
      });
  };

  const handleShowPopOver = () => {
    setShowPopover(!showPopover);
    showPopover &&
      tracking &&
      tracking.track("Show Filters", {
        type: "Matched Products",
      });
  };

  const { facets: facetsData = [], hits = {} } =
    (data && data.recommendProducts) || {};
  const products = hits.results || [];
  const totalProducts = hits.total || 0;
  let facets = [...facetsData];
  facets &&
    facets.length > 0 &&
    facets.sort((a, b) => {
      if (FACET_KEYS.indexOf(a.id) > FACET_KEYS.indexOf(b.id)) {
        return 1;
      } else {
        return -1;
      }
    });

  const filtersSelections =
    selectedFacets &&
    FACET_KEYS.reduce((acc, key) => {
      acc[key] = selectedFacets.filter((itm) => itm.facetId === key);
      return acc;
    }, {});

  return (
    <>
      <ul className="filter-list">
        <li
          key="first"
          ref={popoverRef}
          className="filter-prod-detail first"
          onClick={handleShowPopOver}
        >
          Filter
        </li>
        {selectedFacets &&
          selectedFacets.length > 0 &&
          selectedFacets.map((facet, index) => (
            <li key={index} className="filter-item">
              {facet.displayName}
              <span
                className="close-tag"
                onClick={(e) => {
                  removeFacet(facet);
                }}
              >
                &times;
              </span>
            </li>
          ))}
        {selectedFacets && selectedFacets.length > 0 ? (
          <li
            key="last"
            className="clear-all-filter"
            onClick={(e) => resetFacets(e)}
          >
            Clear all filters
          </li>
        ) : (
          <li key="last"></li>
        )}
        {/* {location && <li className="filter-item">Within {distance} km</li>} */}
      </ul>
      <div className="product-list" style={{ marginTop: "20px" }}>
        <div className="row product-row equal">
          {products &&
            products.length > 0 &&
            products.map((product, index) => (
              <ProductItem
                key={index}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          {!loading && totalProducts === 0 && (
            <div style={{ margin: "auto" }}>No products found.</div>
          )}
        </div>
      </div>
      {showPopover && (
        <Overlay
          show={showPopover}
          target={popoverRef.current}
          placement="left-start"
          rootClose={true}
          onHide={() => setShowPopover(false)}
        >
          <Popover className="filter-product-form first-time-c">
            <Popover.Content>
              <div className="popover-content">
                <form>
                  <div className="row">
                    {facets &&
                      facets.length > 0 &&
                      facets.map((facet) => (
                        <React.Fragment key={facet.id}>
                          <div className="col-12">
                            <div className="form-group">
                              <label className="select-lable">
                                {FACET_MAPPINGS[facet.id]}
                                <span
                                  className="count"
                                  style={{ marginLeft: "5px" }}
                                >
                                  {filtersSelections[facet.id] &&
                                    filtersSelections[facet.id].length > 0 &&
                                    `(${filtersSelections[facet.id].length})`}
                                </span>
                                {filtersSelections[facet.id] &&
                                  filtersSelections[facet.id].length > 0 && (
                                    <Button
                                      variant="link"
                                      style={{
                                        marginLeft: "5px",
                                        padding: "0px",
                                        fontSize: "0.9rem",
                                      }}
                                      onClick={(e) => {
                                        removeFacets(
                                          filtersSelections[facet.id]
                                        );
                                      }}
                                    >
                                      Clear
                                    </Button>
                                  )}
                              </label>
                              <div className="select-style">
                                <MultiSelect
                                  selectedValues={selectedFacets.filter(
                                    (itm) => itm.facetId === facet.id
                                  )}
                                  values={facet.buckets}
                                  addSelect={(item) => {
                                    setShowPopover(false);
                                    addFacet(item, facet.id);
                                  }}
                                  removeSelect={(item) => {
                                    setShowPopover(false);
                                    removeFacet(item, facet.id);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </form>
              </div>
            </Popover.Content>
          </Popover>
        </Overlay>
      )}
    </>
  );
};
export default withTracking(RecommendedProducts);
