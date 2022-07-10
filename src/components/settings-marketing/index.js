import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";

const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: SettingsInput!) {
    updateSettings(input: $input) {
      marketing {
        bimmatch
        products
      }
    }
  }
`;

const MarketingSettings = ({ marketing }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: marketing,
  });

  const [updateSettings] = useMutation(UPDATE_SETTINGS);

  const handleMarketingSettings = async (marketing) => {
    await updateSettings({
      variables: {
        input: {
          marketing,
        },
      },
    });
  };

  return (
    <div className="marketing-settings-container">
      <div className="top-message">
        We want to offer you products, events and news that match your projects
        and your designs. Approve your consent:
      </div>
      <form onSubmit={handleSubmit(handleMarketingSettings)}>
        <div className="form-group flex">
          <input
            type="checkbox"
            name="bimmatch"
            className="custom-checkbox"
            ref={register}
          />
          <p>
            I agree to receive marketing communication froms Bimmatter (Bimmatch
            platform)
          </p>
        </div>
        <div className="form-group flex">
          <input
            type="checkbox"
            name="products"
            className="custom-checkbox"
            ref={register}
          />
          <p>
            I agree to receive marketing communication froms distributors of
            products featured on the platform
          </p>
        </div>
        <div className="form-group submit">
          <button type="submit" className="blue-bg-button colorBotton">
            SAVE
          </button>
        </div>
      </form>
      <div className="notice">
        {"Read our "}
        <a
          href="/policy/terms-and-conditions.html"
          alt="Terms and Conditions"
          target="_blank"
        >
          Terms of Use
        </a>
        {" and "}
        <a
          href="/policy/terms-and-conditions.html"
          alt="Privacy Policy"
          target="_blank"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default MarketingSettings;
