var alarmBT={
	initTable:function(url,tableId){
	var table={};
	table=alarmBT.tableParam();
	table.ajax=alarmBT.tableAjax(path+url);
	table.columns=alarmBT.tableColumns();
	table.language=alarmBT.tableLanguage();
	console.log(table);
	$("#"+tableId).dataTable(table);	
	},
	tableParam:function(){
		var tableParam={};
		tableParam.autoWidth=false;
		tableParam.scrollCollapse=true;
		if(alarmParam=='alam_performance_config'){
			tableParam.bDestroy=true;
		}
		tableParam.serverSide=true;
		tableParam.processing=false;
		tableParam.pageLength=10;
		tableParam.searching=false;
		tableParam.ordering=false;
		tableParam.lengthChange=true;
		tableParam.paging=true;
		return tableParam;
	},
	tableLanguage:function(){
	 var tableLanguage={};
	 tableLanguage.lengthMenu='每页显示<select class="form-control input-sm">' + '<option value="5">5</option>' + '<option value="10">10</option>' + '<option value="20">20</option>' + '<option value="30">30</option>' + '<option value="40">40</option>' + '<option value="50">50</option>' + '</select>条记录';//左上角的分页大小显示。;
	 tableLanguage.processing="载入中";
	 tableLanguage.paginate= {//分页的样式文本内容。
             previous: "上一页",
             next: "下一页",
             first: "第一页",
             last: "最后一页"
         };
	 tableLanguage.zeroRecords="没有内容";
	 tableLanguage.info= '总共_PAGES_ 页，显示第_START_ 到第 _END_ ，共_TOTAL_ 条';
	 tableLanguage.infoEmpty="共0条记录";
	 return tableLanguage;
	},
	tableAjax:function(url){
	var ajax={//类似jquery的ajax参数，基本都可以用。
        type: "get",//后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
        url: url,
        dataSrc: "rows",//默认data，也可以写其他的，格式化table的时候取里面的数据
        data: function (d) {//d 是原始的发送给服务器的数据，默认很长。
            var param = alarmBT.getSearchParam();
            //var param={};
            param.offset = d.start;//开始的序号
            param.limit = d.length;//要取的数据的
            return param;//自定义需要传递的参数。
        }
    };	
	 return ajax;	
	},
	tableColumns:function(){
	 var columns=new Array();
	 columns["content_templet"]=[//对应上面thead里面的序列
	                {data:'id',width:'1%',render: function(data, type, full) {
	                        return "<input type='checkbox'  class='checkbox' name='numbers' id='ids' value='' />";
	                    }
	                },
	                {data: "name"},
	                /*{data: "content","render": function(data, type, full) {
	                	//var button=operatePermissionTableData('contactPerManage');
	                 var text=  controlTextContent(data,25);
	                	return text;
	                  }
	                },*/
	                {data: "username"},
	                {data: "datetime","render": function(data, type, full) { 
                    	return data.substring(0,19);
                    }	  	
	                },
	                {data: "type","render": function(data, type, full) {
	                	var types=["邮件","短信"];
	                	return types[data];
	                 }
	                	
	                },
	                { data: "id","render": function(data, type, full) {
	                	var button=operatePermissionTableData('contantTempManage');
	                  return button;
	                }
	                }
	            ];
	 columns["set_up"]=[//对应上面thead里面的序列
	         	    {data:'id',width:'1%',render: function(data, type, full) {
	    	          return "<input type='checkbox' class='checkbox'  name='numbers' id='ids' value='' />";
	    	         }
	    	        },
	    	        {data: "relay_name"},
	    	        {data: "relay_content","render": function(data, type, full) {
	    	                	//var button=operatePermissionTableData('contactPerManage');
	    	         var text=  controlTextContent(data,25);
	    	         return text;
	    	         }
	    	         },
	    	         {data: "creator"},
	    	         {data: "create_time","render": function(data, type, full) { 
	                    	return data.substring(0,19);
	                    }	
	   	             },
	    	         {data: "relay_type","render": function(data, type, full) {
	    	          var types=["邮件","短信"];
	    	          return types[data];
	    	          }
	    	          },
	    	          {data: "receives","render": function(data, type, full) {
	    	          return alarmBT.getReceives(full);
		    	       }
	    	           },
	    	          { data: "id","render": function(data, type, full) {
	    	          var button=operatePermissionTableData('alarmPassConfig');
	    	          return button;
	    	           }
	    	          }];
	 columns["alam_strategy"]=[//对应上面thead里面的序列
	   		         	    {data:'alarm_policy_id',width:'1%',render: function(data, type, full) {
	   		         	    return "<input type='checkbox' class='checkbox'  name='numbers' id='ids' value='' />";
	   		    	         }
	   		    	        },
	   		    	        {data: "alarm_policy_name"},
	   		    	        {data: "alarm_policy_type","render": function(data, type, full) {
	   		    	                	//var button=operatePermissionTableData('contactPerManage');
	   		    	        // var text=  controlTextContent(data,25);
	   		    	        	var types=["门限告警","梯度告警","持续告警"];
	   		    	         return types[data-1];
	   		    	         }
	   		    	         },
	   		    	         {data: "modify_time","render": function(data, type, full) {
		    	                	//var button=operatePermissionTableData('contactPerManage');
	 	   		    	        // var text=  controlTextContent(data,25);
	 	   		    	         return data.substring(0,data.length-2);
	 	   		    	         }
	   		    	        	
	   		    	         },
	   		    	         {data:'alarm_policy_id',"render": function(data, type, full) {
	   		    	          var button=operatePermissionTableData('alarmTacManage');
	   		    	          //详情页面
	   		    	         var   info='<a   data-toggle="modal" data-target="#policyDetail"   style="margin-left:5px;"   class="btn btn-info  btn-xs show_object_detail"  title="详情页面"> <span class="glyphicon  glyphicon-book" ></span></a>';
	   		    	          return button+info;
	   		    	           }
	   		    	        	 
	   		    	         }
	   		    	          ];
	 console.log(alarmParam);
	 columns["alam_performance"]=[//对应上面thead里面的序列
		   		         	    {data:'kpi_name',width:'1%',render: function(data, type, full) {
		   		         	    return "<input type='checkbox' class='checkbox'  name='numbers' id='ids' value='' />";
		   		    	         }
		   		    	        },
		   		    	        {data: "kpi_name"},
		   		    	        {data: "kpi_alias"},
		   		    	         {data: "kpi_unit" },
		   		    	         {data: "alarm_name" },
		   		    	         {data:'kpi_name',"render": function(data, type, full) {
		   		    	          var button=operatePermissionTableData('perfIndexManage');
		   		    	          return button;
		   		    	           }
		   		    	        	 
		   		    	         }
		   		    	          ];
	 columns["alam_performance_config"]=[//对应上面thead里面的序列
	                                           
	                                     { data: "kpi_name"},
	                                   
	                                     { data: "alarm_name"},
	                                     { data: "calendar_policy_name"},
	                                     { data: "device_uuid","render": function(data, type, full) { 
	                                    	  var button=operatePermissionTableData('perfIndexConfig');
	        		   		    	          return button;
	                                     }}
			   		    	          ];
	 
	 
	 
	 return columns[alarmParam];	
	}
	,
	getSearchParam:function(){
		var param={};
		var name=$("#keyword").val();
		//@wuwp 添加一个name参数 (对应的。xml中 参数是name) 
//		param.name = encodeURI(name);
//		if(alarmParam=='alam_performance_config'){
//		name=$("#device_uuid").val();
//		param.device_id=name;
//		}
		return param;
	},
	//点击查询按钮
	clickSearchBtn:function(btnId,tableId){
	$("#"+btnId).click(function(){
		$("#"+tableId).DataTable().draw();
	});	
	},
	//点击添加按钮
	clickAddBtn:function(){
	    var now=new Date().Format("yyyy-MM-dd hh:mm:ss");
		alarmBT.resetBtn();
		if(alarmParam=='content_templet'){
			$("#datetime").val(now);
			$("#username").val(userName);
			$("#editModalLabel").html("添加模板内容");	
			alarmBT.modelAllItem(null);
	   }
		if(alarmParam=='set_up'){
			$("#create_time").val(now);
			$("#creator").val(userName);
			$("#editModalLabel").html("添加告警前转");
			alarmBT.modelAllItem(null);
			
	   }
		if(alarmParam=='alam_strategy'){
		
			$("#editModalLabel").html("添加告警策略");	
	   }
		if(alarmParam=='alam_performance'){
			
			$("#editModalLabel").html("添加性能指标信息");
			$("#flag").val("add");
			$('#kpi_name').attr('readonly',false);
	   }
  if(alarmParam=='alam_performance_config'){
			
			$("#editModalLabel").html("添加性能配置信息");
			 findKpiNameList();
		
	   }
		
		$('#editModal').modal('toggle');
	},
	//点击编辑按钮
    clickEditBtn:function(tableId){
    	
    	$(document).on("click", ".show-detail-json", function () {//取出当前行的数据
            var full = $("#"+tableId).DataTable().row($(this).parents("tr")).data();
            alarmBT.resetBtn();
            if(alarmParam=='set_up'){
            alarmBT.modelAllItem(full);
            $("#id").val(full.id);
            //console.log("====="+full.creator);
            $("#create_time").val(full.create_time);
            $("#creator").val(full.creator);
            $("#relay_name").val(full.relay_name);
            $("#relay_sql").val(full.relay_sql);
            $("#relay_content").val(full.relay_content);
            $("#relay_type").val(full.relay_type);
            $("#title").val(full.title);
            $("#type"+full.relay_type).prop("checked",true);
            $("#type"+(1-full.relay_type)).prop("checked",false);
            //console.log(full.device_name);
            $("#device_name").val(full.device_name);
            $("#project_status").val(full.project_status);
            //console.log(full);
            $("#editModalLabel").html("编辑告警前转");
            }
            if(alarmParam=='content_templet'){
                $("#id").val(full.id);
                $("#datetime").val(full.datetime);
                $("#username").val(full.username);
                $("#name").val(full.name);
                $("#content").val(full.content);
                $("#type").val(full.type);
                $("#type"+full.type).prop("checked",true);
                $("#type"+(1-full.type)).prop("checked",false);
                alarmBT.modelAllItem(full);
                $("#editModalLabel").html("编辑模板内容");
                }
        	if(alarmParam=='alam_strategy'){
        		$("#alarm_policy_name").val(full.alarm_policy_name);
                $("#alarm_policy_id").val(full.alarm_policy_id);
                $("#alarm_policy_type").val(full.alarm_policy_type);
                $("#calendar_policy_id").val(full.calendar_policy_id);
                $("#alarm_policy_type_param").val(full.alarm_policy_type_param);
                $("#upper_one_operator").val(full.upper_one_operator);
                $("#upper_one_threshold").val(full.upper_one_threshold);
                $("#upper_one_level").val(full.upper_one_level);
                $("#upper_two_operator").val(full.upper_two_operator);
                $("#upper_two_threshold").val(full.upper_two_threshold);
                $("#upper_two_level").val(full.upper_two_level);
                $("#lower_one_operator").val(full.lower_one_operator);
                $("#lower_one_threshold").val(full.lower_one_threshold);
                $("#lower_one_level").val(full.lower_one_level);
                $("#lower_two_operator").val(full.lower_two_operator);
                $("#lower_two_threshold").val(full.lower_two_threshold);
                $("#lower_two_level").val(full.lower_two_level);
            	var val=$("#alarm_policy_type").val();
            	if(val==3){
            		 $(".form-group label[for='alarm_policy_type_param']").show();
            	      $(".form-group input[id='alarm_policy_type_param']").show();
            	}else{
            		 $(".form-group label[for='alarm_policy_type_param']").hide();
            	      $(".form-group input[id='alarm_policy_type_param']").hide();
            	}
                //$("#receives").val(null);
            	  $("#editModalLabel").html("编辑策略内容");
        	 }
        	if(alarmParam=='alam_performance'){
        		$("#flag").val("edit");
        		$("#kpi_name").val(full.kpi_name);
                $("#kpi_alias").val(full.kpi_alias);
                $("#kpi_unit").val(full.kpi_unit);
                $("#alarm_id").val(full.alarm_id);
                $('#kpi_name').attr('readonly',true);
                $("#editModalLabel").html("编辑性能指标");
    	   }
        	 if(alarmParam=='alam_performance_config'){
        		 $("#kpi_name").val(full.kpi_name);
        		 $("#kpi_name").html('<option value="'+full.kpi_name+'">'+full.kpi_name+'</option>'); 
        		
        		$("#alarm_id").val(full.alarm_id);
        		 $("#alarm_id").change();
        		  $("#device_uuid").val(full.device_uuid);
        		  $("#editModalLabel").html("编辑性能配置信息");
        		  
        	 }
        });	
	},
	resetBtn:function(){
	if(alarmParam=='content_templet'){
	$("#id").val("");
	$("#name").val("");
	$("#content").val("");
	$("#username").val("");
	$("#datetime").val("");
	$("#type").val("");
	 }
	if(alarmParam=='set_up'){
		$("#id").val(null);
        $("#create_time").val(null);
        $("#creator").val(null);
        $("#relay_name").val(null);
        $("#type").val(0);
        $("#relay_sql").val(null);
        $("#relay_content").val(null);
        $("#relay_type").val(null);
        $("#device_name").val(null);
        $("#project_status").val(null);
        $("#title").val(null);
        //$("#receives").val(null);
	 }
	if(alarmParam=='alam_strategy'){
		$("#alarm_policy_name").val(null);
        $("#alarm_policy_id").val(null);
        $("#alarm_policy_type").val(null);
        $("#calendar_policy_id").val(null);
        $("#alarm_policy_type_param").val(null);
        $("#upper_one_operator").val(null);
        $("#upper_one_threshold").val(null);
        $("#upper_one_level").val(null);
        $("#upper_two_operator").val(null);
        $("#upper_two_threshold").val(null);
        $("#upper_two_level").val(null);
        $("#lower_one_operator").val(null);
        $("#lower_one_threshold").val(null);
        $("#lower_one_level").val(null);
        $("#lower_two_operator").val(null);
        $("#lower_two_threshold").val(null);
        $("#lower_two_level").val(null);
        $("#userMsg").html(null);
        //$("#receives").val(null);
	 }
	if(alarmParam=='alam_performance'){
		$("#flag").val(null);
		$("#kpi_name").val(null);
        $("#kpi_alias").val(null);
        $("#kpi_unit").val(null);
        $("#alarm_id").val(null);
        $("#userMsg").html(null);
        $("#alarmDetail").html("");
   }
	if(alarmParam=='alam_performance_config'){
		$("#kpi_name").val(null);
		//findKpiNameList();
		$("#alarmDetail").html("");
        $("#alarm_id").val(null);
        $("#userMsg").html(null);
       // $("#device_uuid").val(null);
   }
	},
	subjectRadioChecked:function(){
		if($("#type0").prop("checked")){$("#type").val(0);}
		else{$("#type").val(1);}
	},
	submitForm:function(formId,url,tableId,modelId){
	 //点击保存按钮时
		if(alarmParam=='set_up'||alarmParam=='content_templet'){
	    $('#'+formId).submit(function () {
	    alarmBT.subjectRadioChecked();
	    //console.log("00000");
	    $.ajax({
	            cache: true,
	            type: "POST",
	            url:url,
	            data:$('#'+formId).serialize(),// 你的formid
	            async: false,
	            error: function(request) {
	             console.log("失败");
	            },
	            success: function(data) {
	            	$('#'+modelId).modal('toggle');
	            	$("#"+tableId).DataTable().draw();
	            	//清空数据
	            	
	            }
	         });
	        return false;
	    });  }
		if(alarmParam=='alam_strategy'){
			   $('#'+formId).submit(function () {
				   var name=$("#alarm_policy_name").val();
				   var id=$("#alarm_policy_id").val();
				  if(id==''){id=null;}
				   var obj=getData(url+'/findReaptObject/'+name+'/'+id);
				   if(obj!=''){
					   $("#alarm_policy_name").focus();
					   $("#userMsg").html("名称已存在");
					   $("#userMsg").css("color","red");
					   return false;
				   }
				   var val=$("#alarm_policy_type").val();
				 if(val==3){
					 var val2=$("#alarm_policy_type_param").val();
					if(val2==null||val2==''){
						$("#errorMsg").html("不能为空");
						$("#errorMsg").css("color","red");
						return false;
						
					} 
				 }
				    $.ajax({
				            cache: true,
				            type: "POST",
				            url:url,
				            data:$('#'+formId).serialize(),// 你的formid
				            async: false,
				            error: function(request) {
				             console.log("失败");
				            },
				            success: function(data) {
				            	$('#'+modelId).modal('toggle');
				            	$("#"+tableId).DataTable().draw();
				            	//清空数据
				            	
				            }
				         });
				        return false;
				    }); 
		}
		
		
		if(alarmParam=='alam_performance'){
		    $('#'+formId).submit(function () {
		    	  var flag=$("#flag").val();
				  if(flag=='add'){
				  var obj=getData(url+'/findReaptObject/'+name);
				   if(obj!=''){
					   $("#kpi_name").focus();
					   $("#userMsg").html("名称已存在");
					   $("#userMsg").css("color","red");
					   return false;
				   }
				  }
		    $.ajax({
		            cache: true,
		            type: "POST",
		            url:url,
		            data:$('#'+formId).serialize(),// 你的formid
		            async: false,
		            error: function(request) {
		             console.log("失败");
		            },
		            success: function(data) {
		            	$('#'+modelId).modal('toggle');
		            	$("#"+tableId).DataTable().draw();
		            	//清空数据
		            	
		            }
		         });
		        return false;
		    });  }
		if(alarmParam=='alam_performance_config'){
			
			 $('#'+formId).submit(function () {
		    	var val=$("#kpi_name").val();
				 if(val==null||val==''){
					 $("#kpi_name").focus();
					   $("#userMsg").html("性能指标名称不能为空");
					   $("#userMsg").css("color","red");
					 return false;
				 }
				 
		    $.ajax({
		            cache: true,
		            type: "POST",
		            url:url,
		            data:$('#'+formId).serialize(),// 你的formid
		            async: false,
		            error: function(request) {
		             console.log("失败");
		            },
		            success: function(data) {
		            	$('#'+modelId).modal('toggle');
		            	$("#"+tableId).DataTable().draw();
		            	//清空数据
		            	
		            }
		         });
		        return false;
		    });
		}
 },
 deleteObject :function(url0,tableId){
	var deleteurl="";
	 $(document).on("click","#del",function(e){
		 //console.log("执行");
		
         var full = $("#"+tableId).DataTable().row($(this).parents("tr")).data();
         if(alarmParam=='set_up'||alarmParam=='content_templet'){
        var url=path+url0;
         var x=full.id;
         url=url+"/"+x;
         alarmBT.deleteAjax(url,tableId);
         }
         else if(alarmParam=='alam_strategy'){
        	 var url=path+url0;
             var x=full.alarm_policy_id;
             url=url+"/"+x;
             alarmBT.deleteAjax(url,tableId);
         }
         else if(alarmParam=='alam_performance'){
        	 var url=path+url0;
             var x=full.kpi_name;
             console.log(url);
             url=url+"/"+x;
             alarmBT.deleteAjax(url,tableId);
         }
         else if(alarmParam=='alam_performance_config'){
        	 var url=path+url0;
        	  var x=full.kpi_name;
        	  var y=full.device_uuid;
              url=url+"/"+y+"/"+x;
              alarmBT.deleteAjax(url,tableId);
         }
         //console.log(url);
         
	 });
	 $(document).on("click","#delBatch",function(e){
		 //console.log("执行多选");
	     var ids=new Array();
	     //获取选中的复选框
	     var i=0;
	     $('input[name="numbers"]:checked').each(function(){
	         var full = $("#"+tableId).DataTable().row($(this).parents("tr")).data();
	         ids[i]=full.id;
	         i++;
	  }); 
	     
	     if(alarmParam=='set_up'||alarmParam=='content_templet'){
	         var url=path+url0;
	          url=url+'/deleteByIds/'+ids; 
	          if(ids.length >0 && ids != null){
	        	  alarmBT.deleteAjax(url,tableId);
	          }else{
	        	  bootbox.alert("请选择要删除的数据！");
	        	  return ;
	          }
	          }
	 });	 
 },deleteAjax:function(url,tableId){
	 bootbox.confirm('确定删除？',function(result) {
		 if (result) {
             $.ajax({
                 type: "DELETE",
                 url: url,
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 success: function (json) {
                     bootbox.alert("删除成功！");
                     $("#"+tableId).DataTable().draw();//点搜索重新绘制table。
                     if(alarmParam=='alam_performance_config'){
                    	 findKpiNameList();
                     }
                 },
                 error: function (msg) {
                     bootbox.alert(msg);
                 }
             });

         }else{}
     });  
    },
    modelAllItem:function(full){
	//所属业务
		var smodelAllItemHmtl = "";
		if(alarmParam=='content_templet'){
		var array=new Array();
		if(full!=null){
		array=full.content.split(",");}
		var itemArray =getData(path+'/jsp/alarm/data.json');
		for ( var i = 0; i < itemArray.length; i++) {
			smodelAllItemHmtl += '<option value="'+itemArray[i].value+' "';
			for(var j = 0; j < array.length; j++){
			var s=array[j].substring(0,array[j].length-1);
			s=s.substring(2,s.length);
			//console.log(itemArray[i].value.trim()==s.trim());
			if(itemArray[i].value.trim()==s.trim()){
			smodelAllItemHmtl +="selected";	
			}
			}
			smodelAllItemHmtl +='>' + itemArray[i].name+ '</option>';;	
		}
		//console.log(smodelAllItemHmtl);
		$("#items").html(smodelAllItemHmtl);
		}
		if(alarmParam=='set_up'){
			var itemArray =getData(path+'/rs/sys/contact/findAll');
			var users=new Array();
			if(full!=null&&full.receives!=null&&full.receives!=''){
				users=full.receives.split(",");
			}
			for ( var i = 0; i < itemArray.length; i++) {
				smodelAllItemHmtl += '<option value="'+itemArray[i].id+'"';
				for (var j = 0; j < users.length; j++) {
					if(users[j]==itemArray[i].id){
				  smodelAllItemHmtl +="selected=selected";
					}
				}
				smodelAllItemHmtl +='>' + itemArray[i].userName+ '</option>';
			}
			$("#items").html(smodelAllItemHmtl);
			var paramArray=getData(path+'/rs/alarm/btsu/findCAndDS');
			var device_location=paramArray.device_location;
			var dlHtml="";
			//var citys=full.device_location.split(",");
			for ( var i = 0; i < device_location.length; i++) {
				dlHtml += '<option value="'+device_location[i]+'"';
				if(full!=null){
				if(full.device_location!=null&&full.device_location.length>0){
					for (var j = 0; j < full.device_location.length; j++) {
						//console.log("----"+full.device_location[j]==device_location[i]);
						//console.log(full.device_location[j].replace("\"","").replace("\"",""));
						if(full.device_location[j]==device_location[i]){
							dlHtml +="selected=selected";
						}
					}	
				}
				}
				dlHtml += '>' + device_location[i]+ '</option>';
			}
			$("#device_location").html(dlHtml);
			var device_service=paramArray.device_service;
			var dsHtml="";
			
			for ( var i = 0; i < device_service.length; i++) {
				dsHtml += '<option value="'+device_service[i]+'"';
				if(full!=null){
				if(full.device_service!=null&&full.device_service.length>0){
					for (var j = 0; j < full.device_service.length; j++) {
						//console.log("----"+full.device_location[j].replace("\"","")==device_location[i]);
						//console.log(full.device_location[j].replace("\"","").replace("\"",""));
						if(full.device_service[j]==device_service[i]){
							dsHtml +="selected=selected";
						}
					}	
				}
				}
				dsHtml +='>' + device_service[i]+ '</option>';			
			}
			$("#device_service").html(dsHtml);
			var relay_content=getData(path+'/rs/alarm/btmc')["rows"];
			console.log(relay_content);
			var dcHtml="<option>请选择模板</option>";
			
			for ( var i = 0; i < relay_content.length; i++) {
				dcHtml += '<option value="'+relay_content[i].content+'"';
				if(full!=null){
				if(full.relay_content!=null&&full.relay_content!=''&&full.relay_content.trim()==relay_content[i].content.trim()+","){
				dcHtml +="selected=selected";
				}
				}
				dcHtml +='>' + relay_content[i].name+ '</option>';
			}
			$("#relay_content").html(dcHtml);
			var servity=["0级","一级","二级","三级"];
			var sHtml="";
			console.log(full);
			for ( var i = 1; i < servity.length; i++) {
				sHtml += '<option value="'+i+'"';
				if(full!=null){
				if(full.severity!=null){
					
				for (var j = 0; j < full.severity.length; j++) {
					//console.log("----"+full.device_location[j].replace("\"","")==device_location[i]);
					//console.log(full.device_location[j].replace("\"","").replace("\"",""));
					console.log("true"+full.severity[j]==i);
					if(full.severity[j]==i){
						sHtml +="selected=selected";
					}
				}
				}
				}
				sHtml +='>' +servity[i]+ '</option>';
			}
			$("#severity").html(sHtml);
		}
		if(alarmParam=='content_templet'){
		$('.selectpicker').on('change',
                function () {
		alarmBT.itemsSelectChange(full); 
                });
		}
		$('.selectpicker').selectpicker({
			'selectedText' : 'cat'
		}); 
	 
 },
 itemsSelectChange:function(full){
  var itmesArray=$("#items").val();
  //console.log(content);
  var html='';
  if(full!=null){
	  //html=full.content;
  }
  if(itmesArray!=null&&itmesArray.length>0){
	  for (var i = 0; i < itmesArray.length; i++) {
		html+='${'+itmesArray[i].trim()+'},';
	}  
  }
  $("#content").val(html);
 },
 whenModelClose:function(modelId){
	 $('#'+modelId).on('shown.bs.modal', function () {
		 $('.selectpicker').selectpicker('refresh');  
		});
 },
 getReceives:function(full){
	var arr=full.contacts; 
	console.log(full);
	var html="";
	if(arr!=null){
	for (var i = 0; i < arr.length; i++) {
		if(full.relay_type==0){
			html+=arr[i].userName+",";
		}
		if(full.relay_type==1){
			html+=arr[i].userName+",";
		}
	}
	}
	return html; 
 }
 
 };  

function openDetail(tableId){
	$(document).on("click",".show_object_detail",function(e){
		var types=["门限告警","梯度告警","持续告警"];
    	 var alarmTitle=["三级告警","二级告警","一级告警","四级告警"];
    	 var symbol=["大于","小于","等于","大于等于","小于等于"];
		 var full = $("#"+tableId).DataTable().row($(this).parents("tr")).data();
			$("#name_detail").html(full.alarm_policy_name);
            $("#type_detail").html(types[full.alarm_policy_type-1]);
            if(full.alarm_policy_type==3){
            	$("#count_detail_p").removeClass("hide");
            }
            $("#date_detail").html(full.calendar_policy_name);
            $("#count_detail").html(full.alarm_policy_type_param);
            var json=full;
            var h="";
        	if(json.upper_one_threshold!=null){
    			h+="<p>上门限一级阀值 发送"+alarmTitle[json.upper_one_level-2]+" 当KPI值 "+symbol[json.upper_one_operator-3]+json.upper_one_threshold+" 时生效 " +'</p>';
    		}
    		if(json.upper_two_threshold!=null){
    			h+="<p>上门限二级阀值 发送"+alarmTitle[json.upper_two_level-2]+" 当KPI值 "+symbol[json.upper_two_operator-3]+json.upper_two_threshold+" 时生效 "+'</p>';
    		}
    		if(json.lower_one_threshold!=null){
    			h+="<p>下门限一级阀值 发送"+alarmTitle[json.lower_one_level-2]+" 当KPI值 "+symbol[json.lower_one_operator-3]+json.lower_one_threshold+" 时生效  "+'</p>';
    		}
    		if(json.lower_two_threshold!=null){
    			h+="<p>下门限二级阀值 发送"+alarmTitle[json.lower_two_level-2]+" 当KPI值 "+symbol[json.lower_two_operator-3]+json.lower_two_threshold+" 时生效  "+'</p>';
    		}
    		 $("#config_detail").html(h);
            
	});
}

function checkAll() {
	$(document).on("click", ".checkboxAll", function () {
			var checkbox=new Array();
		    checkbox=$(".checkbox");
		  for (var i = 0; i < checkbox.length; i++) {
			$(checkbox[i]).prop('checked',this.checked);
			if(this.checked){
				$(checkbox[i]).parent().parent().addClass("selected");  
			}else{
				$(checkbox[i]).parent().parent().removeClass("selected");
			}
			
			
		}	
	});
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};