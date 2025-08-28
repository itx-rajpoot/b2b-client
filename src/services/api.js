import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

const basicError = {
  message: "Oops! Something happened. Please try again..."
}

export function apiCall(method, path, data, config){
  return new Promise((resolve, reject)=>{
    return axios[method.toLowerCase()](`${API_URL}${path}`, data, config)
    .then(res => {
      return resolve(res.data);
    })
    .catch(err => {
      if (err.response) {
        console.warn('api.js | client received an error response (5xx, 4xx)');
      } else if (err.request) {
        console.warn('api.js | client never received a response, or request never left');
      }
      if(err.response){
        return reject(err.response.data.error || basicError);
      } else {
        return reject(err || basicError);
      }
    });
  });
}
