import deepmerge from "deepmerge";

var memoCatalogCDNURL = {};

export const getCatalogCDNURL = (url, appender) => {
  if (memoCatalogCDNURL[appender]) {
    return memoCatalogCDNURL[appender];
  }

  const cdn = process.env.REACT_APP_AWS_CATALOG_CDN_DOMAIN;
  let newurl = url;
  if (cdn && appender) {
    newurl = `//${cdn}/${appender}`;
  } else if (cdn && url) {
    const newUrl = new URL(url);
    newUrl.hostname = cdn;
    newurl = url.href;
  }

  memoCatalogCDNURL[appender] = newurl;

  return newurl;
};

export const getBimmatchCDNURL = (url, appender) => {
  const cdn = process.env.REACT_APP_AWS_BIMMATCH_CDN_DOMAIN;
  if (cdn && appender) {
    return `//${cdn}/${appender}`;
  } else if (cdn && url) {
    const newUrl = new URL(url);
    newUrl.hostname = cdn;
    return url.href;
  }
  return url;
};

export const getCurrencyForCode = (code) => {
  switch (code) {
    case "NIS":
      return "₪";
    case "EURO":
      return "€";
    case "USD":
    default:
      return "$";
  }
};

export const deepmergeWithArray = (object1, object2) => {
  return deepmerge(object1, object2, {
    arrayMerge: (dest, src) => {
      return [...dest, ...src];
    },
  });
};
