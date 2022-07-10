import React, { useState, useEffect, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import debounce from "lodash.debounce";
import { Layout } from "../../common/layout";
import ProductsList from "./products-list";
import Filters from "./Filters";
import { useTracking } from "../../common/contexts/tracking";

const SEARCH = gql`
  query Search($from: Int, $size: Int, $input: SearchInput) {
    search(from: $from, size: $size, input: $input) {
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

const default_page = { size: 45, from: 0 };

const Products = () => {
  const tracking = useTracking();
  const [page, setPage] = useState(default_page);
  const initialQueryText = window.sessionStorage.getItem("ps_query") || "";
  const initialFacets = JSON.parse(
    window.sessionStorage.getItem("ps_facets") || "[]"
  );
  const [searchQuery, setSearchQuery] = useState(initialQueryText);
  const [selectedFacets, setSelectedFacets] = useState(initialFacets);
  const variables = {
    input: {
      facets: getFacetsQuery(selectedFacets),
      text: searchQuery,
    },
  };
  const { loading, data, fetchMore: fetchSearch } = useQuery(SEARCH, {
    variables,
  });
  useEffect(() => {
    const scrollPagination = debounce(
      (pageLocal, selectedFacetsLocal, searchQueryLocal) => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          let from = pageLocal.from;
          let size = pageLocal.size;
          from = from + size;
          setPage({ from, size });
          fetchSearch({
            variables: {
              from,
              size,
              input: {
                facets: getFacetsQuery(selectedFacetsLocal),
                text: searchQueryLocal,
              },
            },
          });
        }
      },
      250
    );
    const onScrollListener = () => {
      scrollPagination(page, selectedFacets, searchQuery);
    };
    window.addEventListener("scroll", onScrollListener);
    return () => {
      window.removeEventListener("scroll", onScrollListener);
    };
  }, [page, selectedFacets, searchQuery, fetchSearch]);
  const fetchSearchOnChange = (facets, text) => {
    const inputFacets = getFacetsQuery(facets);
    setPage(default_page);
    fetchSearch({
      variables: {
        ...default_page,
        input: {
          facets: inputFacets,
          text,
        },
      },
    });
  };
  const addFacet = (item, facetId) => {
    const newFacets = [...selectedFacets, { ...item, facetId }];
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("ps_facets", JSON.stringify(newFacets));
    fetchSearchOnChange(newFacets);
  };
  const removeFacet = (item, facetId) => {
    const newFacets = selectedFacets.filter((facet) => facet.id !== item.id);
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("ps_facets", JSON.stringify(newFacets));
    fetchSearchOnChange(newFacets);
  };
  const resetFacets = () => {
    const newFacets = [];
    setSelectedFacets(newFacets);
    window.sessionStorage.setItem("ps_facets", JSON.stringify(newFacets));
    fetchSearchOnChange(newFacets);
  };
  const handleSearchQuery = useCallback(
    debounce(
      (text) => {
        window.sessionStorage.setItem("ps_query", text.trim());
        fetchSearchOnChange(selectedFacets, text.trim());
      },
      500,
      { maxWait: 1000 }
    ),
    [selectedFacets]
  );
  const trackingHandler = (name, data) => {
    tracking && tracking.track(name, data);
  };
  const { facets: facetsData = [], hits = {} } = (data && data.search) || {};
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

  return (
    <Layout>
      <div className="project-list">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-4 d-none d-xl-block d-lg-block d-md-block">
              <div className={`fix-menu`}>
                {facets &&
                  facets.length > 0 &&
                  facets.map((facet) => (
                    <React.Fragment key={facet.id}>
                      <h4>{FACET_MAPPINGS[facet.id]}</h4>
                      <Filters
                        data={facet.buckets}
                        popOverTitle={`More ${FACET_MAPPINGS[facet.id]}`}
                        checkedValues={selectedFacets}
                        addFilter={(item) => {
                          addFacet(item, facet.id);
                          trackingHandler(`Change ${facet.id} Filter`);
                        }}
                        removeFilter={(item) => {
                          removeFacet(item, facet.id);
                          trackingHandler(`Change ${facet.id} Filter`);
                        }}
                      />
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-8">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-secondary">{totalProducts} Products</p>
                </div>
                <div style={{ marginRight: "30px" }}>
                  <div className="form-group">
                    <input
                      aria-label="Search"
                      id="search-input"
                      type="search"
                      className="form-control"
                      placeholder="Search"
                      onChange={(e) => {
                        e.target.value &&
                          trackingHandler("Search Filter", {
                            query: e.target.value,
                          });
                        setSearchQuery(e.target.value);
                        handleSearchQuery(e.target.value);
                      }}
                      value={searchQuery}
                    />
                  </div>
                </div>
              </div>
              <div
                className="d-flex flex-row"
                style={{ alignItems: "baseline" }}
              >
                {selectedFacets &&
                  selectedFacets.length > 0 &&
                  selectedFacets.map((facet, index) => (
                    <div
                      className="product-filter-tag align-middle"
                      key={`facet-${index}`}
                    >
                      {facet.displayName}{" "}
                      <img
                        src="/images/icon/close.svg"
                        onClick={(e) => {
                          removeFacet(facet);
                        }}
                        alt="close"
                      />
                    </div>
                  ))}

                {selectedFacets && selectedFacets.length > 0 && (
                  <p className="links ml-1" onClick={(e) => resetFacets(e)}>
                    Clear All Filters
                  </p>
                )}
              </div>
              {!loading && <ProductsList products={products} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
