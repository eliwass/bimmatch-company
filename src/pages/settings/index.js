import React from "react";
import { useQuery, gql } from "@apollo/client";
import WithLayout from "../../common/layout";
import { useAuth } from "../../common/contexts/auth";
import MarketingSettings from "../../components/settings-marketing";

const GET_SETTINGS = gql`
  query GetSettings {
    getSettings {
      marketing {
        bimmatch
        products
      }
    }
  }
`;

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const { data } = useQuery(GET_SETTINGS, {
    variables: {},
  });

  if (!isAuthenticated) return null;

  const { marketing = {} } = (data && data.getSettings) || {};

  return (
    <div className="settings">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 d-none d-xl-block d-lg-block d-md-block">
            <h1>Settings</h1>
          </div>
        </div>
        <div className="settings-menu-container">
          <ul className="nav">
            <li className="nav-link active">Marketing Communications</li>
          </ul>
        </div>
        <div className="settings-contents-container">
          <MarketingSettings marketing={marketing} />
        </div>
      </div>
    </div>
  );
};

export default WithLayout(Settings);
