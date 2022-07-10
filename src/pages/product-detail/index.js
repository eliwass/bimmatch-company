import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../common/layout";
const ProductDetails = React.lazy(() => import("../../components/product"));

const Product = () => {
  let { id } = useParams();

  return (
    <Layout>
      <React.Suspense fallback={<div></div>}>
        {id && (
          <React.Suspense fallback={<div></div>}>
            <div className="product-view">
              <ProductDetails product={{ id }} />
            </div>
          </React.Suspense>
        )}
      </React.Suspense>
    </Layout>
  );
};

export default Product;
