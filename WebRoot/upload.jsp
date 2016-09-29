<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%><%@ 
	page contentType="text/html;charset=utf-8"%><%@ 
	page import = "Xproer.*" %><%@ 
	page import="org.apache.commons.lang.StringUtils" %><%@ 
	page import="org.apache.commons.fileupload.*" %><%@ 
	page import="org.apache.commons.fileupload.disk.*" %><%@ 
	page import="org.apache.commons.fileupload.servlet.*" %><%
/*	
	更新记录：
		2013-01-25 取消对SmartUpload的使用，改用commons-fileupload组件。因为测试发现SmartUpload有内存泄露的问题。
*/
//String path = request.getContextPath();
//String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String uname = "";// 		= request.getParameter("uid");
String upass = "";// 		= request.getParameter("fid");
 
// Check that we have a file upload request
boolean isMultipart = ServletFileUpload.isMultipartContent(request);
FileItemFactory factory = new DiskFileItemFactory();   
ServletFileUpload upload = new ServletFileUpload(factory);
//upload.setSizeMax(262144);//256KB
List files = null;
try 
{
	files = upload.parseRequest(request);
} 
catch (FileUploadException e) 
{//   
    out.println("upload error:" + e.toString());
    return;
   
}

FileItem imgFile = null;
// 得到所有上传的文件
Iterator fileItr = files.iterator();
// 循环处理所有文件
while (fileItr.hasNext()) 
{
	// 得到当前文件
	imgFile = (FileItem) fileItr.next();
	// 忽略简单form字段而不是上传域的文件域(<input type="text" />等)
	if(imgFile.isFormField())
	{
		String fn = imgFile.getFieldName();
		String fv = imgFile.getString(); 
		if(fn.equals("uname")) uname = fv;
		if(fn.equals("upass")) upass = fv;
	}
	else 
	{
		break;
	}
}
Uploader up = new Uploader(pageContext,request);
up.SaveFile(imgFile);
String url = up.GetFilePathRel(); 
out.write(url);
response.setHeader("Content-Length",url.length()+"");//返回Content-length标记，以便控件正确读取返回地址。
%>