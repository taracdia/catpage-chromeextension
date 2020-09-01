import axios from 'axios';

axios.defaults.headers.common["x-api-key"] = "72846d44-a455-4a39-a417-d75ce37cde65";

export default axios.create({
    baseURL: "https://api.thecatapi.com/v1/"
  });