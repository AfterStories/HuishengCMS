/**
 * jquery ajax分页插件
 * 实现功能：
 * 1、一次性把数据加载到页面内存，在页面进行分页。
 * 2、使用jquery的ajax每次从服务器取数据分页。
 * $(tableName).bigPage({ajaxData:{url:"data.action",params:{},batch:true},pageSize:7,cssWidgets:["appendToTable","bgColor","eventColor"],callback:function(){
 * 		alert(1);
 *	}});
 */
(function($) {
	$.extend({bigPage: new function(){
		/*默认的参数，可以传入参数覆盖默认值。
		 * ajaxData: url:后台去数据的地址；params：参数;batch：是否一次性加载数据。false:一次性加载；true:分批取
		 * data:初始化数据。可以不使用ajaxData，把一次性数据传入data进行页面分页。支持传入数组或字符串(字符串支持编码)。
		 * pageSize:每页的大小.
		 * toPage:当前页码.
		 * callback：分页完成后继续的后续工作。
		 * strData：如果传入的是字符串，则字符串之间的分隔符、是否编码进行设定。
		 * cssWidgets：使用的渲染组件。默认定义了一些组件，用户可以自定义组件注入cssWidgets数组中。 
		 * once:一次性加载数据时，是否数据已经加载
		 */
		this.defaults ={ajaxData:{url:"",params:{},batch:false},data: [], pageSize : 2,toPage : 1,once:false,callback:callBack_,strData:{unescape:false,separatorTR:String.fromCharCode(2),separatorTD:String.fromCharCode(1)},cssWidgets:[]};
		this.updateDefaults = {ajaxData:{url:"",params:{},batch:false},data: [],toPage : 1,once:false};
		var cssWidgets = [];
		//扩张Array的push()方法，使数组内的数据不重复。
		Array.prototype.pushEx = function(obj){
			var a = true;
		    for (var i = 0; i < this.length; i++) {
		    	if (this[i].id.toLowerCase() == obj.id.toLowerCase()) {
		    		this[i] = obj;
		    		a = false;
		    		break;		
		    	}
		    }
		    if(a){
		    	this.push(obj);
		    }		
			return this.length;
		}		
		//分页的对象
		this.construct = function(args){
			var $table = window.bigPage = this;
			var config = {totalRecord:0,pageNumber:0};
			
			//将用户自定义的参数，覆盖默认值
			$.extend(config, $.bigPage.defaults, args);
			if(typeof(config.strData.separatorTR) == "undefined"){
					config.strData.separatorTR = String.fromCharCode(2);
			}
			if(typeof(config.strData.separatorTD) == "undefined"){
					config.strData.separatorTD = String.fromCharCode(1);
			}		
			//第一页
    	    this.firstPage = function(){
    	    	if(config.toPage == 1){
    	    		return this;
    	    	}
    	    	config.toPage = 1;
    	    	applyBuildTable();
				return this;
			};
			
			//上一页
			this.prevPage = function(){
				if(config.toPage <= 1){
					return this;
				}
				config.toPage --;
				applyBuildTable();
				return this;
			};
			//下一页
			this.nextPage = function(){
				if(config.toPage >= config.pageNumber){
					return this ;
				}
				config.toPage ++;
				applyBuildTable();
				return this;
			};
			//最后一页
			this.lastPage = function(){
				if(config.toPage == config.pageNumber){
					return this;
				}
				config.toPage = config.pageNumber;
				applyBuildTable();
				return this;
			};
			//跳转到指定页
    	    this.skipPage = function(toPage_){
            	var numberValue = Number(toPage_);
            	with(config){
            		toPage = isNaN(numberValue) ? 1 : numberValue;  	
            		if(toPage < 1 || toPage > pageNumber){
            			toPage = toPage < 1? 1 : pageNumber;
            		}
            	}
            	applyBuildTable();
				return this;
			};			
            //得到分页的数据
            this.getSubData = function(){
            	if(config.ajaxData.batch){
            		return config.data;
            	}
            	var totalRecord = config.totalRecord;
            	if(totalRecord <= 0){
            		return [];
            	}
            	var startRow = (config.toPage - 1) * config.pageSize;
            	var endRow = config.toPage * config.pageSize;
            	if(startRow > totalRecord){
            		return [];
            	}
            	if(endRow > totalRecord){
            		endRow = totalRecord;
            	}
            	return config.data.slice(startRow,endRow)
            };
            //总记录数
            this.totalRecord = function(){
            	return config.totalRecord;
            };
            //总页数
            this.pageNumber = function(){
            	return config.pageNumber;
            };
            //当前页
            this.toPage = function(){
            	return config.toPage;
            };
            //总记录数计算函数
			function pageNumberFun(totalRecord,pageSize){
				var pageNumber = parseInt(totalRecord / pageSize);
				if(totalRecord % pageSize != 0){
					pageNumber += 1;
				}
				return isNaN(pageNumber)? 0 : pageNumber;
			}; 
			//初始化config
			function initConfig(totalRecord_,need){
				if(!need)return;
				var data_ = [];
				for(var i= 0;i<config.data.length;i++){
					var cellValues = convertData(config.data[i],config.strData.separatorTD);
					data_.push(cellValues);
				}
				config.data = data_;
				with(config){
					if(typeof(totalRecord_)!= "undefined"){
						totalRecord = totalRecord_;
					}else{
						totalRecord =  data.length;
					}
					if(toPage < 1){
						toPage = 1;
					}
					if(pageSize < 1){
						pageSize = 50;
					}
					pageNumber = pageNumberFun(totalRecord,pageSize);
				}
			}
			//将字符串数据转换为数组数据
			function convertData(originalData,separator){
				if(!$.bigPage.isArray(originalData)){
					var dataStr = $.trim(String(originalData));
					if(config.strData.unescape){
						dataStr = unescape(dataStr)
					}
					originalData = dataStr.split(separator);
				}
				return originalData;
			}
			//将数据展现到页面
			function applyBuildTable(needInitConfig){
				config.data = convertData(config.data,config.strData.separatorTR);
				var ajaxData = config.ajaxData;
				if($.bigPage.isNull(ajaxData.url) || config.once == true){
					initConfig(undefined,needInitConfig);
					buildTable();
					return;
				}
				ajaxData.params = ajaxData.params || {};
				$.extend(ajaxData.params,{toPage:config.toPage,pageSize:config.pageSize});
				$.ajax({type: "POST",url: config.ajaxData.url,data:ajaxData.params,dataType:"json",
					"success": function(result){
					if(result.data == null){
						return;
					}
					var data_ = convertData(result.data,config.strData.separatorTR);
					if(ajaxData.batch){
						config.data = data_;
						initConfig(result.totalRecord,needInitConfig);
					}else{
						config.data = config.data.concat(data_);
						initConfig(undefined,needInitConfig);
						config.once = true;
					}
					buildTable();
				}});
			}
			
			function buildTable(){
				config.callback($table);
				applyCssWidget($table,config);				
			}
			//更新config值，即重新初始化参数
			$(this).bind("update",function(event,data){
				$.extend(config,$.bigPage.updateDefaults,data);
				applyBuildTable(true);
			});
			
			applyBuildTable(true);
           	return this;
		};
		
		this.escapeHtml = function(str) { 	
			if(this.isNull(str)){
				return   "";
			} 
			return str.replace(/\'/g,'&acute;').replace(/\"/g,'&quot;');
		}
		
		this.isNull = function(obj){
			if(obj == null || $.trim(obj) == "" || typeof(obj) == "undefined"){
				return true;
			}
			return false;
		}
		
		this.isArray = function(obj){
			if(Object.prototype.toString.call(obj) == "[object Array]"){
				return true;
			}
			return false;
		}
		
		this.toJSON = function (text) {
       try {
       	return eval('(' + text + ')');
       } catch (e) {
       	return false;
       }
    }
		
		this.addClass = function(obj,className,con){
			if(con){
				$(obj).addClass(className);
			}else{
				$(obj).removeClass(className);
			}
		}
		//向CssWidget数组中添加渲染组件，会覆盖已有的组件。
		this.addCssWidget = function(cssWidget){
			cssWidgets.pushEx(cssWidget)
            return this;
		}
		
		//根据id从CssWidget中取得组件
        function getCssWidgetById(name) {
        	if($.bigPage.isNull(name)){
        		return false;
        	}
            var l = cssWidgets.length;
            for (var i = 0; i < l; i++) {
                if (cssWidgets[i].id.toLowerCase() == name.toLowerCase()) {
                    return cssWidgets[i];
                }
            }
            return false;
        }
        //把渲染组件应用到页面的样式上
        function applyCssWidget($table,config){
        	var applyCssWidget = config.cssWidgets;
        	if(applyCssWidget.length <= 0){
        		cssWidgets[0].format($table,config);
        	}else{
        		for(var i=0;i<applyCssWidget.length;i++){
        			var cw = getCssWidgetById(applyCssWidget[i]);
        			if(cw){
        				cw.format($table,config);
        			}
        		}
        	}
        }
		//默认的callback函数
		function callBack_($table){

		}
		
	}});
	
	$.fn.extend({bigPage:$.bigPage.construct});
	
	$.bigPage.addCssWidget({
		id:"appendToTable",
		format :function($table,config){
			var subData = $table.getSubData();
			var $tBody = $($table[0].tBodies[0]);
			$tBody.empty();
			for(var i=0;i<subData.length;i++){
				var cellVaues = subData[i];
				var trStr = "<tr>";
				for(var j=0;j<cellVaues.length;j++){
					trStr += "<td>" + cellVaues[j] + "</td>";
				}
				trStr += "</tr>";
				$tBody.append(trStr);
			}
		}
	});

	$.bigPage.addCssWidget({
		id:"eventColor",
		format :function($table,config){
		var prevACss = config.toPage > 1?"page-prev":"page-start";
		var nextACss = config.toPage < config.pageNumber?"page-next":"page-end";
		$("#firstA").removeClass().addClass(prevACss);
		$("#prevA").removeClass().addClass(prevACss);
		$("#nextA").removeClass().addClass(nextACss);
		$("#lastA").removeClass().addClass(nextACss);
	}
	});	
	$.bigPage.addCssWidget({
		id:"eventColor2",
		format :function($table,config){
			config.toPage > 1?$("#prevA").show():$("#prevA").hide();
			config.toPage < config.pageNumber?$("#nextA").show():$("#nextA").hide();
			
			var maxCount = 9;
			var currentOption = config.toPage;
			var endOption = currentOption + parseInt(maxCount/2);
			if(endOption > config.pageNumber){
				endOption =  config.pageNumber;
			}
			var beginOption = endOption - maxCount;
			if(beginOption <= 0){
				beginOption = 1;
			}			
			$("table td[name=pageListTD]").remove();
			var tds = "";
			for(var i=beginOption;i<=endOption;i++){
				if(currentOption == i){
					tds += "<td name='pageListTD'><span>[" + i + "]</span></td>";
				}else{
					tds += "<td name='pageListTD'><a href='#' onclick='javascript:skipPage(" + i + ")' >[" + i + "]</a></td>"
				}
			}
			$("#nextPageTD").before(tds);
		}
	});	
	
})(jQuery);
