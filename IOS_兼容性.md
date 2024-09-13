1. 如果想全屏覆盖，html里面请使用


<meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no, viewport-fit=cover">

<!-- 禁用缩放 -->
<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">





2.如果想对某个元素进行底部上移或者顶部下移可以做以下适配。

   注：如果想下面constant env 属性有效果，请务必添加上面meta 标签  viewport-fit=cover 才能实现。

/*
 *  iphoneX pulic  css
 *  2018-01-01
 */
 


@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){ 

   body{
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
   }
   .iphonex-pt{
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
   }
   .iphonex-pb{
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
   }
   .iphonex-mt{
      margin-top: constant(safe-area-inset-top);
      margin-top: env(safe-area-inset-top);
   }
   .iphonex-mb{
      margin-bottom: constant(safe-area-inset-bottom);
      margin-bottom: env(safe-area-inset-bottom);
   }
   .iphonex-pl{
      padding-left: constant(safe-area-inset-left);
      padding-left: env(safe-area-inset-left);
   }
   .iphonex-pr{
      padding-right: constant(safe-area-inset-right);
      padding-right: env(safe-area-inset-right);
   }
   .iphonex-ml{
      margin-left: constant(safe-area-inset-left);
      margin-left: env(safe-area-inset-left);
   }
   .iphonex-mr{
      margin-right: constant(safe-area-inset-right);
      margin-right: env(safe-area-inset-right);
   }
   .iphonex-bd-top-bg{
      border-top: 88px solid transparent;
   }
   .iphonex-bd-top{
      border-top: 44px solid transparent;
   }
   .iphonex-bd-bottom{
      border-bottom: 34px solid transparent;
   }

}

3.js 方法，有些接口必须用js 去处理，不能用css样式实现，那么就可以这样做

if($(window).width() === 375 && $(window).height() === 724 && window.devicePixelRatio === 3){
    $(".phonex-pb").css("padding-bottom","34px");
}


ps: 写在后面

对于constant(safe-area-inset-bottom) 这样的属性完全可以不用写在media 媒体查询里面，
上面只是做了公共样式处理，safe-area-inset-bottom 意义其实相当于 底部34px。
类似padding-bottom:34px;
考虑其他兼容问题，
多做了一个透明border 处理方法，
仅仅是一种解决方式而已，其实都能实现。


/**********这套兼容性方案不太好使----再寻找一套好使的方案************/


html,body{ -webkit-text-size-adjust: none; }  // 当需要在中文版chrome浏览器中显示小于12px的字体时，而且此时页面放大效果会被阻止

html,body{ -webkit-tap-highlight-color: rgba(0,0,0,0); }  // 去掉苹果手机点击瞬间出现的灰色背景

input{ -webkit-appearance: none; } // 去除苹果手机默认的input样式

selector{ cursor: pointer } // 给IOS系统里cursor不为pointer的元素添加事件时会不同程度受影响，加上cursor: pointer可解决

img{ pointer-events: none; } // 阻止图片在微信里被点击放大



/*font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu,PingFangSC-Regular, sans-serif;*/







/* IOS 图片上传 */
/******** 解决IOS兼容图片上传 start ********/
if (!HTMLCanvasElement.prototype.toBlob) {
	Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
		value: function(callback, type, quality) {
			var dataURL = this.toDataURL(type, quality).split(',')[1];
			setTimeout(function() {

				var binStr = atob(dataURL),
					len = binStr.length,
					arr = new Uint8Array(len);

				for (var i = 0; i < len; i++) {
					arr[i] = binStr.charCodeAt(i);
				}

				callback(new Blob([arr], {
					type: type || 'image/png'
				}));

			});
		}
	});
}


/* 本地缓存图片 */
<input type="file" @change="uploadImg">

原生js写法
document.getElementByTageName("input[type='file']").onchange = function(e){
	uploadImg(e, '这个对象是项目里面用的-可以忽略');
}

uploadImg(e, flieName) {
	let files = e.target.files || e.dataTransfer.files;
	if (!files.length) return;
	let picavalue = files[0];
	if (
		picavalue.type == "image/jpeg" ||
		picavalue.type == "image/jpg" ||
		picavalue.type == "image/png"
	) {
		this.imgPreview(picavalue, flieName);
	} else {
		Toast.$emit('toastMsg', "请上传格式正确的图片");
		return;
	}
},
/* 获取图片 */
imgPreview(file, imgNum) {
	let that = this;
	if (!file || !window.FileReader) return;
	if (/^image/.test(file.type)) {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function() {
			let result = this.result;
			let img = new Image();
			img.src = result;
			img.onload = function() {
				that.compress(img, 1, data => {
					// data 对象是base64 对象；
					that.param[imgNum].value = data;
					that.param[imgNum].file = data.replace("data:image/jpeg;base64,", "");
				});
			};
		};
	}
},
/* 压缩图片 */
compress(img, bili, callBack) {
	let bi = bili * bili; // 大小压缩
	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");
	let width = img.width / bi;
	let height = img.height / bi;
	canvas.width = width;
	canvas.height = height;
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, width, height);
	let ndata = canvas.toDataURL("image/jpeg", 0.1); // 10倍分辨率压缩
	let self = this;
	canvas.toBlob(function(blob) {
		if (blob.size > 1024 * 1024) { // 分辨率较大 -多次压缩
			self.compress(img, 1.5, callBack);	
		} else {
			callBack(ndata);
		}
	}, "image/jpeg");
},








/************ 解决 readonly 的输入框 点击出现光标 ************/
<input readonly unselectable="on" onfocus="this.blur()" />





/******** 微信QQ打开 -start- ********/
.navigator {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	background-color: #fff;
}

.show-ios,
.show-android {
	display: none;
}

.ak {
	width: 100vw;
	height: 100vh;
}

.ak img {
	display: block;
	margin: 20% auto 20px;
	clear: both;
	width: 30%;
	max-width: 128px;
	pointer-events: none;
}

img.icon {
	width: 30px;
	display: inline-block;
	vertical-align: middle;
	margin: 0 10px;
}

.ak h3 {
	display: block;
	width: 240px;
	margin: auto;
}
/******** 微信QQ打开 -end- ********/

<!--  微信|QQ打开 引导页  -->
<div class="navigator show-ios">
	<div class="ak">
		<img src="http://47.103.95.97/staticResources/ttx/imgs/safari.jpg" alt="" width="100">
		<h3>1.请点击右上角图标<img src="http://47.103.95.97/staticResources/ttx/imgs/menu.jpg" alt="" class="icon">
			<br>2.用safari浏览器打开</h3>
	</div>
</div>
<div class="navigator show-android">
	<div class="ak">
		<img src="http://47.103.95.97/staticResources/ttx/imgs/android.jpg" alt="" width="100">
		<h3>1.请点击右上角图标<img src="http://47.103.95.97/staticResources/ttx/imgs/menu.jpg" alt="" class="icon">或<img src="http://47.103.95.97/staticResources/ttx/imgs/add.jpg" alt="" class="icon">
			<br>2.用默认浏览器打开</h3>
	</div>
</div>

/******** QQ|微信打开到提示页 start ********/
setTimeout(function() {
	var ua = navigator.userAgent;
	var uaLow = navigator.userAgent.toLowerCase();
	var domIos = document.querySelector('.show-ios');
	var domAndroid = document.querySelector('.show-android');
	// var domApp = document.querySelector('.ion-app');
	if (uaLow.match(/MicroMessenger\/[0-9]/i) || uaLow.match(/QQ\/[0-9]/i)) {
		// domApp.style.display = 'none';
		if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1)
			domAndroid.style.display = 'block';
		if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
			domIos.style.display = 'block';
	}
}, 400);
/******** QQ|微信打开到提示页 end ********/






