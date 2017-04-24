<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=10" />
    
   <link rel="stylesheet" type="text/css" href="<%=basePath%>/jquery-easyui-1.3.5/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/jquery-easyui-1.3.5/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/jquery-easyui-1.3.5/demo/demo.css">
    <script type="text/javascript" src="<%=basePath%>/jquery-easyui-1.3.5/jquery.min.js"></script>
    <script type="text/javascript" src="<%=basePath%>/jquery-easyui-1.3.5/jquery.easyui.min.js"></script>
	
	<title>demo</title>
  </head>
  
  <body>
    
	<input type="text"  id="demoId"  name="demoId">
	<br><br>
	<select id="demoSelId" style="width:140px;">
	</select>
	<br><br>
	<input type="text" id="demoId2" readonly>
	<br><br>
	
	<textarea rows="12" cols="3" style="width:400px;text-align:left;" id="textareaId">
<script type="text/javascript">
  alert(Math.PI);
</script>
	</textarea>
	<br>
	<input type="button" id="submitBtn" value="运行代码">
  </body>
  <script type="text/javascript">
  function SortDemo()
  {
    var a, l;
    a = new Array("X" ,"y" ,"d", "Z", "v","m","r");
    l = a.sort();
    return(l);
  }
  $("#demoId").val(SortDemo());
  
  function ForInDemo()
  {
    // 创建某些变量。
    var a, key, s = "";
    // 初始化对象。
    a = {"a" : "Athens" , "b" : "Belgrade", "c" : "Cairo"}
    // 迭代属性。
    var html="";
    for (key in a)
    {
       html += '<option value='+key+'>'+a[key]+'</option>';
       s += a[key] + "<BR>";
    }
    return(html);
  }
  $("#demoSelId").html(ForInDemo());
  
  function SplitDemo()
  {
    var s, ss;
    var s = "The quick brown fox jumped over the lazy yellow dog.";
    // 在每个空格字符处进行分解。
    ss = s.split(" ");		//默认用","分隔的数组
    ss = ss.join("-");		//改成用"-"分隔的字符串
    return(ss);
  }
  $("#demoId2").val(SplitDemo());	
 
  </script>
  
  <!-- 创建一个可以编辑的script脚本编辑框 -->
  <script type="text/javascript">
  function NewScriptText(){
	var html = '';
	html = $("#textareaId").val();
	$("#scriptId").html(html);
  }
//键盘监听事件
  document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
     if(e && e.keyCode==13){ // enter 键
          //要做的事情
    	 //NewScriptText();
     }
     if(e && e.keyCode==27){ // 按 Esc 
        //要做的事情
      }
    if(e && e.keyCode==113){ // 按 F2 
         //要做的事情
       }            
	}; 
//submitBtn 按钮事件
$(document).on("click","#submitBtn",function(){
	NewScriptText();
});

  </script>
  
  <div id="scriptId"></div>


<!-- 鼠标滑轮事件 
<script type="text/javascript">
var $ = function(id){ return document.getElementById(id)}

window.onload = function(){
  mouseScroll(function(delta){
    var obj = $('scroll'),
    current = parseInt(obj.offsetTop)+(delta*10);
    obj.style.top = current+"px";
  });
}

var mouseScroll = function(fn){
  var roll = function(){
    var delta = 0,
    e = arguments[0] || window.event;
    delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
    fn(delta);//回调函数中的回调函数
  }
  if(window.netscape ){
    document.addEventListener('DOMMouseScroll', roll, false);
  }else{
    document.onmousewheel = roll;
  }
}

</script>
<style title="text/css">
#scroll {
  color:#fff;
  background:#369;
  width:70px;
  height:70px;
  position:absolute;
  left:500px;
  top:200px;
}
</style>

<div id="scroll">请用鼠标滚轮移动方块</div>-->

<!-- 动态创建js代码 
<script type="text/javascript">
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
 
var script = 'http://coolshell.cn/asyncjs/alert.js';
loadjs(script);
</script>-->


<!-- we go on -->
<script type="text/javascript">


</script>


</html>
