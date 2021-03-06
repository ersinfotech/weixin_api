var sha1 = require('sha1'),
	events = require('events'),
	emitter = new events.EventEmitter(),
	nodeWeixinCrypto = require('node-weixin-crypto'),
	_ = require('underscore')
	xml2js = require('xml2js');

// 微信类
var Weixin = function(config) {
	this.data = '';
	this.msgType = 'text';
	this.fromUserName = '';
	this.toUserName = '';
	this.funcFlag = 0;
	this.config = config;
}

// 验证
Weixin.prototype.checkSignature = function(req) {

	// 获取校验参数
	this.signature = req.query.signature,
	this.timestamp = req.query.timestamp,
	this.nonce = req.query.nonce,
	this.echostr = req.query.echostr;

	// 按照字典排序
	var array = [this.token, this.timestamp, this.nonce];
	array.sort();

	// 连接
	var str = sha1(array.join(""));

	// 对比签名
	if(str == this.signature) {
		return true;
	} else {
		return false;
	}
}

// ------------------ 监听 ------------------------
// 监听文本消息
Weixin.prototype.textMsg = function(callback) {

	emitter.on("weixinTextMsg", callback);

	return this;
}

// 监听图片消息
Weixin.prototype.imageMsg = function(callback) {

	emitter.on("weixinImageMsg", callback);

	return this;
}

// 监听语音消息
Weixin.prototype.voiceMsg = function(callback) {

	emitter.on("weixinVoiceMsg", callback);

	return this;
}

// 监听视频消息
Weixin.prototype.videoMsg = function(callback) {

  emitter.on("weixinVideoMsg", callback);

  return this;
}

// 监听小视频消息
Weixin.prototype.shortVideoMsg = function(callback) {

	emitter.on("weixinShortVideoMsg", callback);

	return this;
}

// 监听地理位置消息
Weixin.prototype.locationMsg = function(callback) {

	emitter.on("weixinLocationMsg", callback);

	return this;
}

// 监听链接消息
Weixin.prototype.urlMsg = function(callback) {

	emitter.on("weixinUrlMsg", callback);

	return this;
}

// 监听事件
Weixin.prototype.eventMsg = function(callback) {

	emitter.on("weixinEventMsg", callback);

	return this;
}

// ----------------- 消息处理 -----------------------
/*
 * 文本消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 text
 * Content	 文本消息内容
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseTextMsg = function() {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"content" : this.data.Content[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinTextMsg", msg);

	return this;
}

/*
 * 图片消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 image
 * Content	 图片链接
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseImageMsg = function() {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"picUrl" : this.data.PicUrl[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinImageMsg", msg);

	return this;
}

/*
 * 语音消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 voice
 * MediaId	 media_id
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseVoiceMsg = function() {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"media_id" : this.data.MediaId[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinVoiceMsg", msg);

	return this;
}

/*
 * 视频消息格式：
 * ToUserName 开发者微信号
 * FromUserName  发送方帐号（一个OpenID）
 * CreateTime  消息创建时间 （整型）
 * MsgType   shortvideo
 * MediaId   media_id
 * ThumbMediaId  thumb_media_id
 * MsgId   消息id，64位整型
 */
Weixin.prototype.parseVideoMsg = function() {
  var msg = {
    "toUserName" : this.data.ToUserName[0],
    "fromUserName" : this.data.FromUserName[0],
    "createTime" : this.data.CreateTime[0],
    "msgType" : this.data.MsgType[0],
    "media_id" : this.data.MediaId[0],
    "thumb_media_id" : this.data.ThumbMediaId[0],
    "msgId" : this.data.MsgId[0],
  }

  emitter.emit("weixinVideoMsg", msg);

  return this;
}

/*
 * 小视频消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 shortvideo
 * MediaId	 media_id
 * ThumbMediaId	 thumb_media_id
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseShortVideoMsg = function() {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"media_id" : this.data.MediaId[0],
		"thumb_media_id" : this.data.ThumbMediaId[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinShortVideoMsg", msg);

	return this;
}

/*
 * 地理位置消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 location
 * Location_X	 x
 * Location_Y    y
 * Scale　地图缩放大小
 * Label 位置信息
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseLocationMsg = function(data) {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"locationX" : this.data.Location_X[0],
		"locationY" : this.data.Location_Y[0],
		"scale" : this.data.Scale[0],
		"label" : this.data.Label[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinLocationMsg", msg);

	return this;
}

/*
 * 链接消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 link
 * Title	 消息标题
 * Description    消息描述
 * Url　消息链接
 * MsgId	 消息id，64位整型
 */
Weixin.prototype.parseLinkMsg = function() {
	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"title" : this.data.Title[0],
		"description" : this.data.Description[0],
		"url" : this.data.Url[0],
		"msgId" : this.data.MsgId[0],
	}

	emitter.emit("weixinUrlMsg", msg);

	return this;
}

/*
 * 事件消息格式：
 * ToUserName	开发者微信号
 * FromUserName	 发送方帐号（一个OpenID）
 * CreateTime	 消息创建时间 （整型）
 * MsgType	 event
 * Event 事件类型，subscribe(订阅)、unsubscribe(取消订阅)、CLICK(自定义菜单点击事件)
 * EventKey 事件KEY值，与自定义菜单接口中KEY值对应
 */
Weixin.prototype.parseEventMsg = function() {
	// console.log(this.data);
	var eventKey = '';
	if (this.data.EventKey) {
		eventKey = this.data.EventKey[0];
	}

	var menuId = '';
	if (this.data.MenuId) {
		menuId = this.data.MenuId[0];
	}

	var status = '';
	if (this.data.Status) {
		status = this.data.Status[0];
	}

	var msgID = '';
	if (this.data.MsgID) {
		msgID = this.data.MsgID[0];
	}

	var totalCount = '';
	if (this.data.TotalCount) {
		totalCount = this.data.TotalCount[0];
	}

	var filterCount = '';
	if (this.data.FilterCount) {
		filterCount = this.data.FilterCount[0];
	}

	var sendCount = '';
	if (this.data.SentCount) {
		sendCount = this.data.SentCount[0];
	}

	var errorCount = '';
	if (this.data.ErrorCount) {
		errorCount = this.data.ErrorCount[0];
	}

  var copyrightCheckResult = {}
  if (this.data.CopyrightCheckResult) {
    copyrightCheckResult = {
      count: this.data.CopyrightCheckResult[0].Count[0],
      checkState: this.data.CopyrightCheckResult[0].CheckState[0],
      resultList: _.map(this.data.CopyrightCheckResult[0].ResultList[0].item, function(val) {
        return {
          articleIdx: val.ArticleIdx[0],
          userDeclareState: val.UserDeclareState[0],
          auditState: val.AuditState[0],
          originalArticleUrl: val.OriginalArticleUrl[0],
          originalArticleType: val.OriginalArticleType[0],
          canReprint: val.CanReprint[0],
          needReplaceContent: val.NeedReplaceContent[0],
          needShowReprintSource: val.NeedShowReprintSource[0]
        }
      })
    }
  }

	//wifi
	var connectTime = '';
	if (this.data.ConnectTime) {
		connectTime = this.data.ConnectTime[0];
	}

	var expireTime = '';
	if (this.data.ExpireTime) {
		expireTime = this.data.ExpireTime[0];
	}

	var vendorId = '';
	if (this.data.VendorId) {
		vendorId = this.data.VendorId[0];
	}

	var placeId = '';
	if (this.data.PlaceId) {
		placeId = this.data.PlaceId[0];
	}

	var deviceNo = '';
	if (this.data.DeviceNo) {
		deviceNo = this.data.DeviceNo[0];
	}

	// 摇一摇
	var chosenUuid = '';
	if (this.data.ChosenBeacon && this.data.ChosenBeacon.length > 0 && this.data.ChosenBeacon[0].Uuid) {
		chosenUuid = this.data.ChosenBeacon[0].Uuid[0];
	}

	var chosenMajor = '';
	if (this.data.ChosenBeacon && this.data.ChosenBeacon.length > 0 && this.data.ChosenBeacon[0].Major) {
		chosenMajor = this.data.ChosenBeacon[0].Major[0];
	}

	var chosenMinor = '';
	if (this.data.ChosenBeacon && this.data.ChosenBeacon.length > 0 && this.data.ChosenBeacon[0].Minor) {
		chosenMinor = this.data.ChosenBeacon[0].Minor[0];
	}

	var chosenDistance = '';
	if (this.data.ChosenBeacon && this.data.ChosenBeacon.length > 0 && this.data.ChosenBeacon[0].Distance) {
		chosenDistance = this.data.ChosenBeacon[0].Distance[0];
	}

	// 门店审核反馈
	var uniqId = '';// 商户自己内部ID，即字段中的sid
	if (this.data.UniqId) {
		uniqId = this.data.UniqId[0];
	}

	var poiId = '';// 商户自己内部ID，即字段中的sid
	if (this.data.PoiId) {
		poiId = this.data.PoiId[0];
	}

	var poiResult = '';// 商户自己内部ID，即字段中的sid
	if (this.data.Result) {
		poiResult = this.data.Result[0];
	}

	var msg = {
		"toUserName" : this.data.ToUserName[0],
		"fromUserName" : this.data.FromUserName[0],
		"createTime" : this.data.CreateTime[0],
		"msgType" : this.data.MsgType[0],
		"event" : this.data.Event[0],
		"menuId": menuId,
		"status": status,
		"msgID": msgID,
		"totalCount": totalCount,
		"filterCount": filterCount,
		"sendCount": sendCount,
		"errorCount": errorCount,
    "copyrightCheckResult": copyrightCheckResult,
		"eventKey" : eventKey,
		"uuid": chosenUuid,
		"major": chosenMajor,
		"minor": chosenMinor,
		"distance": chosenDistance,
		"connectTime": connectTime,
		"expireTime": expireTime,
		"vendorId": vendorId,
		"placeId": placeId,
		"deviceNo": deviceNo,
		"uniqId": uniqId,
		"poiId": poiId,
		"poiResult": poiResult
	}

	emitter.emit("weixinEventMsg", msg);

	return this;
}

// --------------------- 消息返回 -------------------------

function getSignature(token, timestamp, nonce, encrypt) {
  var raw_signature = [token, timestamp, nonce, encrypt].sort().join('');
  var crypto = require("crypto");
  var sha1 = crypto.createHash("sha1");
  sha1.update(raw_signature);
  return sha1.digest("hex");
}

// 返回文字信息
Weixin.prototype.sendTextMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);

	var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;

	var output = "" +
	"<xml>" +
		 "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		 "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		 "<CreateTime>" + time + "</CreateTime>" +
		 "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
		 "<Content><![CDATA[" + msg.content + "]]></Content>" +
		 "<FuncFlag>" + funcFlag + "</FuncFlag>" +
	"</xml>";

	var wechatInfo = _.findWhere(this.config, {origin_id: msg.fromUserName})
  if(wechatInfo) {
    var msgData = {
      id: wechatInfo.appid,
      encodingAESKey: wechatInfo.encodingAESKey,
      token: wechatInfo.token
    }
    output = nodeWeixinCrypto.encrypt(output, msgData);
    Nonce = this.nonce || parseInt((Math.random() * 100000000000), 10);
    TimeStamp = this.timestamp || new Date().getTime();
    MsgSignature = getSignature(msgData.token, TimeStamp, Nonce, output);
    output = "" +
    "<xml>" +
      "<Encrypt><![CDATA[" + output + "]]></Encrypt>" +
      "<MsgSignature><![CDATA[" + MsgSignature + "]]></MsgSignature>" +
      "<TimeStamp>" + TimeStamp + "</TimeStamp>" +
      "<Nonce><![CDATA[" + Nonce + "]]></Nonce>" +
    "</xml>"
  }

	if(msg.content.length == 0){
    // console.log('*2')
		this.res.send("success");
	}
	else{
    // console.log('*3')
		this.res.type('xml');
		this.res.send(output);
	}

	return this;
}


// 返回图片信息
Weixin.prototype.sendImageMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);

	var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;

	var output = "" +
	"<xml>" +
		 "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		 "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		 "<CreateTime>" + time + "</CreateTime>" +
		 "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
		 "<Image>" +
		 "<MediaId><![CDATA[" + msg.mediaId + "]]></MediaId>" +
		 "</Image>" +
		 "<FuncFlag>" + funcFlag + "</FuncFlag>" +
	"</xml>";


  var wechatInfo = _.findWhere(this.config, {origin_id: msg.fromUserName})
  if(wechatInfo) {
    var msgData = {
      id: wechatInfo.appid,
      encodingAESKey: wechatInfo.encodingAESKey,
      token: wechatInfo.token
    }
    output = nodeWeixinCrypto.encrypt(output, msgData);
    Nonce = this.nonce || parseInt((Math.random() * 100000000000), 10);
    TimeStamp = this.timestamp || new Date().getTime();
    MsgSignature = getSignature(msgData.token, TimeStamp, Nonce, output);
    output = "" +
    "<xml>" +
      "<Encrypt><![CDATA[" + output + "]]></Encrypt>" +
      "<MsgSignature><![CDATA[" + MsgSignature + "]]></MsgSignature>" +
      "<TimeStamp>" + TimeStamp + "</TimeStamp>" +
      "<Nonce><![CDATA[" + Nonce + "]]></Nonce>" +
    "</xml>"
  }

	this.res.type('xml');
	this.res.send(output);

	return this;
}

// 返回音乐信息
Weixin.prototype.sendMusicMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);

	var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;

	var output = "" +
	"<xml>" +
		 "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		 "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		 "<CreateTime>" + time + "</CreateTime>" +
		 "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
	 	 "<Music>" +
	 	 "<Title><![CDATA[" + msg.title + "]]></Title>" +
	 	 "<Description><![CDATA[" + msg.description + "DESCRIPTION]]></Description>" +
	 	 "<MusicUrl><![CDATA[" + msg.musicUrl + "]]></MusicUrl>" +
	 	 "<HQMusicUrl><![CDATA[" + msg.HQMusicUrl + "]]></HQMusicUrl>" +
	 	 "</Music>" +
		 "<FuncFlag>" + funcFlag + "</FuncFlag>" +
	"</xml>";


  var wechatInfo = _.findWhere(this.config, {origin_id: msg.fromUserName})
  if(wechatInfo) {
    var msgData = {
      id: wechatInfo.appid,
      encodingAESKey: wechatInfo.encodingAESKey,
      token: wechatInfo.token
    }
    output = nodeWeixinCrypto.encrypt(output, msgData);
    Nonce = this.nonce || parseInt((Math.random() * 100000000000), 10);
    TimeStamp = this.timestamp || new Date().getTime();
    MsgSignature = getSignature(msgData.token, TimeStamp, Nonce, output);
    output = "" +
    "<xml>" +
      "<Encrypt><![CDATA[" + output + "]]></Encrypt>" +
      "<MsgSignature><![CDATA[" + MsgSignature + "]]></MsgSignature>" +
      "<TimeStamp>" + TimeStamp + "</TimeStamp>" +
      "<Nonce><![CDATA[" + Nonce + "]]></Nonce>" +
    "</xml>"
  }

	this.res.type('xml');
	this.res.send(output);

	return this;
}

// 返回图文信息
Weixin.prototype.sendNewsMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);

	//
	var articlesStr = "";
	for (var i = 0; i < msg.articles.length; i++)
	{
		articlesStr += "<item>" +
							"<Title><![CDATA[" + msg.articles[i].title + "]]></Title>" +
							"<Description><![CDATA[" + msg.articles[i].description + "]]></Description>" +
							"<PicUrl><![CDATA[" + msg.articles[i].picUrl + "]]></PicUrl>" +
							"<Url><![CDATA[" + msg.articles[i].url + "]]></Url>" +
						"</item>";
	}

	var funcFlag = msg.funcFlag ? msg.funcFlag : this.funcFlag;
	var output = "" +
	"<xml>" +
		 "<ToUserName><![CDATA[" + msg.toUserName + "]]></ToUserName>" +
		 "<FromUserName><![CDATA[" + msg.fromUserName + "]]></FromUserName>" +
		 "<CreateTime>" + time + "</CreateTime>" +
		 "<MsgType><![CDATA[" + msg.msgType + "]]></MsgType>" +
		 "<ArticleCount>" + msg.articles.length + "</ArticleCount>" +
	 	 "<Articles>" + articlesStr + "</Articles>" +
		 "<FuncFlag>" + funcFlag + "</FuncFlag>" +
	"</xml>";

  var wechatInfo = _.findWhere(this.config, {origin_id: msg.fromUserName})
  if(wechatInfo) {
    var msgData = {
      id: wechatInfo.appid,
      encodingAESKey: wechatInfo.encodingAESKey,
      token: wechatInfo.token
    }
    output = nodeWeixinCrypto.encrypt(output, msgData);
    Nonce = this.nonce || parseInt((Math.random() * 100000000000), 10);
    TimeStamp = this.timestamp || new Date().getTime();
    MsgSignature = getSignature(msgData.token, TimeStamp, Nonce, output);
    output = "" +
    "<xml>" +
      "<Encrypt><![CDATA[" + output + "]]></Encrypt>" +
      "<MsgSignature><![CDATA[" + MsgSignature + "]]></MsgSignature>" +
      "<TimeStamp>" + TimeStamp + "</TimeStamp>" +
      "<Nonce><![CDATA[" + Nonce + "]]></Nonce>" +
    "</xml>"
  }

	this.res.type('xml');
	this.res.send(output);

	return this;
}

// 返回XML信息
Weixin.prototype.sendXMLMsg = function(msg) {
  var output = msg.xml
  var wechatInfo = _.findWhere(this.config, {origin_id: msg.fromUserName})
  if(wechatInfo) {
    var msgData = {
      id: wechatInfo.appid,
      encodingAESKey: wechatInfo.encodingAESKey,
      token: wechatInfo.token
    }
    output = nodeWeixinCrypto.encrypt(output, msgData);
    Nonce = this.nonce || parseInt((Math.random() * 100000000000), 10);
    TimeStamp = this.timestamp || new Date().getTime();
    MsgSignature = getSignature(msgData.token, TimeStamp, Nonce, output);
    output = "" +
    "<xml>" +
      "<Encrypt><![CDATA[" + output + "]]></Encrypt>" +
      "<MsgSignature><![CDATA[" + MsgSignature + "]]></MsgSignature>" +
      "<TimeStamp>" + TimeStamp + "</TimeStamp>" +
      "<Nonce><![CDATA[" + Nonce + "]]></Nonce>" +
    "</xml>"
  }
  this.res.type('xml');
  this.res.send(output);
  return this;
}

// ------------ 主逻辑 -----------------
// 解析
Weixin.prototype.parse = function() {

	if(this.data.Encrypt){
		var toUserName = this.data.ToUserName
		// if(!this.data.MsgType || !this.data.MsgType[0]){
		// 	return this;
		// }
		var wechatInfo = _.findWhere(this.config, {origin_id: this.data.ToUserName[0]})
		if(!wechatInfo){
			return this;
		}
		var msgData = {
		  id: wechatInfo.appid,
		  encodingAESKey: wechatInfo.encodingAESKey,
		  token: wechatInfo.token
		}
		var decrypted = nodeWeixinCrypto.decrypt(this.data.Encrypt[0], msgData);
		xml2js.parseString(decrypted, function(err, json) {
			if (err) {
          err.status = 400;
        } else {
        	decrypted = json.xml;
        }
	    });
		this.data = decrypted
		this.data.ToUserName = toUserName
	}

	this.msgType = this.data.MsgType[0] ? this.data.MsgType[0] : "text";

	switch(this.msgType) {
		case 'text' :
			this.parseTextMsg();
			break;

		case 'image' :
			this.parseImageMsg();
			break;

		case 'voice' :
			this.parseVoiceMsg();
			break;

    case 'video' :
      this.parseVideoMsg();
      break;

		case 'shortvideo' :
			this.parseShortVideoMsg();
			break;

		case 'location' :
			this.parseLocationMsg();
			break;

		case 'link' :
			this.parseLinkMsg();
			break;

		case 'event' :
			this.parseEventMsg();
			break;
	}
}

// 发送信息
Weixin.prototype.sendMsg = function(msg) {
	switch(msg.msgType) {

		case 'text' :
			this.sendTextMsg(msg);
			break;
		case 'image' :
			this.sendImageMsg(msg);
			break;
		case 'music' :
			this.sendMusicMsg(msg);
			break;
		case 'news' :
			this.sendNewsMsg(msg);
			break;
    case 'xml':
      this.sendXMLMsg(msg);
      break;
	}
}

// Loop
Weixin.prototype.loop = function(req, res) {
	// 保存res
	this.res = res;

	var self = this;

    // 获取XML内容
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
		buf += chunk;
	});

	// 内容接收完毕
    req.on('end', function() {
		xml2js.parseString(buf, function(err, json) {
			if (err) {
                err.status = 400;
            } else {
                req.body = json;
            }
        });

		self.data = req.body.xml;

		self.parse();
    });
}

module.exports = Weixin;
