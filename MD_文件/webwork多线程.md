


## webWorker 多线程 -- postMessage 通信

#### 主线程 
> 主线程中通过子线程文件，实例化一个 **Worker** 对象
> 主线程待处理数据通过 **postMassge()** 传递给子线程,
> 同时通过 **Worker实例** 监听子线程返回的数据
##### main.js
```javascript
const first = document.querySelector('#number1');

const result = document.querySelector('.result');

if (window.Worker) {
    // 引入子线程文件
	const myWorker = new Worker("worker.js");

    // 往子线程推动消息
	myWorker.postMessage(first.value);

    // 监听子线程发送的消息-数据回显
	myWorker.onmessage = function(e) {
		result.textContent = e.data;
		console.log('Message received from worker');
	}
} else {
	console.log('Your browser doesn\'t support web workers.')
}

```

#### 子线程 
> 子线程在接受到数据后进行处理加工
> 处理完的数据通过 **postMessage()** 推送给主线程

##### worker.js
```javascript
onmessage = function(e) {
  console.log('Worker: Message received from main script');
  const result = e.data;
  
  // 子线程处理数据 并返回主线程
  const workerResult = 'Result: ' + result;
  console.log('Worker: Posting message back to main script');
  postMessage(workerResult);
}

```

#### 实例可参考
- [MomoKiller-web-worker_多线程](https://github.com/MomoKiller/treeNewBee/tree/master/CASE_web-worker_%E5%A4%9A%E7%BA%BF%E7%A8%8B)








