import React from "react";
import Masonry from "react-masonry-component";
import ProductCard from "./product-card";
import { withTracking } from "../../common/contexts/tracking";

const ProductsList = ({ products = [], tracking }) => {
  const onViewDetails = (selectedProduct) => {
    selectedProduct &&
      tracking &&
      tracking.track("View Product", {
        productid: selectedProduct.id,
        productname: selectedProduct.displayName,
      });
  };
  if (products && products.length === 0) {
    return (
      <div>
        <h1>No products found!</h1>
      </div>
    );
  }

  return (
    <>
      <Masonry
        className="product-card product-list"
        options={{ transitionDuration: 100 }}
      >
        {products &&
          products.map((edge) => (
            <ProductCard
              product={edge}
              key={edge.id}
              onViewDetails={onViewDetails}
            />
          ))}
      </Masonry>
    </>
  );
};

export default withTracking(ProductsList);
