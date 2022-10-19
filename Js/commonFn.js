const host = window.location.host
const urlCondition = host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1 || host.indexOf('192.168.1.24') > -1;
// 测试环境
const baseUrl = urlCondition ? 'http://101.132.46.55:55107/trade/' : 'http://' + host + '/trade/';
// 调试本地
// const baseUrl = urlCondition ? 'http://192.168.1.26:8080/trade/' : 'http://' + host + '/';

/* 接口 文档 */
const apis = {
    'validcode': baseUrl + 'client/user/online/get/validcode', // 验证码
    'personalInfo': baseUrl + 'api/v2/crm/openaccount', // 获取用户信息
    'process': baseUrl + 'api/v2/crm/openaccount/edit', // 修改（重新提交）
    'download1': baseUrl + 'api/v2/crm/downloadfile/1', // 图片
    'download2': baseUrl + 'api/v2/crm/downloadfile/2',
    'download3': baseUrl + 'api/v2/crm/downloadfile/3',
    'download4': baseUrl + 'api/v2/crm/downloadfile/4',
    'download5': baseUrl + 'api/v2/crm/downloadfile/5',
    'download6': baseUrl + 'api/v2/crm/downloadfile/6',
    'download7': baseUrl + 'api/v2/crm/downloadfile/7',
    'mainbank': baseUrl + 'bank/area/mainbank', // 获取银行
    'bankPage': baseUrl + 'bank/area/query/bank/page', // 获取分行
    'crmRegister': baseUrl + 'api/v2/crm/openaccount/register', // 注册
    'setToken': baseUrl + 'api/v2/crm/upload/tonken', //读取上传签名tonken
    'upFile': baseUrl + 'api/v2/crm/upload', // 上传签名 
    'loadSign': baseUrl + 'api/v2/crm/download/4/', // 拉取签名 
    'bankInfoEdit': baseUrl + 'api/v2/crm/bankaccount', // 修改银行卡信息 
}

/* 获取浏览器参数 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var result, n;
    if (location.search != '') { // history 模式获取参数
        result = window.location.search.substr(1).match(reg);
    } else { // hash 模式获取参数
        n = location.hash.indexOf('params');
        result = location.hash.substr(n).replace('#/', '').match(reg);
    }
    return result ? decodeURIComponent(result[2]) : null;
}

/* TOKEN 前缀 */
const Authorization = 'Bearer ';
/* 获取URlTOKEN */
function getURLtoken() {
    let res = '',
        params = '';
    try {
        params = JSON.parse(getUrlParam('params'));
    } catch (e) {
        return params = 'Bearer ' + getUrlParam('params');
    }
    if (params && params['token'] != undefined && params['token'] != '' && params['token'] != null) {
        res = (params['token'].indexOf('Bearer') > -1) ? params['token'] : (Authorization + params['token']);
    } else {
        res = '';
    }
    return res;
}

/* 国家代码 */
const countryList = [{
    "value": "86",
    "en": "China-Mainland",
    "name": "中国-大陆"
}, {
    "value": "852",
    "en": "China-HongKong",
    "name": "中国-香港"
}, {
    "value": "853",
    "en": "China-Macao",
    "name": "中国-澳门"
}, {
    "value": "886",
    "en": "China-Taiwan",
    "name": "中国-台湾"
}, {
    "value": "63",
    "en": "Philippines",
    "name": "菲律宾"
}, {
    "value": "1",
    "en": "United States",
    "name": "美国"
}, {
    "value": "41",
    "en": "Switzerland",
    "name": "瑞士"
}, {
    "value": "65",
    "en": "Singapore",
    "name": "新加坡"
}, {
    "value": "44",
    "en": "United Kingdom",
    "name": "英国"
}];

/* 证件类型 */
const papersList = [
    { "value": "44", "en": "ID card", "name": "身份证" },
    // { "value": "48", "en": "Hong Kong and Macao pass", "name": "港澳通行证" },
    { "value": "3", "en": "Passport", "name": "护照" },
    { "value": "58", "en": "Others", "name": "其他证件" }
];

/* 工作性质 */
const natureList = [
    { value: 1, name: "受雇" },
    { value: 2, name: "自雇" },
    { value: 3, name: "退休" },
    { value: 4, name: "自由职业者" }
];
/* 行业 */
const industryList = [
    { value: 1, name: "金融服务", en: "Financial service" },
    { value: 2, name: "商品贸易", en: "Commodity trading" },
    { value: 3, name: "房地产", en: "Real estate" },
    { value: 4, name: "文化娱乐", en: "Culture and entertainment" },
    { value: 5, name: "物流运输", en: "Logistics transportation" },
    { value: 6, name: "信息科技", en: "Information technology" },
    { value: 7, name: "旅游餐饮", en: "Tourist catering" },
    { value: 8, name: "制造业", en: "Manufacturing industry" },
    { value: 9, name: "其他行业", en: "Others" }
];
/* 职位 */
const positionList = [
    { value: 1, name: "董事长/CEO", en: "CEO" },
    { value: 2, name: "总经理", en: "General Manager" },
    { value: 3, name: "部门经理", en: "Department Manager" },
    { value: 4, name: "员工", en: "Staff" }
];

/* 货币类型 */
const currencyList = [
    { name: '美元', en: 'USD', value: 'USD' },
    { name: '欧元', en: 'EUR', value: 'EUR' },
    { name: '人民币', en: 'CNY', value: 'CNY' },
    { name: '港元', en: 'HKD', value: 'HKD' }
];

/* 用户状态 */
const accountStatus = {
    regist_finash: '0', // 0注册未走完
    regist_normal: '1', // 1正常注册
    regist_audit: '2', // 2待审核
    regist_reject: '3', // 3驳回
    regist_forbid: '9', // 9禁止开户
    regist_outTime: '700003', // 登录超时
    regist_err: '700005', // 注册失败
};

/* 设置全局变量 */
let previousRequest = null;
let isResult = false;
let reqTimer = null; // 请求timeout
let reqNum = 0; // 请求次数

/* 弹框组件 */
import Toast from '@/assets/js/toast.js';

export default {
    baseUrl: baseUrl,
    // 接口信息
    apis: apis,
    // 国家代码
    countryList: countryList,
    // 证件类型
    papersList: papersList,
    // 行业
    industryList: industryList,
    // 职位
    positionList: positionList,
    // 货币类型
    currencyList: currencyList,
    // 用户状态
    accountStatus: accountStatus,
    // GET 接口获取数据;
    getData: function(that, url, d, call) {
        // let previousRequest = null;
        isResult = false;
        let p = {
            emulateJSON: false,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': (JSON.stringify(d) != '{}' && d.token) ? d.token : ''
            },
            before(request) {
                previousRequest = request;
            }
        };
        that.$http.get(url, p)
            .then(res => {
                isResult = true;
                call(res.body);
            }).catch(error => {
                console.log(error);
            });
        reqNum++;
        reqTimer = setTimeout(() => {
            if (!isResult) {
                if (reqNum > 5) {
                    reqNum = 0; // 重置
                    Toast.$emit('toastMsg', '请检查网络环境-Please check the network environment');
                    return;
                }
                clearTimeout(reqTimer); // 多次点击迭代timer 清除
                reqTimer = null;
                previousRequest.abort();
                that.com.getData(that, url, d, call);
            } else {
                reqNum = 0; // 重置
            }
        }, 5000);
    },
    // JSONP-GET 接口获取数据;
    jsonpData: function(that, url, d, call) {
        // let previousRequest = null;
        isResult = false;
        d = {
            emulateJSON: false,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                // 'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        };
        that.$http.jsonp(url, { params: d })
            .then(res => {
                isResult = true;
                call(res.body);
            }).catch(error => {
                console.log(error);
            });
        reqNum++;
        reqTimer = setTimeout(() => {
            if (!isResult) {
                if (reqNum > 5) {
                    reqNum = 0; // 重置
                    Toast.$emit('toastMsg', '请检查网络环境-Please check the network environment');
                    return;
                }
                clearTimeout(reqTimer); // 多次点击迭代timer 清除
                reqTimer = null;
                previousRequest.abort();
                that.com.jsonpData(that, url, d, call);
            } else {
                reqNum = 0; // 重置
            }
        }, 5000);
    },
    // POST 接口提交数据; 参数保留原有格式
    postData: function(that, url, d, call) {
        // let previousRequest = null;
        isResult = false;
        let urlToken = getURLtoken();
        that.$http.post(url, d, {
            emulateJSON: false,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        }).then(res => {
            isResult = true;
            if (!res.body) {
                call(res.bodyText);
            } else {
                call(res.body);
            }
        }).catch(error => {
            console.log(error);
        });
        reqNum++;
        reqTimer = setTimeout(() => {
            if (!isResult) {
                if (reqNum > 5) {
                    reqNum = 0; // 重置
                    Toast.$emit('toastMsg', '请检查网络环境-Please check the network environment');
                    return;
                }
                clearTimeout(reqTimer); // 多次点击迭代timer 清除
                reqTimer = null;
                previousRequest.abort(); // 阻止上一次请求的继续等待
                that.com.postData(that, url, d, call);
            } else {
                reqNum = 0; // 重置
            }
        }, 5000);
    },
    // post 接口提交; 参数 stringify
    postStringfy: function(that, url, d, call) {
        // let previousRequest = null;
        isResult = false;
        that.$http.post(url, JSON.stringify(d), {
            emulateJSON: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        }).then(res => {
            isResult = true;
            call(res.body);
        }).catch(error => {
            console.log(error);
        });
        reqNum++;
        reqTimer = setTimeout(() => {
            if (!isResult) {
                if (reqNum > 5) {
                    reqNum = 0; // 重置
                    Toast.$emit('toastMsg', '请检查网络环境-Please check the network environment');
                    return;
                }
                clearTimeout(reqTimer); // 多次点击迭代timer 清除
                reqTimer = null;
                previousRequest.abort();
                that.com.postStringfy(that, url, d, call);
            } else {
                reqNum = 0; // 重置
            }
        }, 5000);
    },
    // POST 接口提交数据; 参数转formData
    postForm: function(that, url, d, call) {
        // let previousRequest = null;
        isResult = false;
        const resd = new FormData();
        Object.keys(d).forEach((key) => {
            resd.append(key, d[key]);
        });
        that.$http.post(url, resd, {
            emulateJSON: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        }).then(res => {
            isResult = true;
            call(res.body);
        }).catch(error => {
            console.log(error);
        });
        reqNum++;
        reqTimer = setTimeout(() => {
            if (!isResult) {
                if (reqNum > 5) {
                    reqNum = 0; // 重置
                    Toast.$emit('toastMsg', '请检查网络环境-Please check the network environment');
                    return;
                }
                clearTimeout(reqTimer); // 多次点击迭代timer 清除
                reqTimer = null;
                previousRequest.abort();
                that.com.postForm(that, url, d, call);
            } else {
                reqNum = 0; // 重置
            }
        }, 5000);
    },
    // 获取浏览器参数
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var result, n;
        if (location.search != '') { // history 模式获取参数
            result = window.location.search.substr(1).match(reg);
        } else { // hash 模式获取参数
            n = location.hash.indexOf('params');
            result = location.hash.substr(n).replace('#/', '').match(reg);
        }
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 手机设备验证
    isMobile: function() {
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        return flag;
    },
}