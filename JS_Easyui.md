


|=========================================================================================================|
|																										  |
|																										  |
|																										  |
|																										  |
|===============================  easyui开发集客项目时总结的一些js开发经验 ===============================|
|																										  |
|																										  |
|																										  |
|																										  |
|=========================================================================================================|





http://www.zi-han.net/case/easyui/

	
 
//**********CLICK 事件绑定 start**********
1、
	$(document).on("click", "#tableID", function(){
		doSomething();
	});
2、
	$("#tableID").on("click", function(){
		doSomething();
	});
3、
	$("#tableID").click(function(){
		doSomething();
	});
4、
	$("#tableID").live(function(){
		doSomething();
	});
5、绑定事件，但没有立即执行和call，apply的区别
	$("#tableID").bind('click', function(){
		doSomething();
	});
//**********CLICK 事件绑定 end**********	
	
	



//**********ajax经典调用方式 start**********	
网站：(注*  关于ajax中的data参数数据类型转换的一篇博客)   http://www.cnblogs.com/sunxi/p/3849361.html

1、调用ajax的	get 请求
	$.ajax({
		cache: false,
		type: "get",
		url: path+'/rs/report/home/dutyinfo/get',
		async: false,
		error: function(request) {
		},
		success: function(data) {
		}
	});
	
2、调用ajax的 post 请求 
	var params = {
		userName: '',
		phone: ''
	};
	$.ajax({
		cache: false,
		type: "post",
		url: path+'/rs/report/home/dutyinfo/edit',
		contentType: "application/json; charset=utf-8",
		async: false,
		data: JSON.stringify(params),
		error: function(request) {
			doSomething();
		},
		success: function(data) {
			doSomething();
		}
	});	

3、调用ajax直接处理form表单的数据
	$.ajax({
		cache: true,
		type: "POST",
		url:url,
		data: $("#formId").serialize(), // form表单方法
		async: false,
		error: function(request) {
			console.log("失败");
		},
		success: function(data) {
			doSomething();
		}
	});
	
4、调用ajax 用渲染 Table
	$("#deviceTable").dataTable({
		serverSide: true,//分页，取数据等等的都放到服务端去
		processing: false,//载入数据的时候是否显示“载入中”
		pageLength: 10,//首次加载的数据条数
		searching: false,//搜索
		ordering: false,//排序操作在服务端进行，所以可以关了
		ajax: {//类似jquery的ajax参数，基本都可以用。
			type: "get",//后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
			url: url,
			dataSrc: "rows",//默认data，也可以写其他的，格式化table的时候取里面的数据
			data: function (d) {//d 是原始的发送给服务器的数据，默认很长。
				var param = {
					start: d.start,
					length: d.length
				};
				return param;
			}
		},
		columns: [//对应上面thead里面的序列    
			{ data: "sys_name"},
			{ data: "ip_addr"},
			{ data: "device_type","render": function(data, type, full) { 
				if(data=='HOST') return "主机";
				if(data=='SWTICH') return "交换机";
				if(data=='ROUTER') return "路由器";
				else return "暂无";
			   }
			  },
			{ data: "city"},
			{ data: "vendor"},
			{ data: "last_timestamp","render": function(data, type, full) { 
					return data.substring(0,19);
				}
			},
			{ data: "device_id","render": function(data, type, full) { 
				var info='<a href="javascript:openPerconfig(\''+data+'\')"     class="btn btn-info  btn-xs"  title="性能指标配置"> <span class="glyphicon  glyphicon-book" ></span></a>';
				return info;
			}}
		],
		initComplete: function (setting, json) {},
		language: {
			lengthMenu: '<select class="form-control input-xsmall">' + '<option value="5">5</option>' + '<option value="10">10</option>' + '<option value="20">20</option>' + '<option value="30">30</option>' + '<option value="40">40</option>' + '<option value="50">50</option>' + '</select>条记录',//左上角的分页大小显示。
		    // lengthMenu:false,
			processing: "载入中",			//处理页面数据的时候的显示
			paginate: {						//分页的样式文本内容。
				previous: "上一页",
				next: "下一页",
				first: "第一页",
				last: "最后一页"
			},
			zeroRecords: "没有内容",												// table tbody内容为空时，tbody的内容。
			info: '总共_PAGES_ 页，显示第_START_ 到第 _END_ ，共_TOTAL_ 条 ',		// 左下角的信息显示，大写的词为关键字。
			infoEmpty: "共0条记录",													// 筛选为空时左下角的显示。
			infoFiltered: ""														// 筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
		},
		lengthChange: true,
		paging: true
	});
//**********ajax经典调用方式 end**********				




	
//**********checkbox 的值判断 start**********
HTML: 
	<input type="checkbox" title="记住密码" checked="checked" id="isCheck" /><span style="color: #1e90ff">记住密码</span>
JS:
	$("#isCheck").prop("checked");  	//返回值是boolean类型
//**********checkbox 的值判断 end**********






//**********清空form表单  start**********

case1： $('#formId').form('clear');

case2:	$('#formId')[0].reset();

case3:	$('#formId inputId').val("");

//**********清空form表单  end**********




//**********radio 获取值与赋值  start**********

获取选中值
	params.isCenter = $(":radio[name='isCenter'][checked]").val();
	$(":radio[name='isCenter'][value='" + value + "']").prop("checked");
赋值
	$(":radio[name='isCenter'][value='" + value + "']").prop("checked", "checked");
	
//**********radio 获取值与赋值  end**********






//**********HTML data-* 对象值的获取|赋值 start**********

获取：
	1, $(selecter).getDate('param');
	2, $(selecter).attr('data-param');
赋值：
	1, $(selecter).setDate('param', value);
	2, $(selecter).attr('data-param', value);

//**********HTML data-* 对象值的获取|赋值 end**********



//**********JQ 判断元素显示或隐藏 start**********
	1、$('#selector').is(':hidden');
	2、$('#selector').is(':visible');
	3、$('#selector').css('display') == 'none'
//**********JQ 判断元素显示或隐藏 end**********




//**********BASE64 图片 start**********

HTML:
	<img id="logoString" src="images/homePage/unlog.png" alt="..."/>
JS:
	var logoString = "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAGu5JREFUeNqsenlwXPd93+ede9+LxX0DBEESJCiRJikeMk0lsh1JI9lSxqrstknqxuM6bdJ/mjozqcZxpzNNZ5yZuI2rxm3qzKSK3Ti6fOgKJdKiSBEUTxAEcRLXAthd7H28u5+3oI7Ybu1JhZk3AHb3vff7Xp/j91ZwHAdmLouf/nFECbZWh90w4UD80BuAUN+E4E1DiQfhmCKsegZKqA+11Qn4kmMwCosRCPaArTkPlufOPFycXXe83YdesPTSj2HU7qQOPVI0Shnkrp1DMLUX+bUbCPbuRWL0MDLnv4/kic9DVH3bN+OPICnQ8ndQW7/Gv9WfWWvrfZ+HjI/iRxDdG0uKN7C/mpk+aWwt/mp57drxmYuTnqIVwcjxcQjVt47KhvrvLETfzs9OnIPlnJdU3xVJ9qx9FEuQ///WL0FUPP1mpfZQdvKVT5YWL9+TnrzYtrwsYGo5iCuZ3Vg3etA5H8Ou/iSGEgV/qzd3qrX6yilV8uqCEL9ZXyxeFgTPT0RReYvXmhYE8efd6e7xUQbCVuS9ekRZfqi8fOUTlfTcxzYnL3ZvpkuYvhPBanUcVrANvl4FR4aqiEVUmHYVpY0clmqtuOkkYdTbkfQX1NGO9fHW4Oy435v4QvnmnezGjR/NBfyxVyRZ+brj2LbbWoIkw7EMHvr/M5hfHIjg9qkIQbg7H171yVL+8p9unnspkVtZwdqGg6sbw6gqQ+gf8uKBAQ0jOxRIxiwqSwvwhOMQg93I3boCSQwC/iSWNoI4Px3GMy/74VUsjPdk5AO7zbaeTm/b2uULR3zT5/9aDkanBcZi1crQ8xk0SlNI7joO29D+gYGIBvPgh+Ll8JsCpJj8Txa/91zi3Ku3cNU6hYXKLhw6HMQT+yYxkJyFJXrQ2ALqpQKqeQm++hakKm8T70GjrhE8auiJ";
	$("#logoString").attr("src","data:image/jpg;base64,"+logoString);

//**********BASE64 图片 end**********





// 浏览器监听窗口变化
1、 window.addEventListener('resize', resizeFunc, false);


// 移除监听
1、 window.removeEventListener('resize', resizeFunc, false);


/**
 * 图片转 base64 方法
 */
function getBase64(imgUrl) {
  window.URL = window.URL || window.webkitURL;
  var xhr = new XMLHttpRequest();
  xhr.open("get", imgUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      var blob = this.response;                 //得到一个blob对象
      console.log("blob", blob)
      let oFileReader = new FileReader();
      oFileReader.onloadend = function (e) {
        let base64 = e.target.result;
        console.log("[base64对象]", base64);
      };
      oFileReader.readAsDataURL(blob);

    }
  }
  xhr.send();
}


function getBase64Image(img, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width ? width : img.width;
  canvas.height = height ? height : img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  var dataURL = canvas.toDataURL();
  return dataURL;
}

/**
 * 图片转 base64 方法
 *
 */
function getCanvasBase64(img) {
	var image = new Image();
	image.crossOrigin = '';
	image.src = img;
	image.onload = function () {
		console.log("[base64对象]", getBase64Image(image));
	}
}


# chrome 浏览器调试
chrome://inspect/#devices


# 设置chrome 跨域
C:\Users\wuwenping\AppData\Local\Google\Chrome\Application\chrome.exe --args --disable-web-security --user-data-dir="C:/ChromeDevSession"



# 'use strict';
"use strict" 指令在 JavaScript 1.8.5 (ECMAScript5) 中新增。
它不是一条语句，但是是一个字面量表达式，在 JavaScript 旧版本中会被忽略。
"use strict" 的目的是指定代码在严格条件下执行。
严格模式下你不能使用未声明的变量。




### 匹配汉字的正则表达式	
``` javascript
var passwordReg	= /[\u4E00-\u9FA5\uF900-\uFA2D]/;
```

#### 常用的正则
``` javascript
let any = {
    phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
    email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    pwd: /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,32}$/,
}
```



/* 获取当前时间的时间戳 -- 毫秒（ms） */
new Date().getTime();
Date.now();
//**********日期时间设置 end**********



//**********深拷贝 start**********

a: 递归递归去复制所有层级属性。
// 复制对象的结构和属性，而非指针
function deepClone(obj){
	let objClone = Array.isArray(obj)?[]:{};
	if(obj && typeof obj==="object"){
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				//判断ojb子元素是否为对象，如果是，递归复制
				if(obj[key]&&typeof obj[key] ==="object"){
					objClone[key] = deepClone(obj[key]);
				}else{
					//如果不是，简单复制
					objClone[key] = obj[key];
				}
			}
		}
	}
	return objClone;
}    
	
b: JSON对象的parse和stringify
JSON.parse(JSON.stringify(obj));


//**********深拷贝 end**********	







//**********动态加载 js 文件 start**********	

(function(){
	var srcript, 
		srcripts = document.getElementsByTagName('srcript')[0];
	function load(url){
		srcript = document.createElement('srcript');
		srcript.async = true;
		srcript.src = url;
		srcripts.parentNode.insertBefore(srcript, srcripts);
	}
	
	load('//api.google.com/js/plusone1.js');
	load('//api.google.com/js/plusone2.js');
	load('//api.google.com/js/plusone3.js');
}())

// 动态创建js
function loadjs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'coolshell_script_id');
 
    script_id = document.getElementById('coolshell_script_id');
    if(script_id){
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}

//**********动态加载 js 文件 end**********	





//**********下载图片地址和图片名  start**********	

function downloadIamge(imgsrc, name) {
	var image = new Image();
	image.setAttribute("crossOrigin", "anonymous");	 		// 解决跨域 Canvas 污染问题
	image.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0, image.width, image.height);
		var url = canvas.toDataURL("image/png"); 			//得到图片的base64编码数据
		var a = document.createElement("a"); 				// 生成一个a元素
		var event = new MouseEvent("click"); 				// 创建一个单击事件
		a.download = name || "photo"; 						// 设置图片名称
		a.href = url; 										// 将生成的URL设置为a.href属性
		a.dispatchEvent(event); 							// 触发a的单击事件
	};
	image.src = imgsrc;
}


/**
 * 文件下载
 * fileName {String} 下载的文件名 	
 * url {String}  文件下载地址，链接
 */
function download(filename, url){
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	xhr.onload = ()=> {
		if (xhr.status === 200) {
			let blob = xhr.response;
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, filename);
			} else {
				let link = document.createElement('a');
				let body = document.querySelector('body');
				link.href = window.URL.createObjectURL(blob);
				link.download = filename;
				link.style.display = 'none';
				body.appendChild(link);
				link.click();
				body.removeChild(link);
				window.URL.revokeObjectURL(link.href);
			};
		}
	};
	xhr.send();
}


//**********下载图片地址和图片名  end**********	



//**********键盘监听事件  start**********	

document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==13){ // enter 键
		doSomething();
	}
	if(e && e.keyCode==27){ // 按 Esc 
        doSomething();
	}
	if(e && e.keyCode==113){ // 按 F2 
        doSomething();
	}            
}; 

//**********键盘监听事件  end**********	




//**********js 判断页面加载完成  start**********

document.onreadystatechange = this.isOnReady;
isOnReady() {
  if (document.readyState == "complete") {
	doSomething()....
  }
},

//**********js 判断页面加载完成  end**********




//**********金额展示3位数字用 , 间隔  start**********
thousandBit(value) {
  return value ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}
//**********金额展示3位数字用 , 间隔  end**********








//**********判断是 Array 和 Object 数组或JOSN对象  start**********

Object.prototype.toString.call(value) === "[object Array]"		// 判断是否数组
Object.prototype.toString.call(value) === "[object Object]"		// 判断是否JSON
// 延伸
Object.prototype.toString.call(window) === "[object Window]"	// Window 对象
Object.prototype.toString.call(Window) === "[object Function]"	// Window 为Function 对象

//**********判断是 Array 和 Object 数组或JOSN对象  end**********


	
	

//**********复制文本到剪切板 start**********

function copy(message) {
	var input = document.createElement("input");
	input.value = message;
	document.body.appendChild(input);
	input.select();
	input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
	document.body.removeChild(input);
}

//**********复制文本到剪切板  start**********





//**********JS数组去重  start**********

	1、JS数组去重
	function unique(arr) {
		var result = [], hash = {};
		for (var i = 0, elem; (elem = arr[i]) != null; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	}
	
	2、利用 Object.keys() 方法枚举 && 对象不能有相同的属性方法 
	function unique(arr){
		var tempKey = {};
		for(var i=0; i<arr.length; i++){
			tempKey[arr[i]] = 0;
		}
		return Object.keys(tempKey)；
	}


//**********JS数组去重  end**********






//********** Throw 声明  start**********

	var x=prompt("请输入 0 至 10 之间的数：","")
	try
	{ 
		if(x>10) 
		  throw "Err1" 
		else if(x<0)
		  throw "Err2"
		else if(isNaN(x))
		  throw "Err3"
	} 
	catch(er)
	{
		if(er=="Err1") 
		  alert("错误！该值太大！")
		if(er == "Err2") 
		  alert("错误！该值太小！") 
		if(er == "Err3") 
		  alert("错误！该值不是数字！") 
	}

//********** Throw 声明  start**********



# 防抖 
防抖函数，事件被触发后n秒后执行。如果n秒内再次触发，最后只执行最后一次
const debounce = (fn, delay) => {
	let timer = null;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(()=> {
			fn.apply(this, args);
		}, delay);
	}
}




# 节流函数
const throttle = (fn, delay=500) => {
	let flag = true;
	return (...args) => {
		if(!flag) return;
		flag = false;
		setTimeout(()=> {
			fn.apply(this, args);
			flag = true;
		}, delay);
	}
}

