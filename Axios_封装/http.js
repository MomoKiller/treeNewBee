import axios from "axios";
import context from "@/main.js";
import { BASE_URL } from "./common";
import { Message, MessageBox } from "element-ui";
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 超时
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

// // 改写axios.get
const get = http.get;
http.get = (url, params, options = {}, config) => {
  return get(url, {
    ...config,
    params
  }).then((data = {}) => {
    return Promise.resolve(data);
  });
};

// 改写axios.post
const post = http.post;
http.post = (url, data, options = {}, config) => {
  return post(url, data, config).then((data = {}) => {
    return Promise.resolve(data);
  });
};

// http request 拦截器
http.interceptors.request.use(
  config => {
    if (localStorage.ba_token) {
      //判断token是否存在
      config.headers.token = localStorage.ba_token; //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
http.interceptors.response.use(
  response => {
    if (response.data.code == 1004) {
      localStorage.clear();
      location.reload();
      Message.error("token过期");
    }
    if (response.data.code == 1001 || response.data.code == 1101) {
      Message.error(response.data.message);
    }
    if (response.status == 500) {
      Message.error("服务器错误");
    }

    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
