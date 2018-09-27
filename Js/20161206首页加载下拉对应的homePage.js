//===============加载页面==== 
  var winHeight=getPageHeight();
  var winWidth=getPageWidth();
  /*eacharts图背景色*/
  var eachartbeijingse = "#FFFFFF";
  /*定义两个变量*/
  var pageWidth ;
  var pageWidth2;
  var pageWidth3;
  var yuanPanel;
  /*解析linetypes*/
  var lineType=$.cookie("linetypes");
  var lineTypes=lineType.split(',');
  var productNo;
  $(function(){
	  /*三个工单数据*/
	  getSheets();
	  /*客户经理接数据*/
	  getChiefTechnicalManager();
	  
	  /*	
	  *		根据lineTypes数量 调整有滚动条的页面
	  *		 添加的eacharts图标个数是4时 刚好是第二行最后一个  	.0_0.
	  *
	  *		------后面修改成 底下有两行都会出滚动条---------↓
	  * 	两行不出滚动条时 数字是：4---------------↓
	  *		两行出滚动条时 数字是：2-----------↓
	  */
	  if(lineTypes.length>2){
	  	youGunDongTiao();
	  }else{
		wuGunDongTiao();		  
	  } 
	  
	  adaptiveHeight();
	  
	  /*初始化业务故障概况 ------------所有页面都有业务故障 .0_0.*/
	  //addPanel('yewuPanel',"业务与故障概况");
	  autoAddPanel(0,'yewuPanel',"<div style=\"float:left;\"><img src=\"images/homePage/GDLB.png\"></div>&nbsp;业务与故障概况");
	  /*加载业务故障eacharts图表*/
	  getBusinessAndAlarmChart();
	  /*
	   * 根据lineType 加载eacharts图表 
	   * 加载下拉控件：     autoAddPanel(i,id,title,flag) + zhuanxianTools(idFlag,typeFlag) 
	   * 不加载下拉控件：  autoAddPanel(i,id,title) 
	   */
	  $.each(lineTypes,function(i,o){
			switch(o){
				case '短信专线':
					autoAddPanel(i,'zhuanxianPanel'+(i+1),'<div style="float:left;"><img src="images/homePage/icon1.png"></div>'+'&nbsp;短信专线性能统计'+'<div style="float:right;"><img src="images/homePage/tip.png" id="smsLineId" title="所有专线中取平均值"></div>','smsLineId');
					zhuanxianTools('smsLineId','短信专线');
					getSMSChart('zhuanxianPanel'+(i+1));//短信专线性能图
					break;
				case 'GPRS专线':
					autoAddPanel(i,'zhuanxianPanel'+(i+1),'<div style="float:left;"><img src="images/homePage/icon1.png"></div>'+'&nbsp;GPRS专线性能统计'+'<div style="float:right;"><img src="images/homePage/tip.png" id="gprsLineId" title=""></div>','gprsLineId');
					zhuanxianTools('gprsLineId','GPRS专线');
					getGPRSChart('zhuanxianPanel'+(i+1));//GPRS专线性能图
					break;
				case '互联网专线':
					autoAddPanel(i,'zhuanxianPanel'+(i+1),'<div style="float:left;"><img src="images/homePage/icon1.png"></div>'+'&nbsp;互联网专线性能统计'+'<div style="float:right;"><img src="images/homePage/tip.png" id="netLineId" title="所有专线中取最大值"></div>','netLineId');
					zhuanxianTools('netLineId','互联网专线');
					getInternetChart('zhuanxianPanel'+(i+1));//互联网专线性能图
					break;
				case '语音专线':
					autoAddPanel(i,'zhuanxianPanel'+(i+1),'<div style="float:left;"><img src="images/homePage/icon1.png"></div>'+'&nbsp;语音专线性能统计'+'<div style="float:right;"><img src="images/homePage/tip.png" id="voiceLineId" title="所有专线求和"></div>');
					getVoiceChart('zhuanxianPanel'+(i+1));//语音专线性能图
					break;
				case '传输专线':
					autoAddPanel(i,'zhuanxianPanel'+(i+1),'<div style="float:left;"><img src="images/homePage/icon1.png"></div>'+'&nbsp;传输专线性能统计'+'<div style="float:right;"><img src="images/homePage/tip.png" id="transLineId" title="所有专线中取最大值"></div>','transLineId');
					zhuanxianTools('transLineId','传输专线');
					getTransChart('zhuanxianPanel'+(i+1));//传输专线性能图
					break;
				default:
					break;
			}
		});
	  //控制页面先加载js在展开页面,使页面看起来不会拉伸
	  $(".panelNorth").show();
  });
  /*加载页面方式1-------------------------个数在4个之内 页面样式变化*/
  function wuGunDongTiao(){
	  /*更改zhuanxianPanel的宽度*/
	  pageWidth = winWidth - 26;	
	  pageWidth2 = winWidth - 16;
	  pageWidth3 = winWidth;
	  yuanPanel = winWidth - 120;
	  /*工单信息样式调整*/
	  var leftPanel = ((winWidth-20)/2-60)/3;
	  var rightPanel = ((winWidth-20)/2-40)/3;
	  $("#kaitongPanel").width(leftPanel);
	  $("#tousuPanel").width(leftPanel);
	  $("#guzhangPanel").width(leftPanel);
	  $("#tuopuPanel").width(rightPanel);
	  $("#tuanduiPanel").width(rightPanel*2);
	  
	  /*页面链接、北部、中部panel样式调整*/
	  $(".locationLink").width(winWidth-8);
	  $(".panelNorth").width(winWidth-8);
	  $(".panelCenter").width(winWidth-6);
  }
  /*加载页面方式2-------------------------个数大于4个时滚动条出现并改变页面样式*/
  function youGunDongTiao(){
	  /*更改zhuanxianPanel的宽度*/
	  pageWidth = winWidth - 34;
	  pageWidth2 = winWidth - 40;
	  yuanPanel = winWidth - 140;
	  /*上方展示的工单信息样式调整*/
	  var leftPanel = ((winWidth-40)/2-60)/3;
	  var rightPanel = ((winWidth-40)/2-40)/3;
	  $("#kaitongPanel").width(leftPanel);
	  $("#tousuPanel").width(leftPanel);
	  $("#guzhangPanel").width(leftPanel);
	  $("#tuopuPanel").width(rightPanel);
	  $("#tuanduiPanel").width(rightPanel*2);
	  /*页面链接、北部、中部panel样式调整*/
	  $(".locationLink").width(winWidth-25);
	  $(".panelNorth").width(winWidth-25);
	  $(".panelCenter").width(winWidth-23);
	  
  }
  //页面如果采用简单的左右布局
  function pandingFloat(i,id,title,flag){
	  if((i+2)%2 == 0){
		  document.getElementById(id).style.cssFloat = "right";
	  }else{
		  document.getElementById(id).style.cssFloat = "left";
	  }
  }
  
 //首页采用复杂布局,根据加载的个数调整宽度和相对位置
  function autoAddPanel(i,id,title,flag){
	  var tools = '<div><div style="margin:-1px 20px;"><span style="color:#0e2d5f;font-weight:bold;line-height:16px;">专线列表:</span>'
			+'<select class="easyui-combobox" id="'+flag+'Tip" name="state" style="width:100px;">'
			+'</div></div>';
	  /*lineTypes.length=2*/
	  if(lineTypes.length == 2){
		  $('#'+id).panel({
			    width:pageWidth/3>375 ? pageWidth/3 : 375 ,
			    height:(addPanelHeight)>170 ? addPanelHeight : 170,
			    title:title,
			    tools: flag==null ? null : tools 
			}); 
		  document.getElementById("zhuanxianPanelOut1").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut1").style.marginLeft = "10px";
		  document.getElementById("zhuanxianPanelOut2").style.cssFloat = "right";
	  }
	  /*lineTypes.length=4*/
	  else if(lineTypes.length == 4){
		  if(i<1 || i>3){	//i=0
			  $('#'+id).panel({
				    width:pageWidth/2>375 ? pageWidth/2 : 375,
				    height:addPanelHeight>170 ? addPanelHeight : 170,
				    title:title,
				    tools: flag==null ? null : tools 
				});
		  }else{	//i=1/2/3
			  $('#'+id).panel({
				    width:pageWidth2/3>375 ? pageWidth2/3 : 375 ,
				    height:addPanelHeight>170 ? addPanelHeight : 170,
				    title:title,
				    tools: flag==null ? null : tools 
				});
		  }
		  document.getElementById("zhuanxianPanelOut1").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut1").style.marginLeft = "10px";  
		  document.getElementById("zhuanxianPanelOut2").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut3").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut3").style.marginLeft = "10px";
		  document.getElementById("zhuanxianPanelOut4").style.cssFloat = "right";
	  }
	  /*lineTypes.length=5 */
	  else if(lineTypes.length == 5){
		  $('#'+id).panel({
			    width:pageWidth/2>375 ? pageWidth/2 : 375,
			    height:addPanelHeight>170 ? addPanelHeight : 170,
			    title:title,
			    tools: flag==null ? null : tools 
			}); 
		  document.getElementById("zhuanxianPanelOut1").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut1").style.marginLeft = "10px"; 
		  document.getElementById("zhuanxianPanelOut2").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut3").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut3").style.marginLeft = "10px"; 
		  document.getElementById("zhuanxianPanelOut4").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut5").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut5").style.marginLeft = "10px";
	  }
	  /*lineTypes.length=0------------这种情况不存在 */
	  else if(lineTypes.length == 0){
		  $('#'+id).panel({
			    width:pageWidth3,
			    height:addPanelHeight,
			    title:title
			}); 
	  }
	  /*lineTypes.length=1 */
	  else if(lineTypes.length == 1){
		  if(lineTypes!=null && lineTypes!=""){
			  $('#'+id).panel({
				    width:pageWidth2/2>375 ? pageWidth2/2 : 375 ,
				    height:addPanelHeight>170 ? addPanelHeight : 170,
				    title:title,
				    tools: flag==null ? null : tools 
				}); 
			  document.getElementById("zhuanxianPanelOut1").style.cssFloat = "left"
			  document.getElementById("zhuanxianPanelOut1").style.marginLeft = "10px"; 
		  }else{
			  $('#'+id).panel({
				    width:pageWidth>375 ? pageWidth : 375 ,
				    height:addPanelHeight>170 ? addPanelHeight : 170,
				    title:title,
				    tools: flag==null ? null : tools 
				}); 
		  }
	  /*lineTypes.length=3 */ 
	  }else {
		  $('#'+id).panel({
			    width:pageWidth/2>375 ? pageWidth/2 : 375 ,
			    height:addPanelHeight>170 ? addPanelHeight : 170,
			    title:title,
			    tools: flag==null ? null : tools 
			}); 
		  document.getElementById("zhuanxianPanelOut1").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut1").style.marginLeft = "10px"; 
		  document.getElementById("zhuanxianPanelOut2").style.cssFloat = "left";
		  document.getElementById("zhuanxianPanelOut3").style.cssFloat = "left"
		  document.getElementById("zhuanxianPanelOut3").style.marginLeft = "10px"; 
	  }
  } 

  //重写tools
  function zhuanxianTools(idFlag,typeFlag){
	  var params = {};
	  var nowd = new Date();
	  nowd.setHours(nowd.getHours()-1);
	  params.businessType = typeFlag;
	  var url = Query_URL + '/resource/service/get/0/5?token='+$.cookie("token");
	  var data = getData("post",url,params);	
	  if(data.total!=0){
		  var html = '';
		  for(var i=0;i<data.rows.length;i++){
		   	html += '<option value="'+data.rows[i].productNo+'">'+data.rows[i].productName+'</option>';
		  }
	  	  $("#"+idFlag+"Tip").html(html);
		  productNo = data.rows[0].productNo;
	  }
	  $("#"+idFlag).attr("title",data.rows[0].productName);
  }
  
  //互联网专线添加tools
  /*function zhuanxianTools(){
	  var params = {};
	  var nowd=new Date();
	  nowd.setHours(nowd.getHours()-1);
	  //params.endDate =nowd.format("yyyy-MM-dd hh:mm:ss");
	  //params.openDate =getNowTime();//frontd.format("yyyy-MM-dd hh:mm:ss");
	  //params.timeType='hour';
	  params.businessType = "互联网专线";
	  var url = Query_URL + '/resource/service/get/0/20?token='+$.cookie("token");
	  var data = getData("post", url, params);
	  if(data.total!=0){
		  var html = '';
		  for(var i=0;i<data.rows.length;i++){
		   	html += '<option value="'+data.rows[i].productNo+'">'+data.rows[i].productName+'</option>';
		  }
		  $("#state").html(html);
		  productNo = data.rows[0].productNo;
		  //动态改表互联网专线的图片的提示
		  $("#netLineId").attr("title",data.rows[0].productName);
	  }
  }*/
  
  //专线下拉选择事件
  $(document).on('change',function(val){
	var tipId = val.srcElement.id;
	productNo = $('#'+tipId).val();
	switch(tipId){
	case 'netLineIdTip'://互联网专线
		getInternetChart('zhuanxianPanel'+(lineTypes.indexOf('互联网专线')+1));
		$("#netLineId").attr("title",$('#netLineIdTip').find("option:selected").text());
		break;
	case 'smsLineIdTip'://短信专线
		getSMSChart('zhuanxianPanel'+(lineTypes.indexOf('传输专线')+1));
		$("#smsLineId").attr("title",$('#smsLineIdTip').find("option:selected").text());
		break;
	case 'gprsLineIdTip'://GPRS专线
		getGPRSChart('zhuanxianPanel'+(lineTypes.indexOf('GPRS专线')+1));
		$("#gprsLineId").attr("title",$('#gprsLineIdTip').find("option:selected").text());
		break;
	case 'transLineIdTip'://传输专线
		getTransChart('zhuanxianPanel'+(lineTypes.indexOf('传输专线')+1));
		$("#transLineId").attr("title",$('#transLineIdTip').find("option:selected").text());
		break;
	default:
		break;
	}
  });	
  /* 只能在$(function(){});初始化后起作用，而且加载控件效果不佳*/
  /* $('#state').combobox({
		onChange: function(newVal,oldVal){
			productNo = newVal;
			getInternetChart('zhuanxianPanel'+(lineTypes.indexOf('互联网专线')+1));
      }
	});*/
  /*动态改变页面的高度*/
  function adaptiveHeight(){
  	var pageRate = 5/21;
  	//var pageHeight = winHeight - 62;		
  	/*
  	*		-----当下面出现两行时 就出现滚动条------↓
  	*/
  	var pageHeight = winHeight;
  	$(".panelNorth").css("height",pageHeight*pageRate);
  	$("#kaitongPanel").css("height",(pageHeight*pageRate)-40);	
  	$("#tousuPanel").css("height",(pageHeight*pageRate)-40);	
  	$("#guzhangPanel").css("height",(pageHeight*pageRate)-40);	
  	$("#tuanduiPanel").css("height",(pageHeight*pageRate)-40);	
  	$("#tuopuPanel").css("height",(pageHeight*pageRate)-40);
  	/*修改团队服务列高度*/
  	$("#table2 td").css("height",((pageHeight*pageRate)-40)/3);	
  	/*
  	*	当添加eacharts的个数是1/2个时 都在第一行显示
  	* 	当添加eacharts的个数是大于2个时 在第二行显示，等于5时显示3行
  	*/
  	if(lineTypes.length>2){
  		addPanelHeight = pageHeight*(1-pageRate)/2;
  	}else{
  		//addPanelHeight = pageHeight*(1-pageRate);
  		/*
  		*		-----由于两行出滚动条，修改一行时的高度------↓
  		*/
  		addPanelHeight = pageHeight*(1-pageRate)-162;
  	}
  }
  
//==================业务与故障概况=====
var colorData = ["#0077C9","#00BD5B","#9FDA5A","#FE8915","#FED519","#00BAF7"];
//获取数据对象
function getReport(){
	var datas;
	$.ajax({
		cache:false,
		type: "get",
		url:Query_URL+'/index/part/report?token='+$.cookie("token"),
		async: false,
		error: function(request) {
			alert("数据加载失败！");
		},
		success: function(data) {
			datas = data.rows;
		}
	});
	if(datas !=null && datas != ""){
		return datas;
	}else{
		return dataReport.rows;
	}
}
//数据格式转换
var fYMax=0,sYMax=0;
function dataTran(json,flag){
	var jsonA = [];
	var jsonB;
	for(var i=0;i<json.length-1;i++){
		switch(flag){
		case "data": 	//对应的数据
			if(json[i].serviceCount>fYMax){
				fYMax=json[i].serviceCount;
			}
			if(json[i].alarmCount>sYMax){
				sYMax=json[i].alarmCount;
			}
			jsonB =
			[json[i].type,
			{"value":json[i].serviceCount,
				"itemStyle":{
				"normal":{"color":colorData[i]}
				}
			},{"value":json[i].alarmCount,
				"itemStyle":{
				"normal":{"color":colorData[5]}
				}
			}];
			break;
		case "type":	//对应的类型
			jsonB = json[i].type;
			break;
		default:
			break;
		} 
		jsonA.push(jsonB);
	}
	switch(flag){
	case "data":
		break;
	case "type":
		jsonA.push("告警");
		break;
	case "color":
		jsonA.push("#00BAF7");
		break;
	default:
		break;
	}
	return jsonA;
}

//======================================加载概况Eachart图表=====================================//
function getBusinessAndAlarmChart(){
	var data1 = getReport();
	var myChart = echarts.init(document.getElementById('yewuPanel'));         //对应的控件ID
	var height = $('#yewuPanel').height()-80;
	var width = $('#yewuPanel').width()-190;
	var data = dataTran(data1,"data");		
	var cateData = dataTran(data1,"type");
	var fInterval=1;
	if(fYMax>5){
		fInterval=Math.ceil(fYMax/5);
	}
	var sInterval=1;
	if(sYMax>5){
		sInterval=Math.ceil(sYMax/5);
	}
	
	var itemStyle={
		normal:{
			barBorderRadius:[8,8,0,0]
		},
		emphasis:{
			barBorderRadius:[8,8,0,0]
		}
	};
	
	option = {
		backgroundColor: eachartbeijingse,
	    tooltip: {
	        trigger: 'axis',
	        formatter: "{b}<br/>{a0}:{c0}条<br/>{a1}:{c1}条"
	    },
	    title : {
    	    left:0,
    	    top:70,
    	    text: '业务总数：'+data1[data1.length-1].serviceCount+' 条\n\n'+'告警总数：'+data1[data1.length-1].alarmCount+' 条',
    	    textStyle: {
    			fontSize: 12,
    			fontStyle: 'normal',
    			fontWeight: 'normal'
    	    }
    	},
	    legend: {
	    	top:20,
	    	left:0,
	    	orient:'vertical',
	        data:['业务量', '告警量']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: cateData
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: '业务量(条)',
	            nameLocation:'end',
	            interval:fInterval,
	            minInterval: 1,
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2]
	        },
	        {
	            type: 'value',
	            scale: true,
	            name: '告警量(条)',
	            nameLocation:'end',
	            interval:sInterval,
	            minInterval: 1,
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2]
	        }
	    ],
	    grid: {
	        //width:'65%',//188+
	    	width: width,
	        height:height,
	        x:140,
	        y:50
        },
	    series: [
	        {
	            name:'业务量',
	            type:'bar',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            itemStyle:itemStyle,
	            barWidth: "35",
	            label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
	            data:data.map(function (item) {
	                return item[1];
	            })
	        },
	        {
	            name:'告警量',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 1,
	            smooth:true,
	            data:data.map(function (item) {
	                return item[2];
	            }),
	            itemStyle : {  
	            	normal : {  
	            	    color:'#FF9966',  
	            	    lineStyle:{  
	            	        color:'#FF9966'  
	            	    }  
	            	}  
	            }
	        }
	    ]
	};
	
	
	myChart.setOption(option);
	
	myChart.on('click',function(params){
		if(params.seriesType=="line"){
			getBar.addAlarmlWin(params.name);
		}
	});
	myChart.on('click',function(params){
		if(params.seriesType=="bar"){
			getBar.addDetailWin(params.name);
		}
	});
}
//业务与故障概况  钻取
var getBar = {
	//打开专线详情的窗口
	addDetailWin: function(businessType){
		$("#addDetailWin").window({ 
			title:"<span style='color:red;'>"+businessType+"</span>"+'--结果列表',
			width:document.body.clientWidth,
        	height:document.body.clientHeight,
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			maximized:false,			//最大化
			resizable:false,
			draggable:false,
			content:'<div id="tt" class="easyui-tabs" border="false" fit="true" >'+
			'<iframe frameborder="0" src="jsp/generalSituation/generalDetails.jsp?businessType='+encodeURIComponent(encodeURIComponent(businessType))+'" style="width:100%;height:100%;overflow:hidden;" ></iframe>'+
			'</div>'
		});		
	},
	//打开告警列表的窗口
	addAlarmlWin: function(businessType){
		$("#addDetailWin").window({ 
			title:"<span style='color:red;'>"+businessType+"</span>"+'--告警列表',
			width:document.body.clientWidth,
        	height:document.body.clientHeight,
			modal:true,
			collapsible:false,
			minimizable:false,
			maximizable:false,
			maximized:false,			//最大化
			resizable:false,
			draggable:false,
			content:'<div id="tt" class="easyui-tabs" border="false" fit="true" >'+
			'<iframe frameborder="0" src="jsp/generalSituation/generalAlarm.jsp?businessType='+encodeURIComponent(encodeURIComponent(businessType))+'" style="width:100%;height:100%;overflow:hidden;" ></iframe>'+
			'</div>'
		});	
	}
	
}



//============================专线Eacharts图表================
//获取传输专线数据
function getTransChartDate(){
	var params = {};
	var nowd=new Date();
	nowd.setHours(nowd.getHours()-1);
	params.timeStampEnd =nowd.format("yyyy-MM-dd hh:mm:ss");
	params.timeStamp =getNowTime();//frontd.format("yyyy-MM-dd hh:mm:ss");
	params.productNo = productNo;
	var url = Query_URL + '/perf/trans/header?token='+$.cookie("token");
	var data = getData("post", url, params);
	return data.rows;
}
//传输专线数据转换
function getTransChartFormatData(datas){
	var result=[];
	var times=[];
	var counts=[];//计费时长
	var succ=[];//计费时长
	if(datas!=null){
		$.each(datas,function(i,o){
			times.push(o.collecttime==null?null:o.collecttime.substring(5,16));
			counts.push(o.aethUtility);/*A端带宽利用率*/
			succ.push(o.aethRxoctets);/*A端流入流量*/
		});
	}
	result.push(times);
	result.push(counts);
	result.push(succ);
	return result;
}
//传输专线性能图
function getTransChart(domId){
	var data1 = getTransChartDate();
	var result=getTransChartFormatData(data1);
	var myChart = echarts.init(document.getElementById(domId));         //对应的控件ID
    //var height=$('#'+domId).height()*0.49;
	var height = $('#'+domId).height() - 80;
	var width = $('#'+domId).width() - 100;
    option = {
    	backgroundColor: eachartbeijingse,	
	    tooltip: {
	        trigger: 'axis'
	    },
	    grid : {
		    //width:'80%',
	    	width: width,
		    height:height,
		    x:50,
		    y:50
	    },
	    legend: { 
	    	data:['流量(MB)','带宽利用率(%)']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: result[0]
	        }
	    ],
	    yAxis: [
	    	{
	            type: 'value',
	            scale: true,
	            name: '流量(MB)',
	            min: 0
	        },
	        {
	            type: 'value',
	            scale: true,
	            name: '带宽利用率(%)',
	            max: 100,
	            min: 0,
	            boundaryGap: [0.2, 0.2],
	            axisLabel:{
	            	formatter: '{value}%'
	            }
	        }
	    ],
	    series: [
	    	{
	            name:'流量(MB)',
	            type:'bar',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            smooth:true,
	            data:result[2],
	            itemStyle : {  
	            	normal : {  
	            	    color:'#996699',  
	            		barBorderRadius:[2,2,0,0]
	            	    /*lineStyle:{  
	            	        color:'#996699'  
	            	    } */ 
	            	} 
	            	,emphasis:{
						barBorderRadius:[2,2,0,0]
					}   
	            }
	        },
	        {
	            name:'带宽利用率(%)',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 1,
	            smooth:true,
	            data:result[1],
	            itemStyle : {  
	            	normal : {  
	            	    color:'#FF9933',  
	            	    lineStyle:{  
	            	        color:'#FF9933'  
	            	    }  
	            	}  
	            }
	        }
	    ]
	};
    myChart.setOption(option);
}

//获取语音专线数据
function getVoiceChartDate(){
	var params = {};
	/*前六个月的数据*/
	var nowd=new Date();
	var frontd = new Date;
	nowd.setDate(nowd.getDate());
	params.timeStampEnd =nowd.format("yyyy-MM-dd hh:mm:ss");
	frontd.setDate(frontd.getDate()-6*30);
	params.timeStamp =frontd.format("yyyy-MM-dd hh:mm:ss");
	
	var url = Query_URL + '/perf/speech/chaLen/0/20?token='+$.cookie("token");
	var data = getData("post", url, params);
	return data.rows;
}
//语音数据格式转换
function getVoiceChartFormatData(datas){
	var result=[];
	var times=[];
	var counts=[];//计费时长
	var succ=[];//计费时长
	if(datas!=null){
		$.each(datas,function(i,o){
			times.push(o.timeStamp==null?null:o.timeStamp.substring(0,7));
			counts.push(o.chargeLength);
			succ.push(o.chargeLength);
		});
	}
	result.push(times);
	result.push(counts);
	result.push(succ);
	return result;
}
//语音专线性能图
function getVoiceChart(domId){
    var data1 = getVoiceChartDate();
    var result=getVoiceChartFormatData(data1);
	var myChart = echarts.init(document.getElementById(domId));           //对应的控件ID
	//var height=$('#'+domId).height()*0.49;
	var height = $('#'+domId).height() - 80;
	var width = $('#'+domId).width() - 100;
    option = {
    	backgroundColor: eachartbeijingse,
	    tooltip: {
	        trigger: 'axis'
	    },
	    grid : {
		    //width:'80%',
	    	width:width,
		    height:height,
		    x:50,
		    y:50
	    },
	    legend: { 
	    	data:['计费时长(分钟)']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: result[0],
	            /*字体倾斜，字体样式*/
	            axisLabel : {
	            	rotate: 30,
	            	textStyle: {
	                    //color: 'blue',
	                    //fontFamily: 'sans-serif',
	                    fontSize: 9
	                    //fontStyle: 'italic',
	                    //fontWeight: 'bold'
	                }
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: '计费时长(分钟)',
	            min: 0,
	            boundaryGap: [0.2, 0.2]
	        }
	    ],
	    series: [
	        {
	            name:'计费时长(分钟)',
	            type:'bar',
	            smooth:true,
	            barWidth: "35",
	            data:result[1],
	            itemStyle : {  
	            	normal : {  
	            	    color:'#33CCCC',  
	            		/*圆角*/
	            		barBorderRadius:[8,8,0,0]
	            	    /*lineStyle:{  
	            	        color:'#33CCCC'  
	            	    }  */
	            	}/*圆角*/
	        		,emphasis:{
						barBorderRadius:[8,8,0,0]
					}  
	            }
	        }
	    ]
	};

    myChart.setOption(option);
}
//短信专线性能图
function getSMSChartData(){
	var params = {};
	var nowd=new Date();
	nowd.setHours(nowd.getHours()-1);
	params.endTime =nowd.format("yyyy-MM-dd hh:mm:ss");
	params.startTime =getNowTime();//frontd.format("yyyy-MM-dd hh:mm:ss");
	params.timeType='hour';
	params.productNo = productNo;
	/*params.startTime = getStartTime((new Date().addDays(-8)).format('yyyy-MM-dd hh:mm:ss'),'day');
	params.endTime = getEndTime((new Date().addDays(-7)).format('yyyy-MM-dd hh:mm:ss'),'day');*/
	
	var url = Query_URL + '/perf/sms/header/get?token='+$.cookie("token");
	var data = getData("post", url, params);
	return data.rows;
}
function getSMSChartFormatData(datas){
	var result=[];
	var times=[];
	var counts=[];//短信发送量
	var succ=[];//短信发送成功率
	if(datas!=null){
		sYMax = 0;
		$.each(datas,function(i,o){
			if(o.downSubmitTotalCount>sYMax){
				sYMax=o.downSubmitTotalCount;
			}
			times.push((o.startTime).substring(5,13)+'点');
			counts.push(o.downSubmitTotalCount);
			succ.push(o.sucDownSubmitUtil);
		});
	}
	result.push(times);
	result.push(counts);
	result.push(succ);
	return result;
}

function getSMSChart(domId){
	var datas = getSMSChartData();
	var result=getSMSChartFormatData(datas);
	var myChart = echarts.init(document.getElementById(domId));           //对应的控件ID
	//var height=$('#'+domId).height()*0.49;
	var height = $('#'+domId).height() - 80;
	var width = $('#'+domId).width() - 100;
	var sInterval=1;
	if(sYMax>5){
		sInterval=Math.ceil(sYMax/5);
	}
	option = {
		backgroundColor: eachartbeijingse,
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	    	data: ['发送量(条)','发送成功率(%)']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: result[0]
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: '发送量(条)',
	            nameLocation:'end',
	            interval:sInterval,
	            minInterval:1,
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2]
	        },
	        {
	            type: 'value',
	            scale: true,
	            name: '发送成功率(%)',
	            nameLocation:'end',
	            max: 100,
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2],
	            axisLabel:{
	            	formatter: '{value}%'
	            }
	        }
	    ],
	    grid: {
	        //width:'80%',
	    	width: width,
	        height:height,
	        x:50,
	        y:50
        },
	    series: [
	        {
	            name:'发送量(条)',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            smooth:true,
	            itemStyle : {  
	            	normal : {
	            	    color:'#0077C9',
	            		areaStyle: {type: 'default'}
	            	}  
	            },
	            data:result[1]
	            
	        },
	        {
	            name:'发送成功率(%)',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 1,
	            smooth:true,
	            itemStyle: {
	            	normal: {
	            		color:'#9FDA5A',
	            		areaStyle: {
	            			type: 'default'
	            		}
	            	}
	            },
	            data:result[2]
	        }
	    ]
	};
	
    myChart.setOption(option);
}

//GPRS专线性能图
function getGPRSChartData(){
	var params = {};
	var endT=new Date();
	endT.setHours(endT.getHours()-1);
	//params.startTimeEnd =endT.format("yyyy-MM-dd hh:mm:ss");
	//params.starttime =getNowTime();//nowd.format("yyyy-MM-dd hh:mm:ss");
	params.timeType='hour';
	params.timeStamp = getNowTime();
    params.endDate = endT.format("yyyy-MM-dd hh:mm:ss");
    console.log(getNowTime());
    console.log(endT.format("yyyy-MM-dd hh:mm:ss"));
	
	//params.productNo = productNo;
	//var url = Query_URL + '/perf/gprs/info/get?token='+$.cookie("token");
	var url = Query_URL + '/perf/gprs/get/1/1000?token='+$.cookie("token");
	var data = getData("post", url, params);
	console.log(data);
	return data.rows;
}
function getGPRSChartFormatData(datas){
	var result=[];
	var times=[];
	var utility=[];//PDP激活成功率
	var zaixianyonghu=[];
	if(datas!=null){
		sYMax = 0;
		$.each(datas,function(i,o){
			if(o.apnOnlineTermUserCnt>sYMax){
				sYMax=o.apnOnlineTermUserCnt;
			}
			times.push((o.starttime).substring(5,16));
			utility.push(o.succ4gRate);
			zaixianyonghu.push(o.apnOnlineTermUserCnt);
		});
	}
	result.push(times);
	result.push(utility);
	result.push(zaixianyonghu);
	return result;
}
function getGPRSChart(domId){
	var datas=getGPRSChartData();
	var result=getGPRSChartFormatData(datas);
	
    var myChart = echarts.init(document.getElementById(domId));         //对应的控件ID
    //var height=$('#'+domId).height()*0.49;
    var height = $('#'+domId).height() - 80;
	var width = $('#'+domId).width() - 135;
	var sInterval=1;
	if(sYMax>5){
		sInterval=Math.ceil(sYMax/5);
	}
    option = {
    	backgroundColor: eachartbeijingse,
	    tooltip: {
	        trigger: 'axis'
	    },
	    grid : {
		    //width:'80%',
	    	width: width,
		    height:height,
		    x:60,
		    y:50
	    },
	    legend: { 
	    	data:['PDP激活成功率(%)','在线用户数']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: result[0]
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: 'PDP激活成功率(%)',
	            nameLocation:'end',
	            max: 100,
	            min: 0,
	            boundaryGap: [0.2, 0.2],
	            axisLabel:{
	            	formatter: '{value}%'
	            }
	        },{
	            type: 'value',
	            scale: true,
	            name: '在线用户数',
	            nameLocation:'end',
	            interval:sInterval,
	            minInterval:1,
	            min: 0/*,
	            boundaryGap: [0.2, 0.2]*/
	        }
	    ],
	    series: [
	        {
	            name:'PDP激活成功率(%)',
	            type:'line',
	            smooth:true,
	            data:result[1],
	            itemStyle : {  
	            	normal : {  
	            	    color:'#FFCC66',  
	            	    lineStyle:{  
	            	        color:'#FFCC66'  
	            	    }  
	            	}  
	            }
	        },{
	            name:'在线用户数',
	            type:'bar',
	            smooth:true,
	            data:result[2],
	            /*指定对应轴*/
	            xAxisIndex: 0,
	            yAxisIndex: 1,
	            itemStyle : {  
	            	normal : {  
	            	    color:'#9FDA5A',  
	            		/*圆角*/
	            		barBorderRadius:[5,5,0,0],
	            	    lineStyle:{  
	            	        color:'#9FDA5A'  
	            	    }  
	            	}/*圆角*/
	        		,emphasis:{
						barBorderRadius:[5,5,0,0]
					}  
	            }
	        }
	    ]
	};

    myChart.setOption(option);
}

//互联网专线性能图
function getInternetChartData(){
	var params = {};
	var nowd=new Date();
	nowd.setHours(nowd.getHours()-1);
	params.endDate =nowd.format("yyyy-MM-dd hh:mm:ss");
	params.startDate =getNowTime();//frontd.format("yyyy-MM-dd hh:mm:ss");
	params.productNo=productNo;
	params.timeType='hour';
	
	var url = Query_URL + '/perf/net/get/0/20?token='+$.cookie("token");
	var data = getData("post", url, params);
	return data.rows;
}
function getInternetChartFormatData(datas){
	var result=[];
	var times=[];
	var inflow=[];//上行流量
	var outflow=[];//下行流量
	if(datas!=null){
		$.each(datas,function(i,o){
			times.push(o.timeStamp);
			inflow.push(o.portIn);
			//outflow.push(o.portOut);
			outflow.push(o.aethUtility);  /*带宽利用率*/
		});
	}
	result.push(times);
	result.push(inflow);
	result.push(outflow);
	return result;
}
function getInternetChart(domId){
    var datas = getInternetChartData();
    var result=getInternetChartFormatData(datas);
	var myChart = echarts.init(document.getElementById(domId));           //对应的控件ID
	//var height=$('#'+domId).height()*0.6;
	var height = $('#'+domId).height() - 80;
	var width = $('#'+domId).width() - 100;
	/*var fInterval=1;
	if(fYMax>5){
		fInterval=Math.ceil(fYMax/5);
	}
	var sInterval=1;
	if(sYMax>5){
		sInterval=Math.ceil(sYMax/5);
	}*/
	option = {
		backgroundColor: eachartbeijingse,
	    tooltip: {
	        trigger: 'axis'
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            data: result[0]
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: '流入流量(MB)',
	            nameLocation:'end',
	            /*interval:fInterval,
	            minInterval: 1,
	            nameTextStyle:{
	            	fontSize:12,
	            	fontFamily:'宋体'
	            },*/
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2]
	        },
	        {
	            type: 'value',
	            scale: true,
	            name: '带宽利用率(%)',
	            nameLocation:'end',
	            /*interval:sInterval,
	            minInterval: 1,
	            nameTextStyle:{
	            	fontSize:12,
	            	fontFamily:'宋体'
	            },
	            nameGap:30,*/
	            max: 100,
	            min: 0,
	            splitLine: {
	                show: false
	            },
	            boundaryGap: [0.2, 0.2],
	            axisLabel:{
	            	formatter: '{value}%'
	            }
	        }
	    ],
	    grid: {
	        //width:'75%',
	    	width:width,
	        height:height,
	        x:50,
	        y:50
        },
        legend: { 
	    	data:['流入流量(MB)','带宽利用率(%)']
	    },
	    series: [
	        {
	            name:'流入流量(MB)',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            smooth:true,
	            itemStyle : {  
	            	normal : {  
	            	    color:'#5ABE86',  
	            	    lineStyle:{  
	            	        color:'#5ABE86'  
	            	    }  
	            	}  
	            },
	            data:result[1]
	        },
	        {
	            name:'带宽利用率(%)',
	            type:'line',
	            xAxisIndex: 0,
	            yAxisIndex: 1,
	            smooth:true,
	            itemStyle : {  
	            	normal : {  
	            	    color:'#FEC200',  
	            	    lineStyle:{  
	            	        color:'#FEC200'  
	            	    }  
	            	}  
	            },
	            data:result[2]
	        
	        }
	    ]
	};
    myChart.setOption(option);                                               //添加对应的数据 option
}


//======================================页面使用的方法=========================================//
//工单 table 对应的点击事件 跳转到工单查询页面 
$(document).on("click","#tabEastBtn", function(){//故障工单
	//window.location.href="jsp/massageInquire/mfun_sheet_query.jsp";
	window.location.href="jsp/workSheet/mfunSheet.jsp";
});
$(document).on("click","#tabCenterBtn", function(){//开通工单
	//window.location.href="jsp/massageInquire/worksheetInquire.jsp";
	window.location.href="jsp/workSheet/openSheet.jsp";
});
$(document).on("click","#tabWestBtn", function(){//投诉工单
	//window.location.href="jsp/massageInquire/complaint_sheet_query.jsp";
	window.location.href="jsp/workSheet/complaintSheet.jsp";
});
$(document).on("click","#tuopuPanel", function(){//tuopu查询
	//window.location.href="http://10.40.107.154:8080/LcmTopo/LcmTopo.jsp?token="+$.cookie("token");
	parent.$("#topo").click();
});
//工单统计
function getSheets(){
	$.ajax({
	    url: Query_URL+"/index/part/order?token="+$.cookie("token"),
	    type:'GET',
	    cache:false,
	    contentType:'application/json',//传参的类型
	    error:function(response){
	    	alert('查询失败，'+response.responseText);
	    },
	    success:function(response){
	    	$('#complainOrderCount').text(response.complainOrderCount);
	    	$('#complainOrderDealing').text(response.complainOrderDealing);
	    	$('#alarmOrderTimeout').text(response.alarmOrderTimeout);
	    	$('#alarmOrderCount').text(response.alarmOrderCount);
	    	$('#alarmOrderDealing').text(response.alarmOrderDealing);
	    	$('#complainOrderTimeout').text(response.complainOrderTimeout);
	    	//开通工单接数据
	    	$('#openOrderTimeout').text(response.openOrderTimeout);
	    	$('#openOrderDealing').text(response.openOrderDealing);
	    	$('#openOrderCount').text(response.openOrderCount);
	    }
	});
}
//获得首席技术经理
function getChiefTechnicalManager(){
	$.ajax({
	    url: Query_URL+"/index/part/user?token="+$.cookie("token"),
	    type:'GET',
	    cache:false,
	    contentType:'application/json',//传参的类型
	    error:function(response){
	    	alert('查询失败，'+response.message);
	    },
	    success:function(response){	  	 
	    	if(response!=null&&response.entity!=null){
	    		$('#marketingManager').text(response.entity.marketingManager);
		    	$('#marketingPhone').text(response.entity.marketingPhone);	  
		    	$('#techManager').text(response.entity.techManager==null?"":response.entity.techManager);
		    	$('#techMangerPhone').text(response.entity.techMangerPhone==null?"":response.entity.techMangerPhone);	  
	    	}
	    }
	});
}
