


## 一、Iframe 向父级传递消息

``` js
const mainHost = 'http://localhost:9527'

window.parent.postMessage(message, mainHost);

```


## 二、父级监听 iframe 消息
``` js

window.addEventListener('message', this.iframeMessageCall, false)


// message 消息回调函数
iframeMessageCall(e: any) {
	...
}

```