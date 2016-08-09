<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<script src="../uedtior/ueditor.parse.min.js" type="text/javascript"></script>
<script>
    uParse('.content',{
        'rootPath': '../uedtior/'
    })

</script>
<?php
    //获取数据
    error_reporting(E_ERROR|E_WARNING);
    $title =  htmlspecialchars(stripslashes($_POST['titlename']));
    $content =  htmlspecialchars(stripslashes($_POST['myEditor']));


    //存入数据库或者其他操作

    //显示
    echo "标题：";
    echo  "$title";
    echo "内容";
    echo  "<div class='content'>".htmlspecialchars_decode($content)."</div>";

