<template>
    <div class="billDetail-container" :style="{height:billDetailContainerHeight}">
        <div class="bh-pl-16 billDetail-content">
            <div class="bh-pv-16 h5 bill-h5">{{parentItem.NAME1?parentItem.NAME1:parentItem.NAME}}</div>
            <div class="bill-detail-items bh-pv-16">
                <div v-for="item in billDetails" class="bh-clearfix bh-pv-8 bh-pr-16">
                    <label class="bh-pull-left">{{item.NAME1}}</label>
                    <label class="bh-pull-right">{{item.PRICE}}</label>
                </div>
            </div>
            <div class="bh-pv-16 bh-border-t bh-clearfix">
                <label class="bh-pull-left" style="font-size: 15px;font-weight:600;">参考售价</label>
                <label class="bh-pull-right bh-color-danger-lv1 bh-pr-16">￥{{parentItem.PRICE}}</label>
                <label class="bh-pull-right" style="font-size: 12px;color: #666;line-height: 22px;">共{{billDetails.length}}个应用，合计</label>
                
            </div>
        </div>
        <div class="app-buttonContainer bh-clearfix bh-text-center">
            <div class="app-button bh-pv-4">
                <div class="app-col-6"><i class="iconfont icon-dianhua bh-color-warning-lv1"></i><div class="app-button-text"><a class="app-tel-line" :href="telephone">联系我</a></div></div>
            </div>
            <div type="warning" class="app-button as-bgColor-warning-lv1 bh-color-white bh-pv-16 bh-pull-right" @click="goContactionPage">了解更多</div> 
        </div>
    </div>
</template>
<style>
.billDetail-content {
    background-color: #fff;
    padding-bottom: 60px;
}
.bill-h5 {
    font-weight: 600;
    font-size: 18px;
    border-bottom:solid 1px #ddd;
}
.bill-detail-items {
    font-size: 15px;
}
.bh-border-t {
    border-top: solid 1px #eee;
    border-bottom: solid 1px #ddd;
}
</style>
<script>
    import { Button ,MessageBox,Toast} from 'bh-mint-ui2';
    import billItem from '../../components/billItem.vue';
    import api from '../../api.js';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    import axios  from 'axios';
    export default {
        data () {
            return {
                parentItem:{},
                billDetails:[],
                telephone:'',
                billDetailContainerHeight:''
            }
        },
        methods:{
            goContactionPage() {
                var item = {
                    FLAG:'2',
                    APP_ID:this.parentItem.WID
                };
                this.$router.push({
                  name: 'contaction',
                  query:item
                });
            },
            billDetailMain() {
              var that = this;
              sessionStorage.setItem("billSelectedTab","AlreadyGenerated");
              //设置billdetail框部分的高度
              this.billDetailContainerHeight = (document.body.clientHeight) + 'px';
              if(that.$route.query) {
                  that.parentItem = that.$route.query;
              }

              //微信分享
              var targetUrl = window.location.href.split('#/')[0];
              var targetPage = encodeURIComponent(targetUrl.split('?')[0]);
              var targetUrlHash = window.location.href.split('#/')[1];

              var tmpHref = window.location.href;

              tmpHref = tmpHref.replace('#/',',');
              // 查询报价单属性（根据wid）
              axios({
                  method:"POST",
                  url:api.queryBjdInWechat,
                  params:{
                      WID:that.parentItem.WID,
                      pageNum:1,
                      pageSize:999
                  }
              }).then(function(response){
                if (response.data.code == 0) {
                  if (response.data.datas.list.rows && response.data.datas.list.rows.length>0) {
                    //报价单属性
                    that.parentItem = response.data.datas.list.rows[0].quotations.rows[0];
                    that.parentItem.PRICE = that.parentItem.PRICE.toFixed(2);
                    wechatShare.wechatShare({
                       title: that.parentItem.NAME1, // 分享标题
                       desc: '参考售价 '+that.parentItem.PRICE, // 分享描述
                       link: tmpHref, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                                   TYPE:4,
                                   ID:that.parentItem.WID
                               }
                           }).then(function(response){

                           });
                       },
                       cancel: function() {
                           // 用户取消分享后执行的回调函数
                       }
                    });
                    //报价单详情
                    if (response.data.datas.list.rows[0].detail.rows && response.data.datas.list.rows[0].detail.rows.length >0) {
                      that.billDetails = response.data.datas.list.rows[0].detail.rows.map(function(item){
                          var tmpPrice = item.PRICE;
                          item.PRICE = tmpPrice.toFixed(2);
                          return item;
                      });
                    }
                    
                  }
                }
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
            wechatShare.authAndLogin(that.billDetailMain);
        },
        components:{
            [Button.name]: Button,
            [MessageBox.name]: MessageBox,
            [Toast.name]: Toast,
            billItem
        }
    }
</script>