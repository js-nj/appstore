<template>
    <div>
        <mt-tab-container v-model="selected">
          <!-- 首页，推荐应用 -->
          <mt-tab-container-item id="bestRecomend" >
              <div class="as-index-search-instead" @click="goSubClassification({parentIndex:'index'})"></div>
              <div class="as-index-searchBg" >
                <img class="as-index-searchImg" :src="'./static/assets/indexSearch.png'" />
                <mt-search
                  v-model="value"
                  cancel-text="取消"
                  :placeholder="placeholder" class="as-search">
                </mt-search>
              </div>
              <com-test :imgs="imgs"></com-test>
              <div class="as-content" id="as-index-items">
                <!-- tab模板 -->
                <div v-for="item in mainDatas" v-if="item.tabContent.length>0">
                 <div class="bh-pv-16 as-tab">
                   <div class="as-tab-content bh-ph-16" :class="item.tabType">
                     <p class="as-tab-title">{{item.tabName}}</p>                  
                   </div>
                 </div>
                 <list-item :items="item.tabContent"></list-item>
               </div>
              </div>
          </mt-tab-container-item>
          <!-- 应用分类 -->
          <mt-tab-container-item id="appType">
            <div>
              <div class="appType-header bh-pv-16">
                <div class="bh-clearfix  appType-item as-pv-11" @click="goSubClassification(totalApp)">
                  <img class="appType-item-img" :src="totalApp.IMG" /><label class="appType-item-title bh-ph-16">{{totalApp.TITLE}}</label>
                  <label class="appType-item-cout bh-color-gray-lv3">
                      <span>{{totalApp.APP_COUNT}}</span>个应用<div class="appType-item-arrow bh-mh-8"></div>
                  </label>
                </div>
              </div>
              <div class="appType-body">
                <div class="bh-clearfix  as-pv-11 appType-item bh-ml-16" v-for="item in classifications" @click="goSubClassification(item)">
                    <img class="appType-item-img" :src="item.IMG" /><label class="appType-item-title bh-ph-16">{{item.LBMC}}</label>
                    <label class="appType-item-cout bh-color-gray-lv3">
                        <span>{{item.APP_COUNT}}</span>个应用<div class="appType-item-arrow bh-mh-8"></div>
                    </label>
                </div>
              </div>
            </div>
          </mt-tab-container-item>
          <!-- 我的清单 -->
          <mt-tab-container-item id="myBill">
            <div class="bh-pb-32 bh-mb-32 myBill">
                <mt-navbar v-model="billSelected">
                  <mt-tab-item id="toBeGenerated">待生成</mt-tab-item>
                  <mt-tab-item id="AlreadyGenerated">已生成</mt-tab-item>
                </mt-navbar>
                <!-- tab-container -->
                <mt-tab-container v-model="billSelected" class="bh-mt-4">
                  <mt-tab-container-item id="toBeGenerated">
                    <div v-if="this.billList.length == 0 && !this.billSearchTag" class="bh-text-center mybill-empty-tips" :style="{height:mybillTabcontentWidth}">
                      <div class="mybill-empty-content">
                        <div>
                          <img :src="'./static/assets/noresult.png'" />
                        </div>
                        <p class="bh-pv-16" style="font-size:15px;color:#666;">暂无内容,去精品推荐看看</p>
                        <div class="bh-ph-16 bh-pv-8 as-noresult-button" style="width:130px;margin:0 auto;">
                           <mt-button type="warning" size="large" class="" @click="goSelectedTab('bestRecomend')">去看看</mt-button> 
                        </div>
                      </div>  
                    </div>
                    <div v-else :style="{height:mybillTabcontentWidth}" >
                        <div class="sub-tag-container scroll">
                           <div class="sub-title bh-pv-16 bh-color-gray-lv2" :style="{width:subTagCont}" >
                                <label  class="sub-tag" :class="{'sub-tag-selected':subTagAll}" @click="setTagSelected()">全部</label>
                                <label class="sub-tag" v-for="(item,index) in classifications" :class="{'sub-tag-selected': !subTagAll && index === tagIndex}"  @click="setTagSelected(item.LBDM,index)">{{item.LBMC}}</label>
                            </div> 
                        </div>
                        <bill-item  v-if="this.billList.length>0" :items="billList"  :allLoaded="allLoadedIndex"  v-on:deleteAllSelectedItems="deleteAllSelectedItems" v-on:generatedBill="updateBillItems" v-on:toBeGeneratedLoadMore="toBeGeneratedIndexLoadMore"></bill-item>
                        <div v-else class="sub-class-noresult">
                            无该分类应用
                        </div>
                    </div>
                  </mt-tab-container-item>
                  <mt-tab-container-item id="AlreadyGenerated">
                    <div v-if="this.billGenerated.length == 0" class="bh-text-center mybill-empty-tips " :style="{height:mybillTabcontentWidth}">
                      <div class="mybill-empty-content">
                        <div>
                          <img :src="'./static/assets/noresult.png'" />
                        </div>
                        <p class="bh-pv-16" style="font-size:15px;color:#666;">暂无内容,去精品推荐看看</p>
                        <div class="bh-ph-16 bh-pv-8 as-noresult-button" style="width:130px;margin:0 auto;">
                           <mt-button type="warning" size="large" class="" @click="goSelectedTab('bestRecomend')">去看看</mt-button> 
                        </div>
                      </div>
                    </div>
                    <bill-generated v-else :items="billGenerated" v-on:AlreadyGeneratedLoadMore="AlreadyGeneratedIndexLoadMore" :allLoaded2="allLoadedGeneratedIndex"></bill-generated>
                  </mt-tab-container-item>
                </mt-tab-container> 
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
        <!-- tabbar -->
        <mt-tabbar v-model="selected" :fixed='true' class="as-index-tabbar" style="display:none;">
          <mt-tab-item id="bestRecomend">
            <div>
              <div class="tab-icon" :class="classBestRecomend"></div>
            </div>
            精品推荐
          </mt-tab-item>
          <mt-tab-item id="appType" >
            <div>
              <div class="tab-icon" :class="classAppType"></div>
            </div>
            应用分类
          </mt-tab-item>
          <mt-tab-item id="myBill" >
            <div>
              <div class="tab-icon" :class="classMyBill" style="position:relative;"><i class="as-bill-uncheck" v-show="asBillUncheck"></i></div>
            </div>
            我的清单
          </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script type="text/javascript">
    import { 
      Navbar,
      TabItem,
      Swipe, 
      SwipeItem,
      Search,
      Header,
      Button,
      Cell,
      TabContainer,
      TabContainerItem,
      Tabbar,
      Toast
    } from 'bh-mint-ui2';
    import axios  from 'axios';
    import _ from 'lodash'; //引入lodash
    import comTest from '../../components/comTest.vue';
    import listItem from '../../components/listItem.vue';
    import billItem from '../../components/billItem.vue';
    import billGenerated from '../../components/billGenerated.vue';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    import api from '../../api.js';

    //请求canceltoken列表
    let sources = [];
    export default {
        data(){
            return {
                mainDatas:[{
                  tabName:'热门应用',
                  tabContent:[],
                  tabType:'as-tabColor-yellow'
                },
                {
                  tabName:'最新应用',
                  tabContent:[],
                  tabType:'as-tabColor-yellow'
                },
                {
                  tabName:'客户案例',
                  tabContent:[],
                  tabType:'as-tabColor-primary'
                }],
                placeholderDefault:'个应用，为您服务',
                placeholder:'',
                billSelected:'toBeGenerated',
                selected:'bestRecomend',
                classBestRecomend:'tab-icon-bestRecomend-selected',
                classAppType:'tab-icon-appType',
                classMyBill:'tab-icon-myBill',
                value:'',
                page: 'about',
                imgs:[],
                removeItems:[],
                hotApps:[],
                newApps:[],
                customerCases:[],
                selfDefineTabs:[],
                selfDefineTabsTmp:[],
                classifications:[],
                totalApp:{
                  TITLE:'全部',
                  APP_COUNT:'',
                  IMG:'./static/assets/all-icon.png',
                  parentIndex:'totalApp'
                },
                billList:[],
                billGenerated:[],
                tagIndex:'',
                subTagCont:'100%',
                subTagAll:true,
                mybillTabcontentWidth:'',
                billSearchTag:false,
                allLoadedIndex:false,
                allLoadedGeneratedIndex:false,
                asBillUncheck:window.asBillUncheck
                //loadmoreBillItem:'loadmoreBillItem'
            }
        },
        watch:{
          selected:function(value,oldvalue){
            switch(value){
              case 'bestRecomend':
                  this.classBestRecomend = 'tab-icon-bestRecomend-selected';
                  this.classAppType = 'tab-icon-appType';
                  this.classMyBill = 'tab-icon-myBill';
                  sessionStorage.setItem("selectedTab",'bestRecomend');
                  //清除bill Tab 的默认子tab
                  sessionStorage.setItem("billSelectedTab",'');
                  sessionStorage.setItem('subClassificationPageNum','');
                  BH_MIXIN_SDK.setTitleText('精品推荐');
                  console.log('removeEventListener')
                  document.body.removeEventListener('touchmove', scrollCallback);
                  this.requestBestRecomendAjax();
                  this.allLoadedGeneratedIndex = false;
                  this.allLoadedIndex = false;
                  break;
              case 'appType':
                  this.classBestRecomend = 'tab-icon-bestRecomend';
                  this.classAppType = 'tab-icon-appType-selected';
                  this.classMyBill = 'tab-icon-myBill';
                  sessionStorage.setItem("selectedTab",'appType');
                  //清除bill Tab 的默认子tab
                  sessionStorage.setItem("billSelectedTab",'');
                  BH_MIXIN_SDK.setTitleText('应用分类');
                  console.log('removeEventListener')
                  document.body.removeEventListener('touchmove', scrollCallback);
                  if (this.classifications.length == 0) {
                    this.requestAppTypeAjax();
                  }
                  this.allLoadedGeneratedIndex = false;
                  this.allLoadedIndex = false;
                  break;
              case 'myBill':
                  this.classBestRecomend = 'tab-icon-bestRecomend';
                  this.classAppType = 'tab-icon-appType';
                  this.classMyBill = 'tab-icon-myBill-selected';
                  sessionStorage.setItem("selectedTab",'myBill');
                  BH_MIXIN_SDK.setTitleText('我的清单');
                  sessionStorage.setItem('toBeGeneratedPageNum','');
                  sessionStorage.setItem('AlreadyGeneratedPageNum','');
                  sessionStorage.setItem('subClassificationPageNum','');
                  this.billList = [];
                  this.billGenerated=[];
                  if (sessionStorage.getItem("billSelectedTab")!='AlreadyGenerated') {
                    this.asBillUncheck = false;
                    this.allLoadedIndex = false;
                  }else {
                    console.log('this.allLoadedGeneratedIndex = false mybill')
                    this.allLoadedGeneratedIndex = false;
                    //document.body.removeEventListener('touchmove', scrollCallback);
                  }
                  this.requestMyBillAjax();
                  break;
            }
          },
          billSelected:function(value,oldvalue){
            switch(value){
              case 'toBeGenerated':
                  this.asBillUncheck = false;
                  sessionStorage.setItem("billSelectedTab",'toBeGenerated');
                  break;
              case 'AlreadyGenerated':
                  console.log('this.allLoadedGeneratedIndex = false billSelected')
                  //this.allLoadedGeneratedIndex = false;
                  //document.body.removeEventListener('touchmove', scrollCallback);
                  sessionStorage.setItem("billSelectedTab",'AlreadyGenerated');
                  break;
            }
          },
          asBillUncheck:function(value,oldvalue){
              localStorage.setItem("asBillUncheck",value);
              console.log(localStorage.getItem("asBillUncheck"))
          }
        },
        created() {
          var that = this;
          if (localStorage.getItem("asBillUncheck") == 'true') {
            that.asBillUncheck = true;
          }
          BH_MIXIN_SDK.setTitleText('APP STORE');
          
          // setTimeout(function(){
          //       console.log('preventBodyScroll-index')
          //       wechatShare.preventBodyScroll();
          //   },1000);
          var indexUrl = window.location.href;
          console.log('indexUrl:'+indexUrl);
          //var shareIndexUrl = indexUrl.replace('123','?');
          //console.log('shareIndexUrl:'+shareIndexUrl)
          //shareIndexUrl = shareIndexUrl.replace('&from=singlemessage','');
          wechatShare.wechatShare({
             title: document.title, // 分享标题
             desc: '首页首页首页首页', // 分享描述
             link: indexUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                        TYPE:1,
                        ID:''
                    }
                }).then(function(response){

                });
             },
             cancel: function() {
                 // 用户取消分享后执行的回调函数
             }
          });
          //获取url中的code
          var codeTmp = location.href.split('code=')[1];
          var weiXincode = '';
          if (codeTmp.indexOf('&state')>-1) {
            weiXincode = codeTmp.split('&state')[0];
          }else {
            weiXincode = codeTmp.substring(0,codeTmp.length - 2);
          }
          //获取用户openid
          var openidTmp = sessionStorage.getItem("openId");

          axios({
              method:"POST",
              url:api.getUserInfo,
              params:{
                  weiXincode:weiXincode,
                  openId:openidTmp?openidTmp:''
              }
          }).then(function(response){
            //debugger
            if (response.data.code == 0) {
              //console.log('获取用户信息成功');
              //存储用户openid
              if (response.data.datas.login.rows && response.data.datas.login.rows.length>0) {
                sessionStorage.setItem("openId",response.data.datas.login.rows[0].openId);
              }
              that.requestBestRecomendAjax();
            }else if(response.data.code == -2){
              Toast('登陆失败');
            }else {
              Toast('获取数据失败');
            }
          }).catch(function(err){
            Toast(err);
          });

          //判断是否有路由跳转信息，有的话，修改默认tab页
          if (sessionStorage.getItem("selectedTab")) {
            that.selected = sessionStorage.getItem("selectedTab");
          }
          //debugger
          if (that.selected == 'myBill') {
            that.billSelected = sessionStorage.getItem("billSelectedTab")?sessionStorage.getItem("billSelectedTab"):'toBeGenerated';
          }
          //设置bill中间内容部分的高度
          that.mybillTabcontentWidth = (document.body.clientHeight - 51 - 43) + 'px';//51是底部导航栏的高度 43是顶部tab头的高度
          document.getElementsByTagName('body')[0].style.height = document.body.clientHeight+'px';
        },
        methods:{
          requestBestRecomendAjax() {
            var self = this;
            //tab页进来重新请求
            self.mainDatas = [{
              tabName:'热门应用',
              tabContent:[],
              tabType:'as-tabColor-yellow'
            },
            {
              tabName:'最新应用',
              tabContent:[],
              tabType:'as-tabColor-yellow'
            },
            {
              tabName:'客户案例',
              tabContent:[],
              tabType:'as-tabColor-primary'
            }];
            //轮播图数据
            axios({
                method:"POST",
                url:api.appsLbtList,
                params:{
                    pageNum:1,
                    pageSize:8
                }
            }).then(function(response){
              var responseData = response.data.datas.lbtList.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length > 0) {
                  self.imgs = responseData.map(function(item){
                      //获取图片src数据流,从id到url
                      item.YDTP = self.setImgUrlFromId(item.YDTP);
                      //item.PIC = item.YDTP;
                      return item;
                  });
                }
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            //热门应用
            axios({
                method:"POST",
                url:api.appsRmyyList,
                params:{
                    pageNum:1,
                    pageSize:15
                }
            }).then(function(response){
              var responseData = response.data.datas.rmyyList.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length>0) {
                  self.hotApps = responseData.map(function(item){
                    item.TYPE = 'app';
                    //item.PIC = item.IMAGE;
                    item.IMAGE = self.setImgUrlFromId(item.IMAGE);
                    return item;
                  });
                  self.mainDatas[0].tabContent = self.hotApps;
                } 
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            //最新应用
            axios({
                method:"POST",
                url:api.appsZxyyList,
                params:{
                    pageNum:1,
                    pageSize:6
                }
            }).then(function(response){
              var responseData = response.data.datas.zxyyList.rows;
              if (response.data.code == 0 ) {
                if (responseData && responseData.length>0) {
                  self.newApps = responseData.map(function(item){
                      item.TYPE = 'app';
                      //item.PIC = item.IMAGE;
                      item.IMAGE = self.setImgUrlFromId(item.IMAGE);
                      return item;
                  });
                  self.mainDatas[1].tabContent = self.newApps;
                }  
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            //客户案例
            axios({
                method:"POST",
                url:api.appsKhalList,
                params:{
                    pageNum:1,
                    pageSize:6
                }
            }).then(function(response){
              var responseData = response.data.datas.khalList.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length>0) {
                  self.customerCases = responseData.map(function(item){
                      item.TYPE = 'custom';
                      //item.PIC = item.BADGE;
                      item.BADGE = self.setImgUrlFromId(item.BADGE);
                      return item;
                  });
                  self.mainDatas[2].tabContent = self.customerCases;
                }
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            //自定义tab类型
            axios({
                method:"POST",
                url:api.zdyTab,
                params:{
                    pageNum:1,
                    pageSize:15
                }
            }).then(function(response){
              var responseData = response.data.datas.list.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length>0) {
                  self.selfDefineTabs = responseData;
                  //循环每一个自定义的tab
                  //var selfDefineTabsArray = [];
                  self.selfDefineTabs.forEach(function(sub,num){
                      sub.tabType = 'as-tabColor-purple';
                      sub.tabName = sub.NAME1;
                      sub.tabContent = [];
                      //请求对应tab内的list内容
                      axios({
                          method:"POST",
                          url:api.zdyList,
                          params:{
                              TAB_ID:sub.WID,
                              pageNum:1,
                              pageSize:6
                          }
                      }).then(function(subresponse){
                        var subresponseData = subresponse.data.datas.zdyList.rows;
                        if (subresponse.data.code == 0) {
                          if (subresponseData && subresponseData.length>0) {
                            var tmpObj= {
                              tabContent:[]
                            };
                            tmpObj.tabContent = subresponseData.map(function(app){
                                app.IMAGE = self.setImgUrlFromId(app.IMAGE);
                                app.TYPE = 'app';
                                return app;
                            });
                            // debugger
                            self.$set(self.selfDefineTabs, num, _.extend(sub,tmpObj));
                            //根据请求结构更新父结构的子数据
                            self.$set(self.mainDatas, num + 3, self.selfDefineTabs[num]);   
                          }else {
                            console.log('self.mainDatas:'+self.mainDatas.length)
                            //无子数据的分类删除掉
                            //self.mainDatas.splice(num + 3,1);
                          }
                        }else {
                          Toast('获取自定义栏内容失败');
                        }
                      }).catch(function(err){
                        Toast(err);
                      });
                      //按照请求数据的顺序先导入父结构
                      self.mainDatas = self.mainDatas.concat(self.selfDefineTabs[num]);
                  });
                }  
              }else {
                Toast('获取自定义栏失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            //应用类型(全部)
            axios({
                method:"POST",
                url:api.appsList,
                params:{
                  APPTYPE:'',
                  BQ:'',
                  Condition:''
                }
            }).then(function(response){
              if (response.data.code == 0) {
                self.totalApp.APP_COUNT = response.data.datas.list.totalSize;
                self.placeholder = self.totalApp.APP_COUNT + self.placeholderDefault;
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
          },
          requestAppTypeAjax() {
            var self = this;
            //应用类型
            axios({
                method:"POST",
                url:api.appYyflSum,
                params:{
                    pageNum:1,
                    pageSize:15
                }
            }).then(function(response){
              var responseData = response.data.datas.yyflSum.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length>0) {
                  self.classifications = responseData.map(function(item){
                      switch(item.LBDM) {
                        case '12':
                          item.IMG = './static/assets/hr-icon.png';
                          break;
                        case '01':
                          item.IMG = './static/assets/sw-icon.png';
                          break;
                        case '02':
                          item.IMG = './static/assets/teach-icon.png';
                          break;
                        case '23':
                          item.IMG = './static/assets/oa-icon.png';
                          break;
                        case '22':
                          item.IMG = './static/assets/postgraduate-icon.png';
                          break;
                        case '20':
                          item.IMG = './static/assets/service-icon.png';
                          break;
                        case '19':
                          item.IMG = './static/assets/other-icon.png';
                          break;
                        case '13':
                          item.IMG = './static/assets/dollar-icon.png';
                          break;
                        case '16':
                          item.IMG = './static/assets/zs-icon.png';
                          break;
                        default:
                          item.IMG = './static/assets/other-icon.png';
                      }
                      return item;
                  });
                }
                //设置标签容器的长度
                if (self.classifications.length > 3) {
                    self.subTagCont = (88 * (self.classifications.length + 1))+'px'; 
                  }
              }else {
                Toast('获取数据失败');
              }
            }).catch(function(err){
              Toast(err);
            });
            
          },
          requestMyBillAjax() {
            var self = this;
            //我的清单里面，需要展示应用分类的tag
            if (self.classifications.length == 0) {
              self.requestAppTypeAjax();
            }
            //我的清单
            self.requestMyBills();
            //已生成报价单
            self.requestGenerateBills();
          },
          deepCopy(source) { 
            var result={};
            var self = this;
            for (var key in source) {
                result[key] = typeof source[key]==='object'? self.deepCopy(source[key]): source[key];
            } 
            return result; 
          },
          goSubClassification(item) {
            if (!item.parentIndex) {
              this.$router.push({
                name: 'subClassification',
                query: {
                    item: JSON.stringify(item)
                }
              });
            }else {
              this.$router.push({
                name: 'subClassification',
                query: {
                    item: JSON.stringify(item)
                }
              });
            }
          },
          updateBillItems() {
            this.requestMyBills();
            this.requestGenerateBills();
            this.billSelected = 'AlreadyGenerated';
          },
          requestGenerateBills (flag) {
            var self = this;
            var pageNumTmp = sessionStorage.getItem('AlreadyGeneratedPageNum');
            var option = {
                method:"POST",
                url:api.quotationsList,
                params:{
                    pageNum:1,
                    pageSize:15
                }
            };
            if (pageNumTmp) {
              pageNumTmp = Number(pageNumTmp) +1;
              option.params.pageNum = pageNumTmp;
            }
            axios(option).then(function(response){
              if (response.data.code == 0) {
                if (response.data.datas.list.rows && response.data.datas.list.rows.length>0) {
                  if (flag && flag=='more') {
                    //加载后面页的数据，需要在原来的基础上追加数据 
                  }else {
                    //其他情况下需要对数据清0
                    self.billGenerated=[];
                  }
                  response.data.datas.list.rows.map(function(item){
                    var itemObj = item;
                    itemObj.PRICE = item.PRICE.toFixed(2);
                    self.billGenerated.push(itemObj);
                  });
                  if (response.data.datas.list.rows.length < response.data.datas.list.pageSize) {
                    self.allLoadedGeneratedIndex = true; 
                  }else if (response.data.datas.list.rows.length == response.data.datas.list.pageSize && response.data.datas.list.rows.length < response.data.datas.list.totalSize){
                    sessionStorage.setItem('AlreadyGeneratedPageNum',response.data.datas.list.pageNumber);
                  }else {
                    self.allLoadedGeneratedIndex = true; 
                  }
                }
              }else {
                Toast('获取报价单失败');
              }
            }).catch(function(err){
              Toast(err);
            });
          },
          requestMyBills(dm,flag) {
            var self = this;
            var pageNumTmp = sessionStorage.getItem('toBeGeneratedPageNum');
            var option = {
                method:"POST",
                url:api.billsList,
                params:{
                    pageNum:1,
                    pageSize:15
                }
            };
            if (pageNumTmp) {
              pageNumTmp = Number(pageNumTmp) +1;
              option.params.pageNum = pageNumTmp;
            }
            if (dm) {
              self.billSearchTag = true;
              option.params.APPTYPE = dm;
            }
            //我的清单
            axios(option).then(function(response){
              if (response.data.code == 0 ) {
                var responseData = response.data.datas.list.rows;
                if (responseData && responseData.length>0) {
                  if (flag && flag=='more') {
                    //加载后面页的数据，需要在原来的基础上追加数据 
                  }else {
                    //其他情况下需要对数据清0
                    self.billList=[];
                  }
                  responseData.map(function(item){
                    var itemObj = item;
                      itemObj.TYPE = 'app';
                      //itemObj.PIC = item.IMAGE;
                      itemObj.IMAGE = self.setImgUrlFromId(item.IMAGE);
                      self.billList.push(itemObj);
                  });
                  if (responseData.length < response.data.datas.list.pageSize) {
                    self.allLoadedIndex = true; 
                  }else if (responseData.length == response.data.datas.list.pageSize && responseData.length < response.data.datas.list.totalSize){
                    sessionStorage.setItem('toBeGeneratedPageNum',response.data.datas.list.pageNumber);
                  }else {
                    self.allLoadedIndex = true;
                  }
                }else {
                  self.billList = [];
                }
              }else {
                Toast('获取我的清单失败');
              }
            }).catch(function(err){
              Toast(err);
            });
          },
          deleteAllSelectedItems(){
            var self = this;
            sessionStorage.setItem('toBeGeneratedPageNum','');
            if (self.subTagAll==false && typeof(self.tagIndex) === 'number') {
              self.requestMyBills(self.classifications[self.tagIndex].LBDM);
            } else if (self.subTagAll==true) {
              self.requestMyBills('');
            }
          },
          toBeGeneratedIndexLoadMore(){
            var self = this;
            //如果请求结果是十五条，表示可能存在第二页
            if (self.billList.length == 15) {
              if (self.subTagAll==false && typeof(self.tagIndex) === 'number') {
                self.requestMyBills(self.classifications[self.tagIndex].LBDM,'more');
              } else if (self.subTagAll==true) {
                self.requestMyBills('','more');
              }
            } 
          },
          AlreadyGeneratedIndexLoadMore(){
            var self = this;
            //如果请求结果是十五条，表示可能存在第二页
            if (self.billGenerated.length == 15) {
              self.requestGenerateBills('more'); 
            } 
          },
          setImgUrlFromId(id) {
            return WEBPACK_CONIFG_HOST +'sys/appstoreservice/attrs/preview.do?token=' + id+'&type=3';
          },
          goSelectedTab(tab) {
            this.selected = tab;
          },
          setTagSelected(wid,num) {
              var that = this;
              that.allLoadedIndex = false;
              sessionStorage.setItem('toBeGeneratedPageNum','');
              if (wid) {
                  that.subTagAll=false;
                  that.tagIndex = num;    
                  that.requestMyBills(that.classifications[num].LBDM);
              }else {
                  that.subTagAll=true;
                  that.tagIndex = '';
                  that.requestMyBills();
              }
          }

        },
        components: {
            [Swipe.name]: Swipe,
            [Search.name]: Search,
            [SwipeItem.name]: SwipeItem,
            [Header.name]: Header,
            [Navbar.name]: Navbar,
            [TabItem.name]: TabItem,
            [Tabbar.name]: Tabbar,
            [Cell.name]: Cell,
            [Button.name]: Button,
            [TabContainer.name]: TabContainer,
            [TabContainerItem.name]: TabContainerItem,
            [Toast.name]: Toast,
            comTest,
            listItem,
            billItem,
            billGenerated
        }
    }
</script>
<style>
header.mint-header {
  background-color: #fff;
  color:#333;
}
.index{
    background:#ffffff;
}
.right_icon{
    float: right;
    height: 50px;
    padding-right: 8px;
}
.as-content {
  /*去掉按钮的样式更改*/
  /*padding-bottom: 51px;*/
}
.as-search {
  position: absolute;
  width: 100%;
}
.as-pv-11 {
  padding:11px 0;
}
.as-tab {
  border-top: solid 1px #eee;
  background-color: #fff;
}
.as-tabColor-yellow {
  border-left: solid 4px #FCB711;
}
.as-tabColor-primary {
  border-left: solid 4px #2196F3;
}
.as-tabColor-purple {
  border-left: solid 4px #9B11FC;
}
.as-tab-content .as-tab-title {
  /*line-height: 16px;*/
  font-size: 18px;
  font-weight: 600;
}
.as-tab-title-english {
  font-size:12px;
}
.as-index-search-instead {
  width: 100%;
  height: 45px;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.as-index-searchBg {
  position: relative;
}
.as-index-searchImg {
  height:44px;
  width:100%;
  position:absolute;
  z-index: 1;
}
.as-search .mint-searchbar {
    background: none;
}
.as-search .mint-searchbar .mint-searchbar-inner {
    border-radius:16px;
}
.as-search .mint-searchbar .mint-searchbar-inner .mintui-search{
    position: relative;
    left: 2px;
    top: 1px;
}
.as-search .mint-searchbar .mint-searchbar-inner .mint-searchbar-core{
    position: relative;
    left: 4px;
}
input::-webkit-input-placeholder {
　　color:#999 !important;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
color: #999; 
} 
::-moz-placeholder { /* Mozilla Firefox 19+ */ 
color: #999; 
} 
:-ms-input-placeholder { /* Internet Explorer 10+ */ 
color: #999; 
}
.appType-header {
  background-color: #f6f6f6;
}
.appType-body {
  background-color: #fff;
}
.appType-item {
  background-color: #fff;
  border-bottom: solid 1px #eee;
}
.appType-item:last-child {
      margin-left: 0px !important;
    padding-left: 14px !important;
}
.appType-item-img {
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
}
.appType-item-title {
  display: inline-block;

}
.appType-item-cout {
  display: inline-block;
  float: right;
  font-size: 12px;
  line-height: 22px;
      margin-right: 6px;
}
.appType-item-arrow {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-top: solid 2px #eee;
    border-right: solid 2px #eee;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    position: relative;
    top: 1px;
}
.myBill .mint-navbar .mint-tab-item {
    padding: 13px 0;
}
.myBill .mint-navbar .mint-tab-item.is-selected {
    border-bottom-color:#2196F3 ;
    color: #2196F3;
}
.mybill-empty-content {
  position: absolute;
  top: 50%;
    left: 50%;
    margin-top: -85px;
    margin-left: -90px;
}
.mybill-empty-tips {
  position:relative;
}
.mybill-empty-tips img {
  width: 47px;height: 54px;
}
.mybill-mt-button {
  margin: 0 auto;width: 50%;
}
.mint-swipe .mint-swipe-item img {
  width: 100% !important;
}
.as-index-tabbar.mint-tabbar>.mint-tab-item {
  background-color: #fff !important;
}
.as-index-tabbar.mint-tabbar {
      border-top: solid 1px #ddd;
      background:none; 
}
.as-color-666 {
  color:#666;
}
.tab-icon {
  width: 24px;
  height: 24px;
  position: relative;
  top: -4px;
  margin:0 auto;
}
.tab-icon-bestRecomend {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')*/
    background: url(../../../static/assets/bestRecomend-D.png) top center no-repeat;
    background-size: 100% 100%;
}
.tab-icon-bestRecomend-selected {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')*/
    background: url(../../../static/assets/bestRecomend-P.png) top center no-repeat;
    background-size: 100% 100%;
}
.tab-icon-appType {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')
    * 相对vue文件引用图片
    */
    background: url(../../../static/assets/appType-D.png) top center no-repeat;
    background-size: 100% 100%;
}
.tab-icon-appType-selected {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')*/
    background: url(../../../static/assets/appType-P.png) top center no-repeat;
    background-size: 100% 100%;
}.tab-icon-myBill {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')*/
    background: url(../../../static/assets/myBill-D.png) top center no-repeat;
    background-size: 100% 100%;
}
.tab-icon-myBill-selected {
    /*vue背景图不可以写成这样的路径url('./static/assets/bestRecomend-D.png')*/
    background: url(../../../static/assets/myBill-P.png) top center no-repeat;
    background-size: 100% 100%;
}
.mint-swipe .mint-swipe-indicator.is-active {
  background-color: #FCB711 !important;
  opacity: 1;
}
.sub-class-noresult{
  color:#999;
  font-size:14px;
  text-align:center;    
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -42px;
}
.as-bill-uncheck {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 4px;
  position: relative;
  top: 0;
  right: -16px;
  display: inline-block;
}
</style>