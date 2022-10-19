



## 


### 1、Axios 常规格式封装
> - 默认格式 "application/json;charset=utf-8"；
> - 不同类型参数主要针对 post 接口；

#### 1.1 常规封装 https.js 代码
```javascript
import axios from "axios";
import { Message, Loading } from "element-ui";
import { BASE_URL } from "./index";
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 20000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
const http = axios.create();

const post = http.post;
http.post = (url, params, options = {}, config) => {
  return post(
    url, 
    params, 
    config
  ).then((data = {}) => {
    return Promise.resolve(data.data ? data.data.data : false);
  });
};

let loading;
// 请求拦截器
http.interceptors.request.use(
  config => {
    let info = window.localStorage.getItem("info");
    if (info) {
      config.headers.token = `${JSON.parse(info).token}`;
    } 
    // 加载提示
    loading = Loading.service({
      lock: true,
      text: "数据加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.2)"
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    if (response.data.code == 0) {
      // 成功
      loading.close();
      return response;
    } else if (response.data.code == 1004) {
      // token
      loading.close();
      window.localStorage.clear();
      Message.error("登录过期,请重新登录");
      location.href = "/";
    } else {
      if (response.config.responseType == "blob") {
        loading.close();
        return response;
      } else {
        loading.close();
        Message.error(
          response.data.msg ||
            response.data.message ||
            "数据加载失败，请刷新页面重试！"
        );
      }
    }
  },
  error => {
    console.log(error);
    loading.close();
    Message.error("网络异常，请刷新页面重试！");
    return Promise.reject(error);
  }
);

export default http;

```

#### 1.2 常规格式下，文件上传仍然使用 form-data 格式处理
>  http 在man.js 引用，Vue.prototype.$http = http; // axios请求
```javascript
// 上传接口
export const uploadFile = params => {
  let data = new FormData();
  data.append("file", params);
  return http.post("/api/uploadFile", data).then(res => res);
};
```


### 2、form-data 格式封装
> - 设置 "Content-Type"："multipart/form-data";
> - 参数使用 FormDate 处理后的格式
> - 请求拦截设置 "Content-Type"："multipart/form-data";
> - **参数对象只有一层使用方法一。层级复杂，使用方法二（推荐）**

#### 2.1 对 params 参数进行 fromData 处理
```javascript
...
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
...
/**
 * params 比较复杂、多维数组等，进行递归
 */
const getFormData = function(data, formData, pre) {
	if(Object.prototype.toString.call(data) === '[object Object]'){
		const dataKeys = Object.keys(data);
		for(let i=0, r=dataKeys.length; i<r; i++) {
			if(pre === ''){
				getFormData(data[dataKeys[i]], formData, `${dataKeys[i]}`);
			}else{
				getFormData(data[dataKeys[i]], formData, `${pre}[${dataKeys[i]}]`);
			}
		}
	}else if(Object.prototype.toString.call(data) === '[object Array]'){
		for(let j=0,k=data.length; j<k; j++){
			getFormData(data[j], formData, `${pre}[${j}]`);
		}
	}else {
		//console.log(`${pre}---------`, data);
		formData.append(`${pre}`, data);
	}
	return formData;
}

const post = http.post;
http.post = (url, params, options = {}, config) => {
  var formData=new FormData();
  /**
   * formData.append(param1, param2);
   * param1: key,
   * param2: value,
   * return: formData 实例
   * formData.append('code',params.code); 
   */

  /**
   * 方法一：
   * params 如果只有一个层级可以
   * 使用reduce累积求值。获取最终的 formData
   */ 
  if(params){
  	formData = Object.keys(params).reduce((arr, item, index)=> {
	    arr.append(item, params[item]);
	    return arr;
	}, formData)
  }
  
  /**
   * 方法二：
   * params 有多个层级
   * 使用递归方式获取 formData 
   */ 
  if(params){
	formData = getFormData(params, formData, '');
  }

  return post(
    url, 
    resData,
    config
  ).then((data = {}) => {
    return Promise.resolve(data.data ? data.data.data : false);
  });
};

let loading;
// 请求拦截器
http.interceptors.request.use(
  config => {
    ...

    /**
     * 防止 axios.defaults.headers.post["Content-Type"] = "multipart/form-data"; 不生效，
     * 需要在请求拦截中再设置
    */
    config.headers["Content-Type"] = "multipart/form-data";

    ...
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;

```

####  2.2 模拟 params 对象，调试 getFormData 函数
```javascript
const formObj = {
	formNameA: 'formNameA',
	formNameB: {
		formNameC: 'chchFormNameA',
		formNameD: 'chchFormNameB',
	},
	formNameE: [1,2,3],
	formNameF: [{
		formNameG: 'chFormNameB',
		formNameH: [{
			formNameI: 'chchFormNameA',
			formNameJ: 'chchFormNameB',
		},{
			formNameR: 'chchFormNameA',
			formNameS: 'chchFormNameB',
		}],
		formNameK: [4,5,6]
	},{
		formNameL: 'chFormNameB',
		formNameM: [{
			formNameN: 'chchFormNameA',
			formNameO: 'chchFormNameB',
		},{
		}],
		formNameP: [4,5,6]
	}],
} 

// getFormData 调试代码放开可调试
console.log(`${pre}---------`, data);
// formData.append(`${pre}`, data);


getFormData(formObj, '', '');
```
#### 2.3 getFormData 函数最终返回的效果 
![在这里插入图片描述](https://img-blog.csdnimg.cn/ea71494fe3da4069b372244a7f10f6d3.png#pic_left)



### 3 application/x-www-form-urlencoded 格式封装
> - npm 引用 qs: npm install qs;
> - 设置 "Content-Type"："application/x-www-form-urlencoded";
> - 参数使用 qs 工具转换
> - 请求拦截设置 "Content-Type"："application/x-www-form-urlencoded";

#### 3.1 对参数的 stringify 处理
```javascript
import qs from "qs";
...
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
....

const post = http.post;
http.post = (url, params, options = {}, config) => {
  return post(
    url, 
    // 使用 qs 转换参数
    qs.stringify({...params}),
    config
  ).then((data = {}) => {
    return Promise.resolve(data.data ? data.data.data : false);
  });
};

let loading;
// 请求拦截器
http.interceptors.request.use(
  config => {
    ...

    /**
     * 防止 axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; 不生效，
     * 需要在请求拦截中再设置
    */
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";

    ...
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;

```

