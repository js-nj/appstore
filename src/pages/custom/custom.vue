<template>
    <div >
        <custom-case :details="info" :targetApp="targetApp" :style="{height:customContentHeight}"></custom-case>
    </div>
</template>
<style>
.custom-buttonContainer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    border-top:solid 1px #eee;
}
.custom-button {
    width: 100%;
}
</style>
<script>
    import { Button ,MessageBox,Toast} from 'bh-mint-ui2';
    import customCase from '../../components/customCase.vue';
    import api from '../../api.js';
    import axios  from 'axios';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    export default {
        data () {
            return {
                info:{},
                parentInfo:{},
                targetApp:{},
                telephone:''
            }
        },
        methods:{
            setImgUrlFromId(id) {
                return WEBPACK_CONIFG_HOST +'sys/appstoreservice/attrs/preview.do?token=' + id+'&type=3';
            },
            customMain() {
                var that = this;
                BH_MIXIN_SDK.setTitleText('案例详情');
                
                //设置custom中间内容部分的高度
                that.customContentHeight = (document.body.clientHeight) + 'px';
                var routeInfo = that.$route.query;
                
                //应用tab案例
                axios({
                    method:"POST",
                    url:api.queryCustom,
                    params:{
                        APP_ID:routeInfo.APP_ID
                    }
                }).then(function(response){
                  if (response.data.code == 0) {
                    if (response.data.datas.customer.rows && response.data.datas.customer.rows.length>0) {
                        that.info = response.data.datas.customer.rows[0].CUSTOMER.rows[0];
                        if (response.data.datas.customer.rows[0].SCHOOL.rows && response.data.datas.customer.rows[0].SCHOOL.rows.length>0) {
                           that.parentInfo = response.data.datas.customer.rows[0].SCHOOL.rows[0];
                           that.info.BADGE = that.setImgUrlFromId(that.parentInfo.BADGE);
                        }
                        that.info.TYPE = 'indexView';
                        //that.info.BADGE = that.setImgUrlFromId(that.info.BADGE);
                        console.log('that.info');
                        console.log(that.info.INFORMATION);
                        console.log('that.info end');
                        if(that.info.INFORMATION){
                            console.log('old:'+that.info.INFORMATION);
                            var regString = /getFileByToken\/(\w+)\.do/g;
                            that.info.INFORMATION = that.info.INFORMATION.replace(regString,'getSingleImageByToken.do?fileToken=$1&type=3');
                            //console.log('old:'+this.details.INFORMATION);
                            that.info.INFORMATION = that.info.INFORMATION.replace(/\\/g,'');
                            console.log('new:'+that.info.INFORMATION);
                        }
                        //微信分享
                        var targetUrl = window.location.href.split('#/')[0];
                        var targetPage = encodeURIComponent(targetUrl.split('?')[0]);
                        var targetUrlHash = window.location.href.split('#/')[1];
   
                        var tmpHref = window.location.href;

                        tmpHref = tmpHref.replace('#/',',');
                        wechatShare.wechatShare({
                            title: that.info.SCHOOL_BM_DISPLAY, // 分享标题
                            desc: '我是客户案例的描述文字', // 分享描述
                            link: tmpHref, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: that.info.BADGE, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function() {
                                // 用户确认分享后执行的回调函数
                                // 统计分享的类型与ID
                                axios({
                                    method:"POST",
                                    url:api.staticsOfShareApp,
                                    params:{
                                        TYPE:3,
                                        ID:routeInfo.APP_ID
                                    }
                                }).then(function(response){

                                });
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        //请求案例对应的应用
                        axios({
                            method:"POST",
                            url:api.appsDetail,
                            params:{
                                WID:that.info.APP_ID
                            }
                        }).then(function(subresponse){
                          if (subresponse.data.code == 0) {
                            if (subresponse.data.datas.detail.rows && subresponse.data.datas.detail.rows.length>0) {
                                that.targetApp = subresponse.data.datas.detail.rows[0];
                                that.targetApp.IMAGE = that.setImgUrlFromId(that.targetApp.IMAGE);    
                            }
                          }else {
                            console.log('请求案例对应的应用失败');
                          }
                        }).catch(function(err){
                          Toast(err);
                        });
                    }  
                  }else {
                    Toast('获取数据失败');
                  }
                }).catch(function(err){
                  Toast(err);
                });
                //查询系统电话
                axios({
                    method:"POST",
                    url:api.sysSetting
                }).then(function(response){
                  if (response.data.code == 0) {
                    if (response.data.datas.setting.rows) {
                        that.telephone = 'tel:'+response.data.datas.setting.rows[0].LXFS;
                    }
                  }else {
                    Toast('获取系统电话失败');
                  }
                }).catch(function(err){
                  Toast(err);
                }); 
            }
        },
        created() {
            var that = this;
            wechatShare.authAndLogin(that.customMain);
        },
        components:{
            [Button.name]: Button,
            [MessageBox.name]: MessageBox,
            [Toast.name]: Toast,
            customCase
        }
    }
</script>