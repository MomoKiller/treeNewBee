const host = window.location.host
const urlCondition = host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1;
const baseUrl = urlCondition ? 'http://47.56.130.50:33807/trade/' : 'http://' + host + '/trade/'
// 配置文件
const configUrl = urlCondition ? 'http://47.56.130.50:33807/traderClient/config/' : 'http://' + host +'/traderClient/config/'

// 接口
const apis = {
    // login 
    'login': baseUrl + 'login',  // 登录
    // register
    'validcode': baseUrl + 'client/user/online/get/validcode',          // 验证码
    'register': baseUrl + 'client/user/online/register/user',           // 注册用户
    // disclaimer
    'disclaimer': baseUrl + 'api/v1/crm/params',                        // 确认免责声明
    // openAccount
    'personalInfo': baseUrl + 'api/v1/crm/personalInfo',                // 获取用户信息
    'process': baseUrl + 'api/v1/crm/start/process',                    // 
    'openaccount': baseUrl + 'api/v1/crm/openaccount',                  // 开户信息
    'download1': baseUrl + 'api/v1/crm/download/file/1',                // 图片 1|2|3|5
    'download2': baseUrl + 'api/v1/crm/download/file/2',                
    'download3': baseUrl + 'api/v1/crm/download/file/3',                
    'download5': baseUrl + 'api/v1/crm/download/file/5',                
    'mainbank': baseUrl + 'bank/area/mainbank',                         // 获取银行
    'bankPage': baseUrl + 'bank/area/query/bank/page',                  // 获取分行
    'crmUpload': baseUrl + "api/v1/crm/upload",                         // 上传图片
    // index
    'crmRegister': baseUrl + 'api/v1/crm/register',                     // 注册
    'config': configUrl                                               // 配置文件
}

// 浏览器参数
function getUrlParam(name) {	  
    var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
    var result, n;
    if(location.search != ''){  // history 模式获取参数
        result = window.location.search.substr(1).match(reg);
    }else{                      // hash 模式获取参数
        n = location.hash.indexOf('params');
        result = location.hash.substr(n).replace('#/', '').match(reg);
    }
    return result?decodeURIComponent(result[2]):null;
}
// TOKEN 前缀
const Authorization = 'Bearer ';
// 返回 URlTOKEN
function getURLtoken(){
    let res = '';
    let params = JSON.parse(getUrlParam('params'));
    if(params && params['token'] != undefined && params['token'] !='' && params['token'] != null){
        res = (params['token'].indexOf('Bearer') > -1) ? params['token'] : (Authorization + params['token']);
    }else{
        res = '';
    }
    return res;
}
let urlToken = getURLtoken();

export default{
    // 用户状态
    accountStatus: {
        regist_finash: '0',     // 0注册未走完
        regist_normal: '1',     // 1正常注册
        regist_audit: '2',      // 2待审核
        regist_reject: '3',     // 3驳回
        regist_forbid: '9',     // 9禁止开户
        regist_outTime: '700003',   // 登录超时
    },
    // 获取完整 api 接口
    getApi: function (key) {
        let apiUrl = apis[key];
        return apiUrl;
    },
    // 获取 baseUrl
    getUrl: function(){
        return baseUrl;
    },
    // GET 接口获取数据;
    getData: function (that, url, d, call) {
        urlToken = urlToken ? urlToken : getURLtoken();
        let previousRequest = null;
        let isResult = false;
        d={
            emulateJSON: false, 
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        };
        that.$http.get(url, d)
            .then(res => {
                isResult = true; 
                call(res.body);
                if(res.body.code == that.com.accountStatus.regist_outTime){  // 登录过期
                    sessionStorage.setItem('gtStatus', that.com.accountStatus.regist_outTime);
                }
            }).catch(error => {
                console.log(error);
            });
        setTimeout(()=>{
            if(!isResult){
                previousRequest.abort();
                that.com.getData(that, url, d, call);
            }
        }, 5000);
    },
    // JSONP-GET 接口获取数据;
    jsonpData: function(that, url, d, call){
        urlToken = urlToken ? urlToken : getURLtoken();
        let previousRequest = null;
        let isResult = false;
        d={
            emulateJSON: false, 
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        };
        that.$http.jsonp(url, { params: d })
            .then(res => {
                isResult = true; 
                call(res.body);
                if(res.body.code == that.com.accountStatus.regist_outTime){  // 登录过期
                    sessionStorage.setItem('gtStatus', that.com.accountStatus.regist_outTime);
                }
            }).catch(error => {
                console.log(error);
            });
        setTimeout(()=>{
            if(!isResult){
                previousRequest.abort();
                that.com.jsonpData(that, url, d, call);
            }
        }, 5000);
    },
    // POST 接口提交数据; 参数保留原有格式
    postData: function(that, url, d, call) {
        urlToken = urlToken ? urlToken : getURLtoken();
        let previousRequest = null;
        let isResult = false;
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
            call(res.body);
            if(res.body.code == that.com.accountStatus.regist_outTime){  // 登录过期
                sessionStorage.setItem('gtStatus', that.com.accountStatus.regist_outTime);
            }
        }).catch(error => {
            console.log(error);
        });
        setTimeout(()=>{
            if(!isResult){
                previousRequest.abort();
                that.com.postData(that, url, d, call);
            }
        }, 5000);
    },
    // post 接口提交; 参数 stringify
    postStringfy: function(that, url, d, call){
        urlToken = urlToken ? urlToken : getURLtoken();
        let previousRequest = null;
        let isResult = false;
        that.$http.post(url, JSON.stringify(d), { 
            emulateJSON: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        }).then(res =>{
            isResult = true; 
            call(res.body);
            if(res.body.code == that.com.accountStatus.regist_outTime){  // 登录过期
                sessionStorage.setItem('gtStatus', that.com.accountStatus.regist_outTime);
            }
        }).catch(error => {
            console.log(error);
        });
        setTimeout(()=>{
            if(!isResult){
                previousRequest.abort();
                that.com.postStringfy(that, url, d, call);
            }
        }, 5000);
    },
    // POST 接口提交数据; 参数转formData
    postForm: function(that, url, d, call){
        urlToken = urlToken ? urlToken : getURLtoken();
        let previousRequest = null;
        let isResult = false;
        const resd = new FormData();
        Object.keys(d).forEach((key) => {
            resd.append(key, d[key]);
        }); 
        that.$http.post(url, resd, { 
            emulateJSON: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': urlToken
            },
            before(request) {
                previousRequest = request;
            }
        }).then(res =>{
            isResult = true; 
            call(res.body);
            if(res.body.code == that.com.accountStatus.regist_outTime){  // 登录过期
                sessionStorage.setItem('gtStatus', that.com.accountStatus.regist_outTime);
            }
        }).catch(error => {
            console.log(error);
        });
        setTimeout(()=>{
            if(!isResult){
                previousRequest.abort();
                that.com.postForm(that, url, d, call);
            }
        }, 5000);
    },
    // 获取浏览器参数
    getUrlParam: function(name) {	  
        var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
        var result, n;
        if(location.search != ''){  // history 模式获取参数
            result = window.location.search.substr(1).match(reg);
        }else{                      // hash 模式获取参数
            n = location.hash.indexOf('params');
            result = location.hash.substr(n).replace('#/', '').match(reg);
        }
        return result?decodeURIComponent(result[2]):null;
    },
    // 手机设备验证
    isMobile: function(){
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        return flag;
    }
}