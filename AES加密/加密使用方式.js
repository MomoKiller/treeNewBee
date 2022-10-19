


|=========================================================================================================|
|																										  |
|																										  |
|																										  |
|																										  |
|===============================  	 AES 加密算法 aes.js 中自带CBC模式 	   ===============================|
|																										  |
|																										  |
|																										  |
|																										  |
|=========================================================================================================|





aes.rar 中包含资源文件





/* AES  CBC 加密算法 aes.js 中自带CBC模式 */
<script src="aes.js"></script>
 // 加密
function encrypt(data,key,iv) { //key,iv：16位的字符串
	var key1  = CryptoJS.enc.Latin1.parse(key);
	var iv1   = CryptoJS.enc.Latin1.parse(iv);
	return CryptoJS.AES.encrypt(data, key1,{
		iv : iv1,
		mode : CryptoJS.mode.CBC,
		padding : CryptoJS.pad.ZeroPadding
	}).toString();
}
// 解密
function decrypt(data,key,iv){ //key,iv：16位的字符串
	var key1  = CryptoJS.enc.Latin1.parse(key);
	var iv1   = CryptoJS.enc.Latin1.parse(iv);
	var decrypted=CryptoJS.AES.decrypt(data,key1,{
		iv : iv1,
		mode : CryptoJS.mode.CBC,
		padding : CryptoJS.pad.ZeroPadding
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}





/* AES   ECB 模式使用方式 */
<script src="aes.js"></script>
<script src="mode-ecb-min.js"></script>

const role = 'GYTTv!z1bkA336GayE4F&Vu8b3WMsl!V';	// 加密规则

encrypt(word) {
	const key = CryptoJS.enc.Utf8.parse(role); //16位
	let encrypted = '';
	if (typeof(word) == 'string') {
		let srcs = CryptoJS.enc.Utf8.parse(word);
		encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
	} else if (typeof(word) == 'object') {//对象格式的转成json字符串
		let data = JSON.stringify(word);
		let srcs = CryptoJS.enc.Utf8.parse(data);
		encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		})
	}
	return encrypted.toString();
}

decrypt(word){
	let key = CryptoJS.enc.Utf8.parse(role);
	let decrypt = CryptoJS.AES.decrypt(word, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypt.toString(CryptoJS.enc.Utf8);
}



/* AES 其它模式类同 */ 

/* aes 加密 */
encrypt(word) {
	// const key = 'GYTTv!z1bkA336GayE4F&Vu8b3WMsl!V'; // key
	const key = CryptoJS.enc.Utf8.parse('GYTTv!z1bkA336GayE4F&Vu8b3WMsl!V'); //16位
	let encrypted = '';
	if (typeof (word) == 'string') {
		let srcs = CryptoJS.enc.Utf8.parse(word);
		encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
	} else if (typeof (word) == 'object') {//对象格式的转成json字符串
		let data = JSON.stringify(word);
		let srcs = CryptoJS.enc.Utf8.parse(data);
		encrypted = CryptoJS.AES.encrypt(srcs, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		})
	}
	var res = base64.encode(encrypted.toString());
	return res;
}



decrypt(word){
	let word = base64.decode(word);
	let key = CryptoJS.enc.Utf8.parse('GYTTv!z1bkA336GayE4F&Vu8b3WMsl!V');
	let decrypt = CryptoJS.AES.decrypt(word, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypt.toString(CryptoJS.enc.Utf8);
}


