# 数组方法

```js
join()
push()和pop()
shift()和unshift()
sort()
reverse()
concat()
slice()
splice()
indexOf()和 lastIndexOf() （ES5新增）
forEach() （ES5新增）
map() （ES5新增）
filter() （ES5新增）
every() （ES5新增）
some() （ES5新增）
```

# 改变原数组的方法

```js
push();
pop();
shift();
unshift();
sort();
reverse();
concat();
splice();
```

# 不改变原数组方法

```js
join()							## 把数组转换成特定符号分割的字符串 #
slice(start,end):	返回从原数组中指定开始下标到结束下标之间的项组成的新数组
indexOf()
lastIndexOf() （ES5新增）
forEach() （ES5新增）
map() （ES5新增）
filter() （ES5新增）
every() （ES5新增）
some() （ES5新增）
```

# 使用场景

```js
var arr = new Array();
arr[0] = "aaa";
arr[1] = "bbb";
arr[2] = "ccc";
//alert(arr.length);//3

arr.pop();
//alert(arr.length);//2
//alert(arr[arr.length-1]);//bbb
arr.pop();
//alert(arr[arr.length-1]);//aaa
//alert(arr.length);//1

var arr2 = new Array();
//alert(arr2.length);//0
arr2[0] = "aaa";
arr2[1] = "bbb";
//alert(arr2.length);//2
arr2.pop();
//alert(arr2.length);//1
arr2 = arr2.slice(0,arr2.length-1);
//alert(arr2.length);//0
arr2[0] = "aaa";
arr2[1] = "bbb";
arr2[2] = "ccc";
arr2 = arr2.slice(0,1);
alert(arr2.length);//1
alert(arr2[0]);//aaa
alert(arr2[1]);//undefined

// shift：删除原数组第一项，并返回删除元素的值；如果数组为空则返回undefined
var a = [1,2,3,4,5];
var b = a.shift(); //a：[2,3,4,5]   b：1

// unshift：将参数添加到原数组开头，并返回数组的长度
var a = [1,2,3,4,5];
var b = a.unshift(-2,-1); //a：[-2,-1,1,2,3,4,5]   b：7
/* 注：在IE6.0下测试返回值总为undefined，FF2.0下测试返回值为7，所以这个方法的返回值不可靠，需要用返回值时可用splice代替本方法来使用。  */

// pop：删除原数组最后一项，并返回删除元素的值；如果数组为空则返回undefined
var a = [1,2,3,4,5];
var b = a.pop(); //a：[1,2,3,4]   b：5 //不用返回的话直接调用就可以了

// push：将参数添加到原数组末尾，并返回数组的长度
var a = [1,2,3,4,5];
var b = a.push(6,7); //a：[1,2,3,4,5,6,7]   b：7

// concat：返回一个新数组，是将参数添加到原数组中构成的
var a = [1,2,3,4,5];
var b = a.concat(6,7); //a：[1,2,3,4,5]   b：[1,2,3,4,5,6,7]

// 从start位置开始删除deleteCount项，并从该位置起插入val1,val2,...
splice(start,deleteCount,val1,val2,...)：
var a = [1,2,3,4,5];
var b = a.splice(2,2,7,8,9); //a：[1,2,7,8,9,5]   b：[3,4]
var b = a.splice(0,1); //同shift
a.splice(0,0,-2,-1); var b = a.length; //同unshift
var b = a.splice(a.length-1,1); //同pop
a.splice(a.length,0,6,7); var b = a.length; //同push

// reverse：将数组反序
var a = [1,2,3,4,5];
var b = a.reverse(); //a：[5,4,3,2,1]   b：[5,4,3,2,1]

// 按指定的参数对数组进行排序
sort(orderfunction)：
var a = [1,2,3,4,5];
var b = a.sort(); //a：[1,2,3,4,5]   b：[1,2,3,4,5]

// 返回从原数组中指定开始下标到结束下标之间的项组成的新数组
slice(start,end)：
var a = [1,2,3,4,5];
var b = a.slice(2,5); //a：[1,2,3,4,5]   b：[3,4,5]

// 将数组的元素组起一个字符串，以separator为分隔符，省略的话则用默认用逗号为分隔符
join(separator)：
var a = [1,2,3,4,5];
var b = a.join("|"); //a：[1,2,3,4,5]   b："1|2|3|4|5"

// 再给个利用数组模拟javaStringBuffer处理字符串的方法：
```

# 字符串处理函数

```js
function StringBuffer() {
  var arr = new Array();
  this.append = function (str) {
    arr[arr.length] = str;
  };

  this.toString = function () {
    return arr.join(""); //把 append 进来的数组 ping 成一个字符串
  };
}
```

# 把数组转换成特定符号分割的字符串

```js
function arrayToString(arr, separator) {
  if (!separator) separator = ""; //separator 为 null 则默认为空
  return arr.join(separator);
}
```

# 查找数组包含的字符串

```js
function arrayFindString(arr, string) {
  var str = arr.join("");
  return str.indexOf(string);
}
```

# reduce 的使用

```js
Array.reduce((total, item, itemIndex)=> {
total = ... // 用于累加值
return total;
}, initData)
```
