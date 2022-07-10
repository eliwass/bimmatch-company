import axios from "axios";
import * as Sentry from "@sentry/browser";

const API_URL = `${process.env.REACT_APP_APIS_URL}/apis`;

const instance = axios.create({
  baseURL: API_URL,
  timeout: 3600000,
});

instance.interceptors.request.use(
  (config) => {
    const token = window.sessionStorage.getItem("__bauhub_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    Sentry.captureException(error);
    // Do something with request error
    return Promise.reject(error);
  }
);

export const getAutodeskToken = async () => {
  return instance.get("/bim/token");
};

export const uploadFile = async ({ data }, { onUploadProgress, headers }) => {
  const res = await instance.post("/bim/upload-file", data, {
    onUploadProgress,
    headers,
  });
  return res;
};

export const createProject = async (
  { data },
  { onUploadProgress, headers }
) => {
  const res = await instance.post("/bim/create-project", data, {
    onUploadProgress,
    headers,
  });
  return res;
};

export const getProjectManifest = async ({ urn }) => {
  const result = await instance.get(`/bim/get/manifest/${urn}`);
  return result;
};

export const getDownloadUrl = (key) => {
  return `${API_URL}/custom/product/download?key=${key}`;
};

export const download = (key, extension) => {
  let name = key && key.split("/");
  name = name[name.length - 1];
  instance
    .request({
      url: `${API_URL}/custom/product/download?link=${key}&as=${extension}`,
      method: "GET",
      responseType: "blob",
    })
    .then(({ data }) => {
      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${name}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((err) => {
      Sentry.captureException(err);
    });
};
