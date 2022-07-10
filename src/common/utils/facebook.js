import { LoadScript } from "./index";

if (process.env.REACT_APP_FACEBOOK_APP_ID) {
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: "v7.0",
    });
  };
  LoadScript("https://connect.facebook.net/en_US/sdk.js", true, true);
}
