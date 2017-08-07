import axios from 'axios';
import api from '../../../src/api.js';
var wechatShare = {
    wechatShare: function(config) {
        var defaultConfig = config;
        //获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage(defaultConfig);
        //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline(defaultConfig);
        //分享到qq
        wx.onMenuShareQQ(defaultConfig);

        // {
        //      title: window.header, // 分享标题
        //      desc: window.describe, // 分享描述
        //      link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //      imgUrl: window.image, // 分享图标
        //      type: '', // 分享类型,music、video或link，不填默认为link
        //      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //      success: function() {
        //          // 用户确认分享后执行的回调函数
        //      },
        //      cancel: function() {
        //          // 用户取消分享后执行的回调函数
        //      }
        //  }
    },
    authAndLogin: function(callback) {
        var appUrl = window.location.href;

        var totalUrl = appUrl.split('#/');
        var targetIndex = totalUrl[0];
        var targetHash = totalUrl[1];
        //一个地址两个微信分享标识
        if (targetIndex && targetIndex.indexOf('&from=') > -1 && targetHash && targetHash.indexOf('&from=') > -1) {
            targetIndex = targetIndex.split('&from=')[0];
        }
        appUrl = targetIndex + '#/' + targetHash;

        // console.log('888888:' + appUrl);
        // var shareTag = appUrl.indexOf('&from=');
        // console.log('appdetail:' + shareTag);
        // //从分享页面进入的，需要授权操作
        // console.log('要不要授权奥');
        // if (shareTag > -1) {
        //     console.log('我在授权奥');
        //     var wechat_appid = 'wxda8a6bcfc4cd5518'; // cplus  wx3580fbc434aacf74,  员工 wxda8a6bcfc4cd5518
        //     var wechat_redirect_uri = appUrl.split('&from=')[0];
        //     var wechat_redirect_uri_index = wechat_redirect_uri.split('?code=')[0];
        //     console.log('wechat_redirect_uri_index:' + wechat_redirect_uri_index);

        //     var wechat_redirect_uri_hash = wechat_redirect_uri.split('&state=123')[1];
        //     console.log('wechat_redirect_uri_hash:' + wechat_redirect_uri_hash);

        //     wechat_redirect_uri = wechat_redirect_uri_index + wechat_redirect_uri_hash;
        //     console.log('wechat_redirect_uri:' + wechat_redirect_uri);

        //     wechat_redirect_uri = encodeURIComponent(wechat_redirect_uri);
        //     var wechat_state = wechat_redirect_uri_hash + '&type=wxShare'; //'wxShare';
        //     wechat_state = wechat_state.split('#/')[1];
        //     console.log('wechat_state:' + wechat_state);
        //     wechat_state = escape(wechat_state);
        //     var authUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechat_appid + '&redirect_uri=' + wechat_redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=' + wechat_state + '#wechat_redirect';
        //     console.log('authUrl:' + authUrl);
        //     window.location.href = authUrl;
        // }
        //从授权页面进入的，需要登录操作
        console.log('要不要登录奥');
        if (appUrl.indexOf('wxShare') > -1) {
            console.log('我在登录奥');
            //获取url中的code
            var codeTmp = appUrl.split('code=')[1];
            var weiXincode = '';
            if (codeTmp.indexOf('&state') > -1) {
                weiXincode = codeTmp.split('&state')[0];
            } else {
                weiXincode = codeTmp.substring(0, codeTmp.length - 2);
            }
            axios({
                method: "POST",
                url: api.getUserInfo,
                params: {
                    weiXincode: weiXincode,
                    openId: ''
                }
            }).then(function(response) {
                if (response.data.code == 0) {
                    //存储用户openid
                    if (response.data.datas.login.rows && response.data.datas.login.rows.length > 0) {
                        sessionStorage.setItem("openId", response.data.datas.login.rows[0].openId);
                    }
                    callback();
                } else {
                    Toast('登陆失败:code=' + response.data.code);
                }
            }).catch(function(err) {
                Toast(err);
            });
        } else {
            //正常用户浏览
            console.log('正常用户浏览');
            callback();
        }
    }
};

export default wechatShare;