```js
var b = getTime();

function getTime() {
  return Date.now();
}

document.addEventListener("webkitvisibilitychange", function () {
  if (document.webkitVisibilityState == "hidden") {
    b = getTime();
  } else {
    document.body.appendChild(
      document.createTextNode("Time:" + (getTime() - b))
    );
  }
});
document.addEventListener("mozvisibilitychange", function () {
  if (document.mozVisibilityState == "hidden") {
    b = getTime();
  } else {
    document.body.appendChild(
      document.createTextNode("Time:" + (getTime() - b))
    );
  }
});
```

# 参考

- https://zhidao.baidu.com/question/1539773146871288267.html
