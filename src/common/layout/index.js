import React, { useState } from "react";
import Header from "./Header";
import EmailVerification from "./EmailVerification";

export const Layout = ({ children, headerClassName = "white-header" }) => {
  const [isLeftMenuOpen, setLeftMenuOpen] = useState(false);

  const handleLeftMenuOpen = (bool) => {
    setLeftMenuOpen(bool);
  };

  return (
    <div
      className={`pushmenu-push wrapper ${
        isLeftMenuOpen ? "pushmenu-push-toright" : ""
      }`}
    >
      <EmailVerification />
      <Header
        className={headerClassName}
        isLeftMenuOpen={isLeftMenuOpen}
        handleLeftMenuOpenCallback={handleLeftMenuOpen}
      />
      {children}
    </div>
  );
};

const withLayout = (Component) => (props) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};

export default withLayout;
