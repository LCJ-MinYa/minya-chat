var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils/utils.js');
var mail = require('../utils/mail.js');
require('../../model/user.server.module.js');
var User = mongoose.model('User');

/* GET home page. */
router.get('/register', function(req, res) {
	res.send("请求资源不支持HTTP方法GET访问！");
});

router.post('/register', function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, result) {
		if (err) {
			utils.sendJson(res, 404, err);
		} else {
			if (result) {
				utils.sendJson(res, 404, '该邮箱地址已注册');
			} else {
				userInsert();
			}
		}
	})

	var userInsert = function() {
		var content = {
			userName: req.body.userName,
			email: req.body.email,
			password: '',
			uid: utils.generateUUID()
		}
		var user = new User(content);
		user.save(function(err) {
			if (err) {
				utils.sendJson(res, 404, err);
			} else {
				var subject = '恣意游用户验证';
				var url = req.protocol + "://" + req.get('host') + '/login?uid=' + content.uid;
				var html = '<p>亲爱的用户:</p><br/><p>感谢您注册恣意游.</p><p>请点击以下链接完成注册</p>';
				html += '<p><a href="' + url + '">' + url + '</a></p>';
				mail.sendMail(req.body.email, subject, html, function(result) {
					if (result.status == 200) {
						utils.sendJson(res, 200, result.message);
					} else {
						utils.sendJson(res, 404, result.message);
					}
				})
			}
		})
	}
});

module.exports = router;