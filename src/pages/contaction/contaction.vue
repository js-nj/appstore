<template>
    <div class="contact-content" :style="{height:contactHeight}">
        <div>
            <img class="contact-img" :src="'./static/assets/knowmore.png'" />
        </div>
        <div class="contact-forms">
            <mt-field label="联系人" placeholder="联系人" v-model="username"></mt-field>
            <!-- <div @click="getSchoolsFromCity">
               <mt-field label="学校" placeholder="学校" v-model="schoolname" ></mt-field>
            </div> -->
            <mt-field label="学校" placeholder="学校" v-model="schoolname" ></mt-field>
            <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email"></mt-field>
            <mt-field label="联系方式" placeholder="联系方式" type="tel" v-model="phone"></mt-field>
        </div>
        <div class="bh-ph-16 bh-pv-8 contact-buttonContainer">
           <mt-button type="warning" size="large" class="contact-button" @click="contactUs">提交</mt-button> 
        </div>
    </div>
</template>
<style>
.contact-content {
    background-color: #fff;
}
.contact-buttonContainer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    border-top: solid 1px #eee;
}
.contact-button {
    width: 100%;
}
.contact-img {
    width: 100%;
    height: 132px;
}
.contact-forms .mint-cell-wrapper {
    background-image: -webkit-linear-gradient(top, #eee, #eee 50%, transparent 50%);
}
.contact-forms .mint-cell:last-child {
    background-image: -webkit-linear-gradient(top, #eee, #eee 50%, transparent 50%);
}
.mint-field-clear {
    display: none;
}
</style>
<script>
    import { Button ,MessageBox,Field,Toast} from 'bh-mint-ui2';
    import api from '../../api.js';
    import axios  from 'axios';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    export default {
        data () {
            return {
                username:'',
                schoolname:'',
                email:'',
                phone:'',
                contactHeight:''
            }
        },
        methods:{
            contactUs() {
                var self = this;
                if (!self.username) {
                    Toast('请填写联系人');
                    return;
                }
                if (!self.schoolname) {
                    Toast('请填写学校');
                    return;
                }
                if (self.email) {
                    if (self.email.indexOf('@')==-1) {
                        Toast('邮箱格式不正确');
                        return;
                    }  
                }else {
                    Toast('请填写邮箱');
                    return;
                }
                var parentRouterInfo = self.$route.query;
                //提交联系人信息
                axios({
                    method:"POST",
                    url:api.saveUserInfo,
                    params:{
                        LXR:self.username,
                        XX:self.schoolname,
                        LXFS:self.phone?self.phone:'',
                        YX:self.email,
                        FLAG:parentRouterInfo.FLAG,
                        APP_ID:parentRouterInfo.APP_ID
                    }
                }).then(function(response){
                  //debugger
                  if (response.data.code == 0) {
                    Toast('提交信息成功');
                    history.back();
                  }else {
                    Toast('提交信息失败');
                    history.back();
                  }
                }).catch(function(err){
                  Toast(err);
                });
            },
            loginUserInfo(){
                var that = this;
                //请求联系人信息
                axios({
                    method:"POST",
                    url:api.loginUserInfo,
                    params:{
                    }
                }).then(function(response){
                  //debugger
                  if (response.data.code == 0) {
                    var responseData = response.data.datas.loginUserInfo.rows;
                    if (responseData && responseData.length>0) {
                        that.username = responseData[0].LXR;
                        that.schoolname = responseData[0].XX;
                        that.email = responseData[0].YX;
                        that.phone = responseData[0].LXFS;
                    }
                  }else {
                    Toast('查询联系人信息失败');
                  }
                }).catch(function(err){
                  Toast(err);
                });
            },
            getSchoolsFromCity() {
                var self = this;
                alert('click执行'+BH_MIXIN_SDK.wx.getLocation);
                console.log('微信sdk：'+BH_MIXIN_SDK.wx);
                alert(BH_MIXIN_SDK.wx.getLocation);
                BH_MIXIN_SDK.wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        console.log('经纬度：'+latitude +'/'+longitude);
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        self.cityname(latitude,longitude);
                        alert('getLocation success 执行');
                    },
                    fail:function(res){
                        console.log('经纬度：',JSON.stringify(res));
                    }
                });
            },
            //将经纬度转换成城市名和街道地址，参见百度地图接口文档：http://developer.baidu.com/map/index.php?title=webapi/guide/webservice-geocoding
            cityname(latitude, longitude, callback) {
                alert('cityname  执行');
                //通过经纬度获取城市名称
                axios({
                    method:"GET",
                    url:'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + latitude + ',' + longitude + '&output=json&pois=1',
                    params:{}
                }).then(function(response){
                  if (response.data) {
                        alert('cityname ajax  执行');
                        console.log('城市返回值：'+data);
                        var province = response.data.result.addressComponent.province;
                        var cityname = response.data.result.addressComponent.city;
                        var district = response.data.result.addressComponent.district;
                        var street = response.data.result.addressComponent.street;
                        var street_number = response.data.result.addressComponent.street_number;
                        var formatted_address = response.data.result.formatted_address;
                        Toast('城市：'+cityname);
                        localStorage.setItem("province", province);
                        localStorage.setItem("cityname", cityname);
                        localStorage.setItem("district", district);
                        localStorage.setItem("street", street);
                        localStorage.setItem("street_number", street_number);
                        localStorage.setItem("formatted_address", formatted_address);
                  }else {
                    alert('获取城市失败');
                  }
                }).catch(function(err){
                  alert(err);
                });
                // $.ajax({
                //     url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + latitude + ',' + longitude + '&output=json&pois=1',
                //     type: "get",
                //     dataType: "jsonp",
                //     jsonp: "callback",
                //     success: function (data) {
                //         console.log(data);
                //         var province = data.result.addressComponent.province;
                //         var cityname = (data.result.addressComponent.city);
                //         var district = data.result.addressComponent.district;
                //         var street = data.result.addressComponent.street;
                //         var street_number = data.result.addressComponent.street_number;
                //         var formatted_address = data.result.formatted_address;
                //         localStorage.setItem("province", province);
                //         localStorage.setItem("cityname", cityname);
                //         localStorage.setItem("district", district);
                //         localStorage.setItem("street", street);
                //         localStorage.setItem("street_number", street_number);
                //         localStorage.setItem("formatted_address", formatted_address);
                //         //domTempe(cityname,latitude,longitude);
                //         var data = {
                //             latitude: latitude,
                //             longitude: longitude,
                //             cityname: cityname
                //         };
                //         if (typeof callback == "function") {
                //             callback(data);
                //         }
                //     }
                // });
            },
        },
        created() {
            //设置contact中间内容部分的高度
            this.contactHeight = document.body.clientHeight + 'px';
            BH_MIXIN_SDK.setTitleText('了解更多');
            this.loginUserInfo();
            var contactionUrl = window.location.href.split('#/')[0] + '#/?';
            wechatShare.wechatShare({
                 title: '主页', // 分享标题
                 desc: '主页', // 分享描述
                 link: contactionUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                 imgUrl: 'http://www.baidu.com/img/bd_logo1.png', // 分享图标
                 type: '', // 分享类型,music、video或link，不填默认为link
                 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                 success: function() {
                     // 用户确认分享后执行的回调函数
                     // 统计分享的类型与ID
                     axios({
                         method:"POST",
                         url:api.staticsOfShareApp,
                         params:{
                             TYPE:1
                         }
                     }).then(function(response){

                     });
                 },
                 cancel: function() {
                     // 用户取消分享后执行的回调函数
                 }
            });
        },
        components:{
            [Button.name]: Button,
            [MessageBox.name]: MessageBox,
            [Field.name]: Field,
            [Toast.name]: Toast
        }
    }
</script>