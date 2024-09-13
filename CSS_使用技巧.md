# CSS 书写顺序

1. 位置属性(position, top, right, z-index,display, float 等)
2. 大小(width, height, padding, margin)
3. 文字系列(font, line-height, letter-spacing,color- text-align 等)
4. 背景(background, border 等)
5. 其他(animation, transition 等)

# clear:both 清除浮动

```css
footer {
  float: left;
  clear: both;
}
```

## 参考网址：

http://www.w3school.com.cn/tiy/t.asp?f=csse_class-clear

# 表格边框合并

```css
table {
  border-collapse: collapse;
}
```

# 利用伪类改变背景透明度、设置背景阴影效果

```css
img {
  opacity: 1;
  filter: alpha(opacity=100); /* For IE8 and earlier */
}
img:hover {
  opacity: 0.8;
  filter: alpha(opacity=80); /* For IE8 and earlier */
  box-shadow: 2px 2px 1px #888888; /*背景阴影*/
}
```

# 不使用代理

```js
var myImage = (function () {
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  var img = new Image();

  img.onload = function () {
    imgNode.src = img.src;
  };

  return {
    setSrc: function (src) {
      imgNode.src = "./images/loading.gif";
      img.src = src;
    },
  };
})();

myImage.setSrc("./images/originImg.png");
```

# 图片预加载--使用代理的方式

```js
var myImage = (function () {
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);

  return {
    setSrc: function (src) {
      imgNode.src = src;
    },
  };
})();

var proxyImage = (function () {
  var img = new Image();

  img.onload = function () {
    myImage.setSrc(this.src); // this指向img！img加载完成后，将img.src传递给myImage
  };

  return {
    setSrc: function (src) {
      myImage.setSrc("./images/loading.gif"); // loading
      img.src = src;
    },
  };
})();

proxyImage.setSrc("./images/originImg.png");
```

//背景图片自动填充(cover)

```css
body {
  background: url("images/img/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  -moz-background-size: cover;
}

/* 项目菜单实例 */
 {
  background-image: url("../../../images/homePage/DHXLBJ2.png");
  background-position: 100% 100%;
  background-repeat: no-repeat;
  background-size: cover;
  -moz-background-size: cover;
}
```

# 背景图片居中显示

```css
.logoPanel {
  width: 650px;
  height: 170px;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
}
```

# 垂直水平居中

## 参考：

https://www.w3cplus.com/css/centering-css-complete-guide.html

```css
.parent {
  positon: relative;
  // 0.5 模糊问题
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.child {
  width: ; /*定义控件的长度*/
  height: ; /*定义控件的高度*/
  position: absolute; /*与父容器属性对应*/
  left: 50%; /*自己理解去吧.0_0.*/
  top: 50%;
  transform: translate(-50%, -50%);
}
```

## 弹性盒子

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

# table 布局的

```css
.searchDiv {
  display: table;
  table-layout: fixed;
  width: 100%;
}
.searchDiv .colDiv {
  display: table-cell;
  padding-left: 10px;
}
```

## 对应的 HTML

```html
<div class="searchDiv">
  <div class="colDiv"></div>
  <div class="colDiv"></div>
  <div class="colDiv"></div>
  <div class="colDiv"></div>
</div>
```

# 设置文字垂直居中

```css
p {
  display: table-cell;
  vertical-align: middle;
}
```

# C3 实现页面动画效果

```css
.className {
  width: 0px;
  -webkit-transition: width 0.5s;
  -moz-transition: width 0.5s;
  -ms-transition: width 0.5s;
  -o-transition: width 0.5s;
  transition: width 0.5s;
}
.className:hover {
  width: 100px;
  -webkit-transition: width 0.5s;
  -moz-transition: width 0.5s;
  -ms-transition: width 0.5s;
  -o-transition: width 0.5s;
  transition: width 0.5s;
}
```

// C3 实现页面动画实践

```css
/* 元素原有样式 */
header .head .banner .turnplate a.btn-label {
  display: block;
  width: 12.7%;
  height: 13.5%;
  position: absolute;
  left: 43.65%;
  top: 44%;
  background: url(../img/activity-label-click.png) no-repeat;
  background-size: 100%;
  background-position: center;
  animation: btnToBig 0.5s linear infinite alternate;
  -webkit-animation: btnToBig 0.5s linear infinite alternate;
}
/* 元素动画效果 */
@keyframes btnToBig {
  from {
    width: 11.43%;
    height: 12.15%;
    position: absolute;
    left: 44.28%;
    top: 44%;
  }
  to {
    width: 12.7%;
    height: 13.5%;
    left: 43.65%;
    top: 44%;
  }
}
@-webkit-keyframes btnToBig {
  from {
    width: 11.43%;
    height: 12.15%;
    position: absolute;
    left: 44.28%;
    top: 44%;
  }
  to {
    width: 12.7%;
    height: 13.5%;
    left: 43.65%;
    top: 44%;
  }
}
```

# 设置半透明背景

```css
.floor-us {
  background: rgba(255, 255, 255, 0.5);
}
```

# css 的 position 属性对应的功能

- absolute：生成 绝 对定位的元素，相对于 static 定位以外的第一个父元素进行定位，元素位置通过 left top right bottom 属性进行规定
- fixed：生成 绝 对定位的元素，相对于浏览器窗口进行定位元素位置通过 left top right bottom 属性进行规定
- relative：生成 相 对定位的元素，相对于其正常的位置进行定位 left: 20 会向元素的 left 位置添加 20 像素
- static：默认值。没有定位，元素出现在正常的流中 （忽略 top bottom left right 或 z-index 声明）
- inherit：规定应该从父元素继承 position 属性的值

# css3 利用该伪类(在字体前方加 |)

```css
.list::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 16px;
  margin-right: 15px;
  background-color: #d23030;
  position: relative;
  bottom: -3px;
}
```

# css 一行多出的文字显示...

```css
.li {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
```

# css 多出的文字显示...

```css
p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /*显示行数*/
  -webkit-box-orient: vertical;
}
```

# H5 不显示默认的选中框

```css
*:focus {
  outline: none;
}
```

# H5 去除 Input focus 状态的黄色边框

```css
input {
  border: 0;
  outline: none;
}
```

# 各种箭头效果

http://blog.csdn.net/tangtang5963/article/details/51490107

# 伪类实现 箭头

```css
.address-holder::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid #fee;
  margin-top: -105px;
  float: right;
  margin-right: -1px;
}
.address-holder::before {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #999;
  margin-top: -14px;
  float: right;
}
```

# CSS 实现滚动 隐藏滚动条（主要隐藏 PC 滚动条）

> 如果要兼容 PC 其他浏览器（IE、Firefox 等），
> 在容器外面再嵌套一层 overflow:hidden
> 内部内容再限制尺寸和外部嵌套层一样，就变相隐藏了。

```html
<div class="outer-wrap">
  <div class="inner-wrap">
    <div class="content">......</div>
  </div>
</div>
```

```css
.outer-wrap,
.content {
  width: 200px;
  height: 200px;
}
.outer-wrap {
  position: relative;
  overflow: hidden;
}
.inner-wrap {
  position: absolute;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
/* for Chrome */
.inner-wrap::-webkit-scrollbar {
  display: none;
}
```

# 图片放大效果

```css
.pane-module .module-pic:hover img {
  transition: all 0.3s ease-out 0.1s;
  transform: matrix(1.05, 0, 0, 1.05, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
```

# 背景颜色渐变

```css
div {
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(blue),
    color-stop(0.5, green),
    to(red)
  );
}

div {
  border: 1px transparent solid;
  border-image: linear-gradient(to right, #000718, #23b7cb) 1 10;
}
```

# 关于钱的符号

```html
￥￥￥￥￥￥￥￥￥
```

# placeholder 兼容样式

```css
.search_input::-webkit-input-placeholder {
  color: #bbbbbb;
}
.search_input:-moz-placeholder {
  color: #bbbbbb;
}
.search_input::-moz-placeholder {
  color: #bbbbbb;
}
.search_input:-ms-input-placeholder {
  color: #bbbbbb;
}
```

# 设置 0.5px 的边框

```css
element::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  -ms-transform: scale(0.5, 0.5);
  -o-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
```

# h5 <A> 标签兼容样式

```css
a {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}
```

# 长按出蓝色背景

```css
a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  outline: none;
  background: none;
  text-decoration: none;
}

::selection {
  background: #fff;
  color: #333;
}
::-moz-selection {
  background: #fff;
  color: #333;
}
::-webkit-selection {
  background: #fff;
  color: #333;
}
img {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  user-select: none;
}
```

# 页面字体兼容性设置

```css
* {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
}
```

# iphoneX 兼容性样式

```css
.content {
  width: 100%;
  height: 100%;
  // 有滚动条的容器，添加下面的 css 样式使滑动更圆滑
  -webkit-overflow-scrolling: touch;
}
.content iframe {
  width: 100%;
  height: 100%;
  // 底部容易被顶高
  height: calc(100% - env(safe-area-inset-bottom));
}
```

# 媒体查询

```css
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  body {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .phonex-pb {
    padding-bottom: constant(safe-area-inset-bottom);
  }
  .iphonex-pt {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
  .iphonex-pb {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .iphonex-mt {
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
  }
  .iphonex-mb {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
  .iphonex-pl {
    padding-left: constant(safe-area-inset-left);
    padding-left: env(safe-area-inset-left);
  }
  .iphonex-pr {
    padding-right: constant(safe-area-inset-right);
    padding-right: env(safe-area-inset-right);
  }
  .iphonex-ml {
    margin-left: constant(safe-area-inset-left);
    margin-left: env(safe-area-inset-left);
  }
  .iphonex-mr {
    margin-right: constant(safe-area-inset-right);
    margin-right: env(safe-area-inset-right);
  }
  .iphonex-bd-top-bg {
    border-top: 88px solid transparent;
  }
  .iphonex-bd-top {
    border-top: 44px solid transparent;
  }
  .iphonex-bd-bottom {
    border-bottom: 34px solid transparent;
  }
}
```

# CSS 三原色-不刺眼取代色-

#red： #ff0033;
#green: #04b700;
#blue: #488aff;

# nth 选择器

```css
a: table 第一列
table tr td:first-child {
  width: 15%;
}
b：第 N 列 table tr td:nth-child(2) {
  width: 25%;
}
table tr td:nth-child(3) {
  width: 10%;
}
c: table 奇数行偶数行
table tr:nth-child(odd) {
  background-color: #f1f1f1;
}
table tr:nth-child(even) {
  background-color: #ffffff;
}
```

# 表格合并边框

```css
table {
  border-collapse: collapse;
}
```

# p a 标签换行

```css
world-break: break-all; // 或者其它参数
```

# 浮动与清除浮动

```css
.fl {
  float: left;
}
.fr {
  float: right;
}
.fix {
  \*zoom: 1;
}
.fix:after {
  display: table;
  content: "";
  clear: both;
}
```

# 按钮禁用状态

```css
.disabled {
  outline: 0 none;
  cursor: default !important;
  opacity: 0.4;
  filter: alpha(opacity=40);
  -ms-pointer-events: none;
  pointer-events: none;
}
```
