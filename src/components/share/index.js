import React, { useState } from "react";
import { ReactComponent as ShareIcon } from "../../images/icon/share_share.svg";
import { ReactComponent as PinterestIcon } from "../../images/icon/pinterest.svg";
// import { ReactComponent as HouzzIcon } from "../../images/icon/houzz.svg";
import { ReactComponent as FacebookIcon } from "../../images/icon/facebook_share.svg";
import { ReactComponent as LinkedinIcon } from "../../images/icon/linkedin_share.svg";
import { ReactComponent as MailIcon } from "../../images/icon/mail_share.svg";

const facebookShare = (url, callback = (response) => {}) => {
  console.log(url);
  window.FB.ui({ method: "share", href: url }, callback);
};

const Share = ({ image, product }) => {
  const [isShareVisible, setShareVisible] = useState(false);
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
  const pinterestShare = `https://www.pinterest.com/pin/create/button/?url=${window.location.href}`;
  const mailShare = `mailto:?subject=${product} on Bimmatch&body=Take a look at this awesome product
  ${product} on Bimmatch:<br/><br/>${window.location.href}`;

  const handleShare = () => {
    setShareVisible(!isShareVisible);
  };

  const shareContents = (e, type) => {
    switch (type) {
      case "pintrest":
        return;
      // case "houzz":
      //   return;
      case "facebook":
        facebookShare(window.location.href);
        return;
      case "linkedin":
        return;
      case "mail":
        return;
      default:
        return;
    }
  };

  return (
    <div className="dropdown share-dropdown">
      <button className="dropbtn share_button" onClick={() => handleShare()}>
        <ShareIcon /> Share
      </button>
      <div
        className="dropdown-content share_drop_content"
        style={{ display: isShareVisible ? "flex" : "none" }}
      >
        {/* <a role="button" onClick={(e) => shareContents(e, "pintrest")}>
          <PinterestIcon />
        </a>
        <a role="button" onClick={(e) => shareContents(e, "houzz")}>
          <HouzzIcon />
        </a>
        <a role="button" onClick={(e) => shareContents(e, "facebook")}>
          <FacebookIcon />
        </a>
        <a role="button" onClick={(e) => shareContents(e, "linkedin")}>
          <LinkedinIcon />
        </a>
        <a role="button" onClick={(e) => shareContents(e, "mail")}>
          <MailIcon />
        </a> */}
        <a
          href={pinterestShare}
          data-pin-do="buttonBookmark"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PinterestIcon />
        </a>
        {/* <button className="btn btn-link" onClick={(e) => shareContents(e, "houzz")}>
          <HouzzIcon />
        </button> */}
        <button
          className="btn btn-link"
          onClick={(e) => shareContents(e, "facebook")}
        >
          <FacebookIcon />
        </button>
        <a
          className="btn btn-link"
          href={linkedinShare}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedinIcon />
        </a>
        <a className="btn btn-link" href={mailShare}>
          <MailIcon />
        </a>
      </div>
    </div>
  );
};

export default Share;
