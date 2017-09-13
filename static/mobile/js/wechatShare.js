import axios from 'axios';
import api from '../../../src/api.js';
var wechatShare = {
    wechatShare: function(config) {
        var defaultConfig = config;
        // if (wx && wx.onMenuShareAppMessage && wx.onMenuShareTimeline && wx.onMenuShareQQ) {
        //     //获取“分享给朋友”按钮点击状态及自定义分享内容接口
        //     wx.onMenuShareAppMessage(defaultConfig);
        //     //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        //     wx.onMenuShareTimeline(defaultConfig);
        //     //分享到qq
        //     wx.onMenuShareQQ(defaultConfig);
        // }
    },
    authAndLogin: function(callback) {
        // var appUrl = window.location.href;

        // var totalUrl = appUrl.split('#/');
        // var targetIndex = totalUrl[0];
        // var targetHash = totalUrl[1];
        // //一个地址两个微信分享标识
        // if (targetIndex && targetIndex.indexOf('&from=') > -1 && targetHash && targetHash.indexOf('&from=') > -1) {
        //     targetIndex = targetIndex.split('&from=')[0];
        // }
        // appUrl = targetIndex + '#/' + targetHash;
        // //从授权页面进入的，需要登录操作
        // console.log('要不要登录奥');
        // if (appUrl.indexOf('wxShare') > -1) {
        //     console.log('我在登录奥');
        //     //获取url中的code
        //     var codeTmp = appUrl.split('code=')[1];
        //     var weiXincode = '';
        //     if (codeTmp.indexOf('&state') > -1) {
        //         weiXincode = codeTmp.split('&state')[0];
        //     } else {
        //         weiXincode = codeTmp.substring(0, codeTmp.length - 2);
        //     }
        //     axios({
        //         method: "POST",
        //         url: api.getUserInfo,
        //         params: {
        //             weiXincode: weiXincode,
        //             openId: ''
        //         }
        //     }).then(function(response) {
        //         if (response.data.code == 0) {
        //             //存储用户openid
        //             if (response.data.datas.login.rows && response.data.datas.login.rows.length > 0) {
        //                 sessionStorage.setItem("openId", response.data.datas.login.rows[0].openId);
        //             }
        //             callback();
        //         } else {
        //             Toast('登陆失败:code=' + response.data.code);
        //         }
        //     }).catch(function(err) {
        //         Toast(err);
        //     });
        // } else {
        //     //正常用户浏览
        //     console.log('正常用户浏览');
        //     callback();
        // }
        callback();
    },
    preventBodyScroll: function() {
        var overscroll = function(item) {
            if (item && item.length > 0) {
                item.forEach(function(el) {
                    el.addEventListener('touchstart', function() {
                        var top = el.scrollTop,
                            totalScroll = el.scrollHeight,
                            currentScroll = top + el.offsetHeight;
                        if (top === 0) {
                            el.scrollTop = 1;
                        } else if (currentScroll === totalScroll) {
                            el.scrollTop = top - 1;
                        }
                    });

                    el.addEventListener('touchmove', function(evt) {
                        if (el.offsetHeight < el.scrollHeight) {
                            evt._isScroller = true;
                        }
                        if (el.className.indexOf('sub-tag-container') > -1) {
                            console.log('sub-tag-container:evt._isScroller = true')
                            evt._isScroller = true;
                        }
                    });

                });
            }

        };
        console.log('.scroll')
        console.log(document.querySelectorAll('.scroll'));
        overscroll(document.querySelectorAll('.scroll'));
        document.body.addEventListener('touchmove', scrollCallback);
    },
    setImagePhotoSwipe: function(ele) {
        setTimeout(function() {
            var targetImgs = document.querySelectorAll(ele);
            console.log('photoswipe 结构替换开始,替换个数为' + targetImgs.length);
            for (var i = 0; i < targetImgs.length; i++) {
                var targetImg = targetImgs[i];
                var targetImgSrc = targetImg.src;
                var newImgUrl = '';

                var rw = targetImg.naturalWidth; // 真实图片宽度
                var rh = targetImg.naturalHeight; //真实图片高度

                var largeImgSize = rw + 'x' + rh;
                targetImg.className = 'my-picture-small';
                if (targetImgSrc.indexOf('fileToken') > -1) {
                    newImgUrl = targetImgSrc.replace(/type=\d+/g, 'type=3');
                } else {
                    newImgUrl = targetImgSrc;
                }
                if (targetImg.getAttribute("data-img-size-val")) {
                    largeImgSize = targetImg.getAttribute("data-img-size-val");
                    largeImgSize = largeImgSize.replace(',', 'x');
                }
                var newHtmlImg = '<div class="my-gallery" data-pswp-uid=""><figure><a class="my-picture-large" href="' + newImgUrl + '" data-size="' + largeImgSize + '">' + (targetImg.outerHTML ? targetImg.outerHTML : '') + '</a></figure></div>';
                console.log('item:-----' + newHtmlImg);

                var newNodeImg = document.createElement("div");
                newNodeImg.className = 'newNodeImg';
                newNodeImg.innerHTML = newHtmlImg;
                //console.log('that.customInfo.INFORMATION');
                //console.log(that.customInfo.INFORMATION);
                targetImg.parentNode.replaceChild(newNodeImg, targetImg);
                //targetImg.parentNode.innerHTML = newHtmlImg;
            }
            console.log('photoswipe 结构替换完毕');
            initPhotoSwipeFromDOM('.my-gallery');
        }, 50);
    }
};

export default wechatShare;