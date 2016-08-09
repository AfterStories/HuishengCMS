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
			
		$(document).ready(function(){
		
/*删除所选，同时删除数据*/	
			
			$("#trashall").click(function() {
			$("input[name='ids']:checked").each(function() { // 遍历选中的checkbox
			n = $(this).parents("tr").index();  // 获取checkbox所在行的顺序
			$("tbody#list").find("tr:eq("+n+")").remove();
			});
		});

/*点击编辑按钮，显示文本编辑器，同时拉取数据库对应内容到编辑器中*/
			$(".edit").click(function() {
			
				$('#editnew').show().siblings('#module').hide();
			}
			
	);

/*删除按钮，删除列表行，删除数据*/
			$(".trash").click(function() {
			
			n = $(this).parents("tr").index();  // 获取checkbox所在行的顺序
			$("tbody#list").find("tr:eq("+n+")").remove();
			});
				
			}
			
	);

