<template>
    <div :style="{height:subClassificationContainerHeight}" >
        <div v-if="(this.parentIndex =='index')">
          <mt-search
            v-model="value"
            cancel-text="取消"
            placeholder="搜索" autofocus="autofocusValue" class="as-search" @input="search" @canceled="goIndexPage">
          </mt-search>
          <div v-if="this.customerCases.length == 0 && this.subSearchTag == true" class="bh-text-center sub-empty-tips">
            <div>
              <img :src="'./static/assets/noresult.png'" />
            </div>
            <p class="bh-pv-16" style="font-size:15px;color:#666;">暂无内容,去精品推荐看看</p>
            <div class="bh-ph-16 bh-pv-8 as-noresult-button" style="width:130px;margin:0 auto;">
               <mt-button type="warning" size="large" class="" @click="goIndexPage">去看看</mt-button> 
            </div>
          </div>
          <div v-else class="sub-case-container">
            <mt-loadmore  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
              <list-item  :items="customerCases"></list-item>
              <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded && customerCases.length>5">暂无更多数据</div>
            </mt-loadmore>
          </div>  
        </div>
        <!-- 点击分类，全部类型，展示的页面 -->
        <div v-if="(this.parentIndex =='totalApp')">
          <mt-search
            v-model="value"
            cancel-text="取消"
            placeholder="搜索" class="as-search" @input="search" @canceled="goIndexPage">
          </mt-search>
          <div  class="sub-case-container">
            <mt-loadmore  v-if="customerCases.length>0"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">
              <list-item :items="customerCases"></list-item>
              <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded && customerCases.length>5">暂无更多数据</div>
            </mt-loadmore>
            <div v-else class="sub-total-search-noresult">无搜索结果</div>
          </div>  
        </div>
        <!-- 点击分类，学工类型，展示的页面 -->
        <div class="sub-main-content" v-if="(this.parentIndex =='classification')">
          <div class="sub-tag-container" v-if="(this.tags.length > 0)">
             <div class="sub-title bh-pv-16" :style="{width:subTagCont}">
                  <label  class="sub-tag" :class="{'sub-tag-selected':subTagAll}" @click="setTagSelected()">全部</label>
                  <label class="sub-tag" :class="{'sub-tag-selected': !subTagAll && index === tagIndex}" v-for="(item,index) in tags" @click="setTagSelected(item.WID,index)">{{item.LBMC}}</label>
              </div> 
          </div>
          <mt-loadmore  v-if="customerCases.length>0" :bottom-method="loadBottom" :autoFill="false" :bottom-all-loaded="allLoaded" ref="loadmore" >
            <list-item  :items="customerCases"></list-item>
            <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded && customerCases.length>5">暂无更多数据</div>
          </mt-loadmore>
          <div v-else class="sub-total-search-noresult">无该类型应用</div>
        </div>  
    </div>
</template>
<style>
.mint-searchbar .mint-searchbar-cancel {
    color: #f4b711;
}
.sub-title {
    font-size: 12px;
    background-color: #fff;
    padding-left:8px;
}
.sub-title-num {
    float: right;
}
.sub-tag-container {
    width: 100%;
    overflow: auto;
}
.sub-tag {
  padding:4px;
  width: 78px;
  margin: 0 4px;
  text-align: center;
  display: inline-block;
  border-radius: 12px;
  border:solid 1px #ddd;
  background-color: #fff;
}
.sub-tag.sub-tag-selected {
    color: #ffffff;
    background-color: #fec006;
    border:none;
}
.as-noresult-button .mint-button {
  font-size: 16px;
}
.sub-empty-tips {
  position:relative;
  top:100px;
}
.sub-empty-tips img {
  width: 47px;
  height: 54px;
}
.sub-mt-button {
  margin: 0 auto;width: 50%;
}
.sub-case-container {
  padding-top: 43px;
}
.sub-total-search-noresult {
  color:#999;
  font-size:14px;
  text-align:center;    
  position: absolute;
  left: 50%;
  top: 20%;
  margin-left: -42px;
}
input[type="search" i]:enabled:read-write:-webkit-any(:focus,:hover)::-webkit-search-cancel-button {
    display: none !important;
    opacity: 0;
}
input[type="search" i]::-webkit-search-cancel-button {
    display: none !important;
    opacity: 0;
}
input[type="search" i]::-webkit-search-cancel-button {
    display: none !important;
    opacity: 0;
}
input[type="search" i]:enabled:read-write:-webkit-any(:focus,:hover)::-webkit-search-cancel-button {
  opacity: 0 !important;
}
</style>
<script>
    import { Button ,MessageBox,Toast,Loadmore} from 'bh-mint-ui2';
    import listItem from '../../components/listItem.vue';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    //import Scroll from '../../components/scroll.vue';
    import api from '../../api.js';
    import axios  from 'axios';
    import _ from 'lodash'; //引入lodash
    //请求canceltoken列表
    let sources = [];
    export default {
        data () {
            return {
                value:'',
                tagIndex:'',
                subTagCont:'100%',
                subTagAll:true,
                parentIndex:'classification',
                tags:[],
                customerCases:[],
                subSearchTag:'',
                subClassificationContainerHeight:'',
                autofocusValue:true,
                allLoaded:false
            }
        },
        computed: {
          
        },
        props:{
          
        },
        created() {
            var that = this;
            BH_MIXIN_SDK.setTitleText('应用列表');
            // setTimeout(function(){
            //     console.log('preventBodyScroll -subc')
            //     wechatShare.preventBodyScroll();
            // },1000);
            sessionStorage.setItem('subClassificationPageNum','');
            //设置billdetail框部分的高度
            this.subClassificationContainerHeight = (document.body.clientHeight) + 'px';
            //如果有页面类型，则设置
            if (JSON.parse(that.$route.query.item).parentIndex) {
                that.parentIndex = JSON.parse(that.$route.query.item).parentIndex;
            }
            if (that.parentIndex == 'index') {
              window.scrollTo(0,0);
              document.body.scrollTop = 0;
            }
            if (that.parentIndex == 'classification') {
              //应用类型标签
              axios({
                  method:"POST",
                  url:api.appBq,
                  params:{
                    pageNum:1,
                    pageSize:15
                  }
              }).then(function(response){
                if (response.data.code == 0) {
                  if (response.data.datas.getYyfl.rows && response.data.datas.getYyfl.rows.length>0) {
                    that.tags = response.data.datas.getYyfl.rows;
                    if (that.tags.length>3) {
                      that.subTagCont = 96 * (that.tags.length + 1); 
                    }
                  }
                }else {
                  Toast('获取标签失败');
                }
              }).catch(function(err){
                Toast(err);
              });
              //debugger
              console.log('not totalapp')
              that.ajaxAppsByConditions();
            }else if (that.parentIndex == 'totalApp') {
              console.log('totalapp')
              that.ajaxAppsByConditions('totalApp');
            }
        },
        methods:{
          setTagSelected(wid,num) {
              var that = this;
              if (wid) {
                  that.subTagAll=false;
                  that.tagIndex = num;
                  sessionStorage.setItem('subClassificationPageNum','');
                  console.log('that.subTagAll=false')
                  that.ajaxAppsByConditions(that.tags[num].LBDM);
              }else {
                  that.subTagAll=true;
                  that.tagIndex = '';
                  sessionStorage.setItem('subClassificationPageNum','');
                  console.log('that.subTagAll=true;')
                  that.ajaxAppsByConditions();
              }
          },
          ajaxAppsByConditions(requestFrom,flag) {
            var that = this;
            var pageNumTmp = sessionStorage.getItem('subClassificationPageNum');
            console.log('pageNumTmp:'+pageNumTmp);
            if (pageNumTmp) {
              pageNumTmp = Number(pageNumTmp) +1;
            }
            var option = {};
            if (requestFrom && that.parentIndex!='totalApp' && that.parentIndex!='classification') {
              console.log("requestFrom && that.parentIndex!='totalApp' && that.parentIndex!='classification'");
              option = {
                APPTYPE:JSON.parse(that.$route.query.item).LBDM?JSON.parse(that.$route.query.item).LBDM:'',
                BQ:requestFrom,
                pageNum:pageNumTmp?pageNumTmp:1,
                pageSize:15
              };
            }else if (requestFrom && that.parentIndex == 'totalApp') {
              console.log("requestFrom && that.parentIndex == 'totalApp'");
              option = {
                  APPTYPE:'',
                  BQ:'',
                  Condition:'',
                  pageNum:pageNumTmp?pageNumTmp:1,
                  pageSize:15
              };
            }else if (that.parentIndex == 'classification') {
              console.log("that.parentIndex == 'classification'");
              option = {
                  APPTYPE:JSON.parse(that.$route.query.item).LBDM?JSON.parse(that.$route.query.item).LBDM:'',
                  BQ:requestFrom?requestFrom:'',
                  Condition:'',
                  pageNum:pageNumTmp?pageNumTmp:1,
                  pageSize:15
              };
            }else {
              console.log("last");
              option = {
                  APPTYPE:JSON.parse(that.$route.query.item).LBDM?JSON.parse(that.$route.query.item).LBDM:'',
                  BQ:'',
                  Condition:JSON.parse(that.$route.query.item).Condition ? JSON.parse(that.$route.query.item).Condition : this.value,
                  pageNum:pageNumTmp?pageNumTmp:1,
                  pageSize:15
              };
              that.subSearchTag = true;
              if (!option.Condition && !option.APPTYPE && that.parentIndex != 'totalApp') {
                return;//如果没有条件，则不再触发搜索
              }
            }
            //应用类型明细
            axios({
                method:"POST",
                url:api.appsList,
                params:option
            }).then(function(response){
              var responseData = response.data.datas.list.rows;
              if (response.data.code == 0) {
                if (responseData && responseData.length>0) {
                  if (flag && flag=='more') {
                    //在原来基础上，追加数据
                  }else {
                    //每次请求清空数据
                    that.customerCases=[];
                  }
                  responseData.map(function(item){
                      var itemObj = item;
                      itemObj.TYPE = 'app';
                      itemObj.TYPEFROM = 'applist';
                      itemObj.IMAGE = that.setImgUrlFromId(item.IMAGE);
                      that.customerCases.push(itemObj);
                  });
                  setTimeout(function(){
                    window.scrollTo(0,0);
                    document.body.scrollTop = 0;
                  },20);
                  if (responseData.length < response.data.datas.list.pageSize) {
                    that.allLoaded = true;
                    if (that.$refs.loadmore) {
                      that.$refs.loadmore.onBottomLoaded();
                    } 
                  }else if ((responseData.length == response.data.datas.list.pageSize) && (response.data.datas.list.pageSize * response.data.datas.list.pageNumber < response.data.datas.list.totalSize)) {
                    console.log('set----------subClassificationPageNum:'+response.data.datas.list.pageNumber);
                    sessionStorage.setItem('subClassificationPageNum',response.data.datas.list.pageNumber);
                  }
                }else {
                  that.customerCases=[];
                }
              }else {
                Toast('获取应用类型明细失败');
              }
            }).catch(function(err){
              Toast(err);
            });
          },
          setImgUrlFromId(id) {
            return WEBPACK_CONIFG_HOST +'sys/appstoreservice/attrs/preview.do?token=' + id+'&type=3';
          },
          goIndexPage() {
            sessionStorage.setItem("selectedTab",'bestRecomend');
            this.$router.push({
              name: 'index'
            });
          },
          loadBottom(){
            var that = this;
            if (that.subTagAll ==false && typeof(that.tagIndex) === 'number') {
              console.log('loadBottom1')
              that.ajaxAppsByConditions(that.tags[that.tagIndex].LBDM,'more');
            }else {
              console.log('loadBottom2')
              that.ajaxAppsByConditions('','more');
            }
          },
          search: _.debounce(function () {
                //debugger
                //删除已经结束的请求
                _.remove(sources, function (n) {
                  return n.source === null;
                });
                //取消还未结束的请求
                sources.forEach(function (item) {
                  if (item !== null && item.source !== null && item.status === 1) {
                    item.status = 0;
                    item.source.cancel('取消上一个')
                  }
                });

                //创建新的请求cancelToken,并设置状态请求中
                var sc = {
                  source: axios.CancelToken.source(),
                  status: 1 //状态1：请求中，0:取消中
                };
                //这个对象加入数组中
                sources.push(sc);
                console.log('search')
                sessionStorage.setItem('subClassificationPageNum','');
                this.ajaxAppsByConditions();
              },
              500 //空闲时间间隔设置500ms
            )
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