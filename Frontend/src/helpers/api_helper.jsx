import axios from "axios";
// import { api } from "../config";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

const token = JSON.parse(sessionStorage.getItem("authUser"))
  ? JSON.parse(sessionStorage.getItem("authUser")).token
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

axios.interceptors.response.use(
    function (response) {
      return response.data ? response.data : response;
    },
    function (error) {
      const status = error.response?.status; // Backend status code
      const data = error.response?.data;    // Backend response data
      let message;

      // Use backend-provided message if available; otherwise, fallback to default
      switch (status) {
        case 500:
          message = data?.message || "Internal Server Error";
          break;
        case 401:
          message = data?.message || "Invalid credentials";
          window.location.href = "/login";
          break;
        case 404:
          message = data?.message || "Sorry! the data you are looking for could not be found";
          break;
        case 403:
          message = data?.message || "Sorry! the data you are looking for could not be found";
          break;
        default:
          message = data?.message || error.message || "An error occurred";
      }

      // Reject structured error object
      return Promise.reject({ status, message, data });
    }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  get = async (url, params) => {
    // url = process.env.VITE_API_URL + url;
    let response;

    let paramKeys = [];
    let headers = {};
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = await axios.get(`${url}?${queryString}`, headers);
    } else {
      response = await axios.get(`${url}`, headers);
    }

    return response;
  };
  create = (url, data) => {
    // url = process.env.REACT_APP_API_URL + url;
    return axios.post(url, data);
  };

  post = (url, data) => {
    // url = process.env.REACT_APP_API_URL + url;
    return axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
  };

  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    // url = process.env.REACT_APP_API_URL + url;
    return axios.put(url, data);
  };
  delete = (url, config) => {
    // url = process.env.REACT_APP_API_URL + url;
    return axios.delete(url, { ...config });
  };


  uploadFile = async (url, file, parentId, onProgress) => {
    // url = process.env.REACT_APP_API_URL + url;

    const formData = new FormData();
    formData.append('files', file);
    formData.append('folderId', parentId);

    const config = {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        }
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Don't transform the response for file uploads
      transformResponse: [(data) => data],
    };

    return axios.post(url, formData, config);
  };

  downloadFile = async (url, fileName, onProgress) => {
    // url = process.env.REACT_APP_API_URL + url;

    const config = {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        }
      },
      // Don't transform the response for file downloads
      transformResponse: [(data) => data],
    };

    const response = await axios.get(url, config);

    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
