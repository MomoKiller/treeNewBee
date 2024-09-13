> $()是jQuery()的简写=getElementByTagName();如： $(“div”)=getElementByTagName(“div”);
$()的作用是用于查找出 HTML 的标签、属性、样式。而且还可以通过层次进行查找出。

> noConflict()翻译成中文是“无抵触”。用法：作用是防止与其他框架同使用时$()简写重名导致脚本停止运行。当然我们也可以这样 var jq = $.noConflict();这样就能创建自己的 jQuery 的简写了。jq 就是简写！

# 隐藏/显示

Hide(),show()

# 淡入淡出

fadeIn(),fadeout(),fadeToggle(“slow”),fadeTo(“slow”,0.5)分别是只会淡入，只会淡出，会淡入淡出(有可选效果，快、慢)，淡出的快慢以及透明度。

# 滑动

slideDown(),slideUp(),slideToggle()分别是往下滑动，往上滑动，能上能下滑动。

# 追加新元素

append() - 在被选元素的结尾插入内容 prepend() - 在被选元素的开头插入内容 after() - 在被选元素之后插入内容 before() - 在被选元素之前插入内容(都是在前面或是都在后面插入内容没感觉有什么不同)
如：$(“div”).append(“asds”);其中 div 是被选元素

# 删除元素/内容

Remove()删除选中的那个元素（包括其子元素），empty()删除被选中的子元素。

# 设置 CSS 样式

addClass(),removeClass(),toggleClass(),css()分别是增，删，切换，设置或返回样式属性。

# 尺寸

Width()height(),innerWidth/Height()outerWidth/Height()分别是设置或返回元素的宽，高。包括内边距宽高。包括内边距加边框，如果括号内为 true 的话则包括内+外+边框总和的宽高

# 遍历

Parent(),parents(),parentsUntil()分别是返回被选元素的上一级（直父），被选以上所有的元素。返回两个元素之间的所有祖元素。
Children(),find()分别是返回被选元素的下一级（直子）。Find()括号内如果是指定元素标签的话则返回被选元素的所有‘子’指定标签，如果是“\*”则返回被选元素下的所有子元素标签。
Siblings()返回被选元素的同胞所有元素（如果括号内带有指定元素标签则返回同胞中所有该元素标签的元素），next()返回被选元素的同胞下一个元素，nextAll()返回的是被选元素的同胞下所有的元素，nextUntil()返回的是被选元素到 nextUntil()括号指定元素之间的所有元素。Prev(),prevAll(),prevUntil()与 next(),nextAll(),nextUntil()一一相反对应。
First()返回被选元素的首个元素（选中的元素有多个），last()则是对应最后一个元素。Eq(n)返回被选元素索引的第 n 个元素（选中的元素有多个），filter(“指定标准的元素”)返回带有指定标准的元素，其他的一律会被从集合中删除。Not()方法与 filter()相反。

# Ajax

jQuery 是通过 load(URL,data,callback)方法进行加载服务器数据，其中 callback 参数是可选的。
$.get(URL,callback)从服务器上请求数据，URL 是必选，callback 是可选，用于请求成功后所执行的函数。

# 根据 input 控件中的值 实时改变另一个值

    使用的控件的 onkeyup 方法

1、Html 控件中添加 onkeyup 事件：

```html
<input
  type="text"
  name="card-num"
  id="card-num"
  onkeyup="onCardNumChange();"
  placeholder="请填写身份证号"
/>
```

2、JS 中添加对应的数据获取方法：

```js
function onCardNumChange() {
  var cardNum = $("#card-num").val();
  var carBirth =
    cardNum.substr(6, 4) +
    "-" +
    cardNum.substr(10, 2) +
    "-" +
    cardNum.substr(12, 2);
  $("#car-birthday").val(carBirth);
}
```
