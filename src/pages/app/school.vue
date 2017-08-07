<template>
    <div :style="{height:schoolContainerHeight}">
        <div class="school-title bh-ph-16 bh-pv-8 bh-color-gray-lv2">
            <label>{{appName}}</label>
            <label class="school-title-num">{{appServiceNum}}所高校</label>
        </div>
        <div class="school-items bh-pt-32">
          <mt-loadmore  v-if="customerCases.length>0" :bottom-method="loadBottom" :autoFill="false" :bottom-all-loaded="allLoaded" ref="loadmore" >
            <list-item :items="customerCases"></list-item>
            <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded && customerCases.length>5">暂无更多数据</div>
          </mt-loadmore>
          
        </div>
    </div>
</template>
<style>
.school-title {
    font-size: 14px;
    background-color: #f6f6f6;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
}
.school-title-num {
    float: right;
}
.school-items .as-lists {
  border-bottom: solid 1px #eee;
}

</style>
<script>
    import { Button ,MessageBox,Toast,Loadmore} from 'bh-mint-ui2';
    import listItem from '../../components/listItem.vue';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    import api from '../../api.js';
    import axios  from 'axios';
    export default {
        data () {
            return {
                appName:'',
                appServiceNum:'',
                customerCases:[],
                schoolContainerHeight:'',
                allLoaded:false,
                noFlag:false
            }
        },
        // routes: {
        //     beforeRouteLeave (to, from, next) {
        //       sessionStorage.setItem('schoolPageNum','');
        //     }
        // },
        methods:{
            setImgUrlFromId(id) {
              return WEBPACK_CONIFG_HOST +'sys/appstoreservice/attrs/preview.do?token=' + id+'&type=3';
            },
            loadBottom(){
              this.requestSchools();
            },
            requestSchools(){
              var that = this;
              var pageNumTmp = sessionStorage.getItem('schoolPageNum');
              if (pageNumTmp) {
                pageNumTmp = Number(pageNumTmp) +1;
              }
              //正在服务学校
              axios({
                  method:"POST",
                  url:api.appsCount,
                  params:{
                      APP_ID:JSON.parse(that.$route.query.item).WID,
                      pageNum:pageNumTmp?pageNumTmp:1,
                      pageSize:15
                  }
              }).then(function(response){
                var responseData = response.data.datas.appscount.rows;
                if (response.data.code == 0) {
                    if (responseData && responseData.length>0) {
                      // that.customerCases = responseData.map(function(item){
                      //   item.APP_COUNT=item.APPCOUNT;
                      //   item.TYPE = 'custom';
                      //   item.BADGE = that.setImgUrlFromId(item.BADGE);
                      //   item.APP_ID = JSON.parse(that.$route.query.item).WID;
                      //   item.PARENTTYPE = 'school';
                      //   return item;
                      // });
                      responseData.map(function(item){
                        var itemObj = item;
                        itemObj.APP_COUNT=item.APPCOUNT;
                        itemObj.TYPE = 'custom';
                        itemObj.BADGE = that.setImgUrlFromId(item.BADGE);
                        itemObj.APP_ID = JSON.parse(that.$route.query.item).WID;
                        itemObj.PARENTTYPE = 'school';
                        that.customerCases.push(itemObj);
                      });
                      if (responseData.length < response.data.datas.appscount.pageSize) {
                        that.allLoaded = true;
                        if (that.$refs.loadmore) {
                          that.$refs.loadmore.onBottomLoaded();
                        } 
                      }else if (responseData.length == response.data.datas.appscount.pageSize) {
                        sessionStorage.setItem('schoolPageNum',response.data.datas.appscount.pageNumber);
                      }
                    }
                }else {
                  Toast('获取数据失败');
                }
              }).catch(function(err){
                Toast(err);
              });
            }
        },
        created() {
          var that = this;
          BH_MIXIN_SDK.setTitleText('正在服务学校');
          //设置billdetail框部分的高度
          that.schoolContainerHeight = (document.body.clientHeight) + 'px';
          that.appName =JSON.parse(that.$route.query.item).NAME1;
          that.appServiceNum = JSON.parse(that.$route.query.item).SCHOOL_COUNT;
          sessionStorage.setItem('schoolPageNum','');
          that.requestSchools();
          var schoolUrl = window.location.href.split('#/')[0] + '#/?';
          wechatShare.wechatShare({
             title: '主页', // 分享标题
             desc: '主页', // 分享描述
             link: schoolUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
            [Toast.name]: Toast,
            [Loadmore.name]: Loadmore,
            listItem
        }
    }
</script>