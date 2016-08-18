
function editArticle(id){
		global_id = id;
		$('#editnew').show().siblings('#module').hide();
		$("#cms").hide();

		$.ajax({
		dataType:'json',
		type:'GET',
		data:{id:id},
		async:false,
		url:'http://123.57.223.98/Article/getArticleDetail',
		success:function(data) {
			editor_a.setContent(data.data.text);	
			$("#title").val(data.data.title);
		}
		});
}
function getArticleList(){
		$.ajax({
		dataType:'json',
		type:'GET',
		data:{},
		async:false,
		url:'http://123.57.223.98/Article/getArticleList',
		success:function(data) {
				
			for (var i = 0;i<data.data.length; i++) {
				
				var $checkbox = '<tr id="' +data.data[i].id+'"><td><input type="checkbox" name="ids"></td>' 
				var $titlename = '<td>'+data.data[i].title+'</td>' 
				var $author = '<td>'+data.data[i].author+'</td>'
				var $time = '<td>'+data.data[i].createtime+'</td>'
				var $button ='<td><button type="button" class="edit" onclick = "editArticle(' +data.data[i].id + ')"></td></tr>'
							
				var articlelist = $checkbox+$titlename+$author+$time+$button
				//alert(articlelist);
				$("#list").append(articlelist );
			}
		}
		});
}




/*删除轮播图*/		
function delfleximg(id){

		$.ajax({
		dataType:'json',
		type:'GET',
		data:{id:id},
		async:false,
		url:'http://123.57.223.98/scrollPicture/deleteImg',
		success:function(data) {
				if (data.errCode == 0){
					alert("删除 成功 !");
					lunboreload();
				}else{
					alert(data.errMsg);
				}
		}
		});
}




		$("#delimg").click(function() {

			$.ajax({
			dataType:'json',
			type:'GET',
			data:{idList:idList},
			url:'http://123.57.223.98/Article/deleteArticle',
			success:function(data) {
				if (data.errCode == 0){
					alert("删除 成功 !");
					$("#list").empty();
					getArticleList();
				}else{
					alert(data.errMsg);
				}

			}
		});
		   				

		
	})







$(document).ready(function(){
	getImgList();
	getArticleList();
            
		/*设置新密码*/
		$("#setNewpassword").click(function(){
			 
		
		function login(){
			
			var setpassword = $("#passwordset").val();
			var newpasword = $("#newpassword").val();
		$.ajax({
		dataType:'json',
		type:'POST',
		data:{password:setpassword,newpassword:newpasword},
		async:false,
		url:'http://192.168.1.101:8083/login/login',
		success:function(data) {
					if (data.errCode == 0)
					{
						alert("修改成功!");
					}
					else{	
						if (data.errMsg){
						alert(data.errMsg);
						}
					}			


		}
		});
		}
		});


$("#tijiao1").click(function(){
	var lefttitle = $("#leftad").val()			
    			var lefttext =  $("#lefttext").val()
		$.ajax({
		dataType:'json',
		type:'POST',
		data:{kind:'left',title:lefttitle,text:lefttext},
		async:false,
		url:'http://123.57.223.98/text/settext',
		success:function(data) {
					if (data.errCode == 0){
					alert("修改 成功 !");
					
					
				}else{
					alert(data.errMsg);
				}				
	


		}
		});
})

$("#tijiao2").click(function(){
	var lefttitle = $("#midad").val()			
    	var lefttext =  $("#midtext").val()
		$.ajax({
		dataType:'json',
		type:'POST',
		data:{kind:'center',title:lefttitle,text:lefttext},
		async:false,
		url:'http://123.57.223.98/text/settext',
		success:function(data) {
					if (data.errCode == 0){
					alert("修改 成功 !");
					
					
				}else{
					alert(data.errMsg);
				}				
	


		}
		});
})	

$("#tijiao3").click(function(){
	var lefttitle = $("#rightad").val()			
    	var lefttext =  $("#righttext").val()
		$.ajax({
		dataType:'json',
		type:'POST',
		data:{kind:'right',title:lefttitle,text:lefttext},
		async:false,
		url:'http://123.57.223.98/text/settext',
		success:function(data) {
					if (data.errCode == 0){
					alert("修改 成功 !");
					
					
				}else{
					alert(data.errMsg);
				}				
	


		}
		});
})		






function getImgList(){

		$.ajax({
		dataType:'json',
		type:'GET',
		data:{},
		async:false,
		url:'http://123.57.223.98/scrollPicture/getImgList',
		success:function(data) {
			
		for (var i = 0;i<data.data.length; i++) {

			var $tr = '<tr id="'+data.data[i].imgurl+'"><td>'+data.data[i].imgurl+'</td>'
			var $td = '<td>'+data.data[i].index+'</td>'
			var $use ='<td id ="delimg" onclick="delfleximg(' + data.data[i].id+');">删除</td></tr>'								
			var imgform = $tr+$td+$use				
    			
			$("#useimg-list").append(imgform);
		}
		}
		});
}




				




				$("#trashall").click(function() {

					if($("input[name='ids']").is(':checked')) {
					   				

					var idList = [];
					$("input[name='ids']:checked").each(function() { // 遍历选中的checkbox
						var n = $(this).index();  // 获取checkbox所在行的顺序
						var a =$("#list").find("input[name='ids']:checked:eq("+n+")")
						//alert(a.attr("id"));

						idList.push(a.attr('id'));
					});

		
					$.ajax({
						dataType:'json',
						type:'GET',
						data:{idList:idList},
						url:'http://123.57.223.98/Article/deleteArticle',
						success:function(data) {
							if (data.errCode == 0){
								alert("删除 成功 !");
								$("#list").empty();
								getArticleList();
							}else{
								alert(data.errMsg);
							}

						}
					});
					}else{
						alert("请先勾选要删除的内容")
					}	
				});


			
});
	
	

	/*全选按钮*/
			function selectAll(){
			 var checklist = document.getElementsByName ("ids");
			   if(document.getElementById("controlAll").checked)
			   {
			   for(var i=0;i<checklist.length;i++)
			   {
			      checklist[i].checked = true;
			   }
			 }else{
			  for(var j=0;j<checklist.length;j++)
			  {
			     checklist[j].checked = false;
			  }
			 }
			};







