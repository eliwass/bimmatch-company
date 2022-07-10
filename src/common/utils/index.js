export const LoadScript = (url, async = true, defer = false) => {
  return new Promise((resolve, reject) => {
    const scripts = document.getElementsByTagName("script");
    const isAlreadyLoaded =
      scripts &&
      Array.from(scripts).find((item) => {
        return item.src === url;
      });
    if (isAlreadyLoaded) {
      resolve(true);
      return;
    }
    const newScript = document.createElement("script");
    newScript.setAttribute("type", "text/javascript");
    newScript.setAttribute("src", url);
    newScript.async = async;
    newScript.defer = defer;
    newScript.onload = (obj) => {
      resolve(true);
    };
    newScript.onerror = (oError) => {
      reject();
      throw new URIError(
        "The script " + oError.target.src + " didn't load correctly."
      );
    };
    document.head.appendChild(newScript);
  });
};

export const LoadStyle = (url) => {
  return new Promise((resolve, reject) => {
    var styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.type = "text/css";
    styles.media = "screen";
    styles.href = url;
    document.head.appendChild(styles);
    resolve(true);
  });
};
