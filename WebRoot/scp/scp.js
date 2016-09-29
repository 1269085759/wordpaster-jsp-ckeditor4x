/*
	版权所有 2009-2013 荆门泽优软件有限公司
	保留所有权利
	官方网站：http://www.ncmem.com
	官方博客：http://www.cnblogs.com/xproer
	产品首页：http://www.ncmem.com/webplug/screencapture/index.asp
	产品介绍：http://www.cnblogs.com/xproer/archive/2010/08/09/1796077.html
	在线演示-标准版：http://www.ncmem.com/products/screencapture/demo/index.html
	在线演示-专业版：http://www.ncmem.com/products/screencapture/demo2/index.html
	在线演示-FCKEditor2.x：http://www.ncmem.com/products/screencapture/fckeditor2x/index.html
	在线演示-CKEditor3.x：http://www.ncmem.com/products/screencapture/demo-ckeditor361/index_ckeditor361.html
	在线演示-xhEditor1.x：http://www.ncmem.com/products/screencapture/kindeditor3x/index.html
	布署文档：http://www.cnblogs.com/xproer/archive/2011/09/14/2176188.html
	升级日志：http://www.cnblogs.com/xproer/archive/2010/12/04/1896399.html
	开发文档-ASP.NET(C#)：http://www.cnblogs.com/xproer/archive/2010/12/04/1896552.html
	开发文档-PHP：http://www.cnblogs.com/xproer/archive/2011/05/16/2047915.html
	开发文档-JSP：http://www.cnblogs.com/xproer/archive/2011/05/20/2051862.html
	示例下载-标准版：http://l2.yunpan.cn/lk/QvUwmzife29mQ
	示例下载-专业版：http://yunpan.cn/lk/11b1drhnvk
	文档下载：http://yunpan.cn/lk/11pbm5mjvk
	VC运行库：http://www.microsoft.com/downloads/details.aspx?FamilyID=9b2da534-3e03-4391-8a4d-074b9f2bc1bf%20
	联系邮箱：1085617561@qq.com
	联系QQ：1085617561
*/

//全局对象
var ScreenCaptureError = {
	"0": "连接服务器失败"
	, "1": "发送数据错误"
	, "2": "未设置上传地址"
	, "3": "公司未授权"
	, "4": "域名未授权"
};

/*
	截屏对象管理类，提供常用配置功能
	参数
		infDivID 截屏信息层
*/
function CaptureManager()
{
	var _this = this;
	this.StateType = {
		Ready				: 0
		,Posting			: 1
		,Stop				: 2
		,Error				: 3
		,GetNewID			: 4
		,Complete			: 5
		,WaitContinueUpload	: 6
		,None				: 7
		,Waiting			: 8
	};
	_this.State = _this.StateType.None;
	_this.Editor = null;
	this.pluginFF = null;
	this.pluginIE = null;
	this.scpPnl = null;//面板
	this.scpIco = null;//图标
	this.scpImg = null;//截屏图片显示对象，需要在外部设置
	this.scpMsg = null;//消息
	this.scpPer = null;//百分比
	
	//全局配置信息
	this.Config = {
		"PostUrl"		: "http://www.ncmem.com/upload.aspx"
		, "EncodeType"	: "utf-8"
		, "Version"		: "1,6,74,31253"
		, "Company"		: "荆门泽优软件有限公司"
		, "License"		: ""
		, "FileFieldName": "img"//文件字段名称。
		, "Authenticate": ""//Windows验证方式。basic,ntlm
		, "Language"	: "zhcn"//语言设置，en,zhcn,tw
        , "Quality"     : 100//图片质量，仅对jpg格式有效
        , "IcoPath"		: "http://ncmemres.b0.upaiyun.com/products/screencapture/ckeditor4x/ScreenCapture/uploading.gif"
        , "ShowForm"    : true//是否显示截屏提示窗口
        //x86
        , "Clsid"       : "B10327CB-56EC-43D9-BED0-C91E4AE8F42E"
		, "ProjID"		: "Xproer.ScreenCapture"
		, "CabPath"		: "http://www.ncmem.com/download/ScreenCapture/ScreenCapture.cab"
		//x64
		, "Clsid64"		: "32CA4868-4024-41a3-AAF3-E5D24897B81A"
		, "ProjID64"	: "Xproer.ScreenCapture64"
		, "CabPath64"	: "http://www.ncmem.com/download/ScreenCapture/ScreenCapture64.cab"
		//FireFox
		, "MimeType"	: "application/npScreenCapture"
		, "XpiPath"		: "http://www.ncmem.com/download/ScreenCapture/ScreenCapture.xpi"
		//Chrome
		, "CrxName"		: "npScreenCapture"
		, "MimeTypeChr"	: "application/npScreenCapture"
		, "CrxPath"		: "http://www.ncmem.com/download/ScreenCapture/ScreenCapture.crx"
	};
	
	//附加对象
	this.Fields = {
		 "uname" : "test"
		,"upass" : "test"
	};

	//IE浏览器信息管理对象
	_this.BrowserIE = {
		"GetHtml": function()
		{
			/*ActiveX的静态加载方式，如果在框架页面中使用此控件，推荐使用静态加截方式。
			<div style="display: none">
			<object id="objScreenCapture" classid="clsid:B10327CB-56EC-43D9-BED0-C91E4AE8F42E" codebase="http://www.ncmem.com/products/screencapture/demo/ScreenCapture.cab#version=1,6,26,54978" width="1" height="1"></object>
			</div>
			*/
			var acx = '<div style="display: none">';
			acx += '<object id="objScreenCapture" classid="clsid:' + _this.Config["Clsid"] + '"';
			acx += ' codebase="' + _this.Config["CabPath"] + '#version=' + _this.Config["Version"] + '" width="1" height="1"></object>';
			acx += '</div>';
			
			//截屏图片上传窗口
			acx += '<div name="pnlScpUploader" class="CaptureMessage">';
			acx += '<img alt="进度图标" src="' + _this.Config["IcoPath"] + '" /><span name="msg">图片上传中...</span><span name="process">10%</span>';
			acx += '</div>';
			return acx;
		}
		, "GetPlugin": function()
		{
			return this.plugin;
		} //检查插件是否已安装
		, "Check": function()
		{
			try
			{
				var com = new ActiveXObject(_this.Config["ProjID"]);
				return true;
			}
			catch (e) { return false; }
		}
		, "GetChild": function(obj, index) { return obj.children(index); }
		, "SetText": function(obj, txt) { obj.innerText = txt; }
		, "Init": function () { this.plugin = _this.pluginIE; }
       	, "plugin": null
	};
	//FireFox浏览器信息管理对象
	_this.BrowserFF = {
		"GetHtml": function()
		{
			var html = '<embed type="' + _this.Config["MimeType"] + '" pluginspage="' + _this.Config["XpiPath"] + '" width="1" height="1" id="objScreenCapture">';
			//截屏图片上传窗口
			html += '<div name="pnlScpUploader" class="CaptureMessage">';
			html += '<img alt="进度图标" src="' + _this.Config["IcoPath"] + '" /><span name="msg">图片上传中...</span><span name="process">10%</span>';
			html += '</div>';
			return html;
		}
		, "GetPlugin": function()
		{
			return this.plugin;
		} //检查插件是否已安装
		, "Check": function()
		{
			var mimetype = navigator.mimeTypes;
			if (typeof mimetype == "object" && mimetype.length) {
				for (var i = 0; i < mimetype.length; i++) {
					if (mimetype[i].type == _this.Config["MimeType"].toLowerCase()) {
						return mimetype[i].enabledPlugin;
					}
				}
			}
			else {
				mimetype = [_this.Config["MimeType"]];
			}
			if (mimetype) {
				return mimetype.enabledPlugin;
			}
			return false; 
		} //安装插件
		, "Setup": function()
		{
			var xpi = new Object();
			xpi["Calendar"] = _this.Config["XpiPath"];
			InstallTrigger.install(xpi, function(name, result) { });
		}
		, "Init": function () { this.plugin = _this.pluginFF; }
        ,"plugin":null
	};
	//Chrome浏览器信息管理对象
	_this.BrowserChrome =
	{
		"GetHtml": function()
		{
			var html = '<embed type="' + _this.Config["MimeTypeChr"] + '" pluginspage="' + _this.Config["CabPath"] + '" width="1" height="1" id="objScreenCapture">';
			//截屏图片上传窗口
			html += '<div name="pnlScpUploader" class="CaptureMessage">';
			html += '<img alt="进度图标" src="' + _this.Config["IcoPath"] + '" /><span name="msg">图片上传中...</span><span name="process">10%</span>';
			html += '</div>';
			return html;
		}
		, "GetPlugin": function()
		{
			return this.plugin;
		} //检查插件是否已安装
		, "Check": function()
		{
			for (var i = 0, l = navigator.plugins.length; i < l; i++)
			{
				if (navigator.plugins[i].name == _this.Config["CrxName"])
				{
					return true;
				}
			}
			return false;
		} //安装插件
		, "Setup": function()
		{
			document.write('<iframe style="display:none;" src="' + _this.Config["CabPath"] + '"></iframe>');
		}
		, "Init": function () { this.plugin = _this.pluginFF; }
        ,"plugin":null
	};
	_this.Browser = _this.BrowserIE;
	var browserName=navigator.userAgent.toLowerCase();
	this.ie = browserName.indexOf("msie") > 0;
	//IE11
	this.ie = _this.ie ? _this.ie : browserName.search(/(msie\s|trident.*rv:)([\w.]+)/)!=-1;
	this.firefox = browserName.indexOf("firefox") > 0;
	this.chrome = browserName.indexOf("chrome") > 0;

	if ( this.ie )
	{
		//Win64
		if (window.navigator.platform == "Win64")
		{
			this.Config["Clsid"] = this.Config["Clsid64"];
			this.Config["ProjID"] = this.Config["ProjID64"];
			this.Config["CabPath"] = this.Config["CabPath64"];
		}
	} //Firefox
	else if (this.firefox)
	{
		_this.Config["CabPath"] = _this.Config["XpiPath"];
		_this.Browser = this.BrowserFF;
		if (!_this.Browser.Check()) {_this.Browser.Setup();}
	} //chrome
	else if (this.chrome)
	{
		_this.Config["CabPath"] = _this.Config["CrxPath"];
		_this.Browser = this.BrowserChrome;
		if (!_this.Browser.Check()) {_this.Browser.Setup();}
    }
    
	this.GetHtml = function ()
	{
        //ff
	    var html = '<embed type="' + this.Config["MimeTypeChr"] + '" pluginspage="' + this.Config["CabPath"] + '" width="1" height="1" name="scpFF">';
        //ie
	    html += '<object name="scpIE" classid="clsid:' + this.Config["Clsid"] + '"';
	    html += ' codebase="' + this.Config["CabPath"] + '#version=' + this.Config["Version"] + '" width="1" height="1"></object>';
	    //
	    html += '<div name="pnl" class="scpPanel">\
	                <img name="ico" alt="进度图标" src="/ScreenCapture/process.gif" /><span name="msg">图片上传中...</span><span name="per">10%</span>\
	            </div>';
	    return html;
	};

	this.Load = function()
	{
	    var ui = $(document.body).append(this.GetHtml());
	    this.pluginFF = ui.find('embed[name="scpFF"]').get(0);
	    this.pluginIE = ui.find('object[name="scpIE"]').get(0);
	    this.scpPnl = ui.find('div[name="pnl"]');
	    this.scpIco = ui.find('img[name="ico"]').attr("src", this.Config["IcoPath"]);
	    this.scpMsg = ui.find('span[name="msg"]');
	    this.scpPer = ui.find('span[name="per"]');

	    this.Browser.Init();
	    this.Init();
	};
	
	//加截到指定对象内部
	this.LoadTo = function(oid)
	{
	    var ui = $("#" + oid).append(this.GetHtml());
	    this.pluginFF   = ui.find('embed[name="scpFF"]').get(0);
	    this.pluginIE   = ui.find('object[name="scpIE"]').get(0);
	    this.scpPnl     = ui.find('div[name="pnl"]');
	    this.scpIco     = ui.find('img[name="ico"]').attr("src",this.Config["IcoPath"]);
	    this.scpMsg     = ui.find('span[name="msg"]');
	    this.scpPer     = ui.find('span[name="per"]');

	    this.Browser.Init();
	    this.Init();
	};
	
	this.SetEditor = function(edt){this.Editor = edt;};

	//加载CAB控件
	//this.Load();

	this.Init = function()
	{
		//this.Editor = edt;
		//插件名称
		_this.ATL = _this.Browser.GetPlugin();
		//_this.ATL = new ActiveXObject(this.Config["ProjID"]);
		_this.ATL.Object = this;
		_this.ATL.License = _this.Config["License"];
		_this.ATL.PostUrl = _this.Config["PostUrl"];
		_this.ATL.EncodeType = _this.Config["EncodeType"];
		_this.ATL.Language = _this.Config["Language"];
		_this.ATL.Quality = _this.Config["Quality"];
		_this.ATL.ShowForm = _this.Config["ShowForm"];
		_this.ATL.Company = _this.Config["Company"];
		_this.ATL.FileFieldName = _this.Config["FileFieldName"];
		_this.ATL.Authenticate = _this.Config["Authenticate"];
		_this.ATL.Cookie = document.cookie;
		_this.ATL.OnComplete = ScreenCapture_Complete;
		_this.ATL.OnPost = ScreenCapture_OnProcess;
		_this.ATL.OnStop = ScreenCapture_Stop;
		_this.ATL.OnError = ScreenCapture_OnError;
		_this.ATL.OnConnected = ScreenCapture_Connected;
		_this.ATL.AfterCapture = ScreenCapture_AfterCapture;
		//
	};

	//截屏函数
	this.Capture = function()
	{
		//正在上传
		_this.ATL.ClearFields();//清除附加字段
		var pname;
		for (pname in _this.Fields)
		{
			_this.ATL.AddField(pname, _this.Fields[pname]);
		}
		_this.ATL.Capture();
	};
	
	//截取整个屏幕
	this.CaptureScreen = function()
	{
		_this.ATL.ClearFields(); //清除附加字段
		var pname;
		for (pname in _this.Fields)
		{
			_this.ATL.AddField(pname, _this.Fields[pname]);
		}
		_this.ATL.CaptureScreen();
	};

	this.OpenInfPanel = function()
	{
	    _this.scpPnl.skygqbox();
	};

	this.CloseInfPanel = function()
	{
	    $('#wrapClose').click();
	};

	//添加到编辑器
	this.InsertToEditor = function(src)
	{
		var img = '<img src="';
		img += src;
		img += '"/>';
		_this.Editor.insertHtml(img);
	};
}

//事件-连接成功
function ScreenCapture_Connected(obj)
{
	obj.scpPer.text("10%");
	obj.State = obj.StateType.Posting;
}

//事件-传输完毕
function ScreenCapture_Complete(obj)
{
	obj.scpPer.text("100%");
	obj.scpMsg.text("上传完成");
	obj.State = obj.StateType.Complete;
	obj.CloseInfPanel(); //隐藏信息层
	//添加到编辑器
	obj.InsertToEditor(obj.ATL.Response);
}

/*
	事件-传输中....
	参数:
		obj		JS对象
		speed	传输速度
		postedLength 已传输长度。1Byte,1KB,1MB,1GB
		percent 上传百分比
		time 剩余时间
*/
function ScreenCapture_OnProcess(obj,speed,postedLength,percent,time)
{
	obj.scpPer.text(percent);
	//obj.pProcess.style.width = arguments[3] + "%";
	//obj.pMsg.innerText = "已上传:" + arguments[2];
	//obj.pMsg.innerText += " 速度:" + arguments[1] + "/s";
	//obj.pMsg.innerText += " 剩余时间:" + arguments[4];
}

//事件-传输停止
function ScreenCapture_Stop(obj)
{
	obj.State = obj.StateType.Stop;
}
/*
	事件-传输错误
	参数:
		obj
		errCode
*/
function ScreenCapture_OnError(obj,errCode)
{
	obj.scpMsg.text(ScreenCaptureError[errCode]);
	obj.scpPer.text( "");
	//obj.pButton.innerText = "重试";
	obj.State = obj.StateType.Error;
}

function ScreenCapture_AfterCapture(obj)
{
	obj.OpenInfPanel();//打开信息面板
}