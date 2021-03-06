<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%><%@ 
	page contentType="text/html;charset=utf-8"%><%@
	page import="org.apache.commons.lang.StringUtils" %><%
/*	
	更新记录：
		2013-01-25 取消对SmartUpload的使用，改用commons-fileupload组件。因为测试发现SmartUpload有内存泄露的问题。
*/
//String path = request.getContextPath();
//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String clientCookie = request.getHeader("Cookie");
%>
<html>
<head>
<!--此页面实现Word图片自动批量上传的功能-->
    <title>WordPaster For CKEditor-4.x</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link type="text/css" rel="Stylesheet" href="WordPaster/css/WordPaster.css"/>
    <link type="text/css" rel="Stylesheet" href="WordPaster/js/skygqbox.css" />
    <script type="text/javascript" src="WordPaster/js/json2.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="WordPaster/js/jquery-1.4.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="ckeditor/ckeditor.js"></script>
    <script type="text/javascript" src="WordPaster/js/WordPaster.js" charset="utf-8"></script>
    <script type="text/javascript" src="WordPaster/js/skygqbox.js" charset="utf-8"></script>
</head>
<body>
	<div style="font-size: medium; line-height: 130%;">
		<p>
			演示方法：</p>
		<ul style="list-style-type: decimal;">
			<li>打开Word文档，复制多张图片，在编辑器中按下 Ctrl + V 键，编辑器将自动上传所有图片。</li>
			<li>复制电脑中任意图片文件，然后点击编辑器中的粘贴图片按钮<img src="WordPaster/css/paster.png" width="16px" height="16px" />。</li>
			<li>通过QQ或其它软件截屏，复制图片，然后点击编辑器中的图片粘贴按钮<img src="WordPaster/css/paster.png" width="16px" height="16px" />。</li>
		</ul>
		<p>
			相关问题：</p>
		<ul style="list-style-type: decimal;">
			<li>Windows7/Windows2003如果无法识别数字证书，请先下安装<a target="_blank" href="http://yunpan.cn/lk/sVWS4E6bXChcZ">数字签名根证书</a></li>
			<li>如果无法安装组件请下载进行安装<a target="_blank" href="http://www.microsoft.com/downloads/details.aspx?FamilyID=9b2da534-3e03-4391-8a4d-074b9f2bc1bf%20">Microsoft Visual C++ 2008 Redistributable Package (x86)</a></li>
			<li>如果有任何问题或建议请向我们<a target="_blank" href="http://www.ncmem.com/blog/guestbook.asp">反馈</a></li>
		</ul>
	</div>
	<!--创建FCKEditor控件-->
	<textarea id="editor1" name="editor1"></textarea>
    <script type="text/javascript">
        var pasterMgr = new WordPasterManager();
    	pasterMgr.Config["PostUrl"] = "http://localhost:8080/WordPaster2CKEditor4x/upload.jsp"
    	pasterMgr.Config["Cookie"] = '<%=clientCookie%>';
    	pasterMgr.Load();//加载控件

    	//动态设置url
    	function setUrl(v)
    	{
        	pasterMgr.Config["PostUrl"] = "";
        	pasterMgr.Config["Cookie"] = "";
        	pasterMgr.WordParser.Init();
        }

    	if(pasterMgr.Browser.Check())
    	{
        	//控件已安装
        }
    	else
    	{
        	//控件未安装
        }

		CKEDITOR.config.extraPlugins = 'imagepaster,netpaster';		
		
		//CKEditor初始化完毕
		CKEDITOR.on( 'instanceReady', function( ev ) {
    		pasterMgr.SetEditor(ev.editor);
    	});
    	//自定义快捷键
		CKEDITOR.config.keystrokes = [
			[CKEDITOR.CTRL + 86/*V*/,'imagepaster']
		];
		
    	//加载CKEditor编辑器
    	CKEDITOR.replace('editor1');
	</script>
</body>
</html>