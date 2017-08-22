<template>
    <div class="bill-list-container" style="overflow: auto;padding-bottom: 50px;" :style="{height:billItemHeight}" class="scroll">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore1" >
            <ul>
                <li v-for="item in items" class="as-list bh-ph-16 as-pv-10 bh-clearfix" >
                    <div class="bill-list-radio bh-pl-8">
                        <div class="bh-pv-24">
                            <label class="bh-checkbox-label bh-pv-32">
                                <input class="mint-checkbox-input" type="checkbox" name="bill" v-model="selectedItems" :value="item.APP_ID" >
                                <i class="mint-checkbox-core"></i>
                            </label>
                        </div>
                    </div>
                    <div @click="goAppDetailPage(item)" style="float:left;overflow:auto;width: 88%;">
                        <div class="bill-list-des">
                            <p class="bh-pv-8 as-list-title">
                                <label>{{item.NAME1}}</label>
                            </p>
                            <div class="bh-pv-4 bh-mt-4 as-list-service bh-color-gray-lv1">
                                <label >正在服务学校</label>
                                <label class="bh-l-inline bh-ph-16 bh-color-primary-lv1" style="font-weight:800;">{{item.SCHOOL_COUNT}}</label>
                            </div>
                        </div>
                        <div class="bill-list-img"><img :src="item.IMAGE" :class="{'as-college':item.TYPE == 'custom'}" onerror='this.src="./static/assets/logo.png"'/></div>
                    </div> 
                </li>
                <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded && items.length>5">暂无更多数据</div>
            </ul>   
        </mt-loadmore>
        
        <!-- 操作按钮 -->
        <div class="bill-buttonContainer bh-clearfix bh-text-center">
            <div class=" bill-all-check">
                <label class="bh-checkbox-label" >
                  <input class="mint-checkbox-input" type="checkbox" name="all" value="all"  v-model="selectedAllItemTag" @change="selectAllItems">
                  <i class="mint-checkbox-core"></i>
                  <span class="bh-ph-8" style="display:inline-block;vertical-align: bottom;">全选</span>
                </label> 
            </div>
            <div type="warning" class="bill-button as-bgcolor-generator bh-color-white bh-pv-16" @click="generateBill">生成报价单 ({{selectedItems.length}})</div>
            <label class="bill-button-delete bh-ph-16" @click="deleteAllSelectedItems">删除</label>
        </div>
    </div>
</template>
<style>
.bill-list-container .as-nullData {
    line-height: 40px;
    height: 40px;
}
.as-list {
    background-color: #fff;
}
.bill-list-container .as-list {
    font-size: 16px;
    border-top: solid 1px #ddd;
}
.bill-list-container .as-list:last-child {
    border-bottom:solid 1px #ddd;
}

.bill-list-container {
    /*padding-bottom: 44px;*/
    overflow:auto;
}
.bill-list-radio {
    float: left;
    width: 12%;
}
.bill-list-des {
    float: left;
    width: 71%;
}
.as-list-title {
    font-weight: 600;
}
.as-list-service {
    font-size: 12px;
}
.bill-list-img {
    float: left;
    width: 29%;
    overflow: hidden;
}
.bill-list-img img {
    float:right;
    width: 85px;
    height: 62px;
}
.bill-list-img img.as-college {
    float:right;
    width: 62px;
    height: 62px;
}
.as-tag {
    position: relative;
    top: -2px;
    border:solid 1px #2196F3;
    border-radius: 2px;
    font-size: 12px;
}
.as-pv-10 {
    padding:15px 0;
}
.bill-buttonContainer {
    position: fixed;
    bottom: 50px;
    width: 100%;
    background-color: #fff;
    border-top: solid 1px #ddd;
}
.bill-button {
    width: 40%;
    float: right;
    font-size: 16px;
    position: relative;
}
.bill-all-check {
    float: left;
    position: relative;
    top: 10px;
    left: 16px;
}
.bill-all-check .bh-checkbox .bh-choice-helper:before {
    position: relative;
    top: 3px;
}
.bill-button-delete {
    float: right;
    position: relative;
    top: 12px;
    right: 12px;
}
.myBill .mint-tab-item .mint-tab-item-label{
    font-size: 14px;
    font-weight: 600;
}
.as-bgcolor-generator {
    background-color: #fcb711;
}
.app-button-text {
    font-size: 12px;
}
.app-content .mint-navbar .mint-tab-item {
    padding: 10px 0;
}
.app-content .mint-navbar .mint-tab-item.is-selected {
    border-bottom-color:#2196F3 ;
    color: #2196F3;
}
.app-button-line {
    width: 0px;
    height: 30px;
    position: absolute;
    border-left:solid 1px #ddd;
    float: left;
    right:50%;
    top: 6px;
}

.bill-list-radio .mint-checkbox-core:after, .bill-all-check .mint-checkbox-core:after{
    top:4px;
    left: 7px;
}
</style>
<script>
    import { Swipe, SwipeItem ,Checklist,Cell,Toast,Loadmore} from 'bh-mint-ui2';
    import api from '../api.js';
    import axios  from 'axios';
    import wechatShare from '../../static/mobile/js/wechatShare.js';
    export default {
        data () {
            return {
                selectedAllItemTag:false,
                selectedItems:[],
                selectedItemsWid:[],
                itemChecked:false,
                value:[]
            }
        },
        props:{
            items:Array,
            allLoaded:Boolean
        },
        components:{
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Checklist.name]: Checklist,
            [Cell.name]: Cell,
            [Toast.name]: Toast,
            [Loadmore.name]: Loadmore
            
        },
        watch: {
            selectedItems: function (val, oldVal) {
                var self = this;
                if (val.length === this.items.length) {
                    this.selectedAllItemTag = true;
                }else if(val.length < this.items.length){
                    this.selectedAllItemTag = false;
                }
                //每次变化先清空，移除上一次的数据
                this.selectedItemsWid = [];
                for (var i = 0; i < this.selectedItems.length; i++) {
                    var tmpObj = _.find(this.items, function(chr) {
                        return chr.APP_ID == self.selectedItems[i];
                    });
                    //console.log(tmpObj);
                    if (tmpObj) {
                        this.selectedItemsWid.push(tmpObj.WID);
                    }
                }
            },
            allLoaded:function(val, oldVal){
                if (val) {
                    this.$refs.loadmore1.onBottomLoaded();
                }
            }
        },
        created() {
            //设置bill中间内容部分的高度
            this.billItemHeight = (document.body.clientHeight - 51 - 40 - 51) + 'px';//51是底部导航栏、tag的高度 40是顶部tab头的高度 48是按钮排的高度
            setTimeout(function(){
                console.log('preventBodyScroll-billitem')
                wechatShare.preventBodyScroll();
            },100);
        },
        methods: {
            selectAllItems() {
                var that = this;
                if (that.selectedAllItemTag) {
                    //清除之前单选中的数据
                    that.selectedItems=[];
                    that.items.forEach(function(item){
                        that.selectedItems.push(item.APP_ID);
                    });
                }else {
                    that.selectedItems = [];
                    that.selectedItemsWid= [];
                }
            },
            deleteAllSelectedItems(){
                var self = this;
                //校验是否存在已有选中的对象
                if (self.selectedItemsWid.length > 0) {
                    //删除清单
                    axios({
                        method:"POST",
                        url:api.deleteBills,
                        params:{
                            WIDS:this.selectedItemsWid.join(','),
                            pageNum:1,
                            pageSize:15
                        }
                    }).then(function(response){
                      if (response.data.code == 0) {
                        Toast('删除报价单成功');
                        self.$emit('deleteAllSelectedItems',self.selectedItemsWid);
                        self.selectedAllItemTag = false;
                        self.selectedItems = [];
                        self.selectedItemsWid = [];
                      }else {
                        Toast('删除报价单失败');
                      }
                    }).catch(function(err){
                      Toast(err);
                    });
                }else {
                    Toast('请至少选择一项');
                }   
            },
            generateBill() {
                var self = this;
                //校验是否存在已有选中的对象
                if (self.selectedItemsWid.length > 0) {
                    //生成报价单
                    axios({
                        method:"POST",
                        url:api.addQuotation,
                        params:{
                            BILL_IDS:self.selectedItemsWid.join(','),
                            pageNum:1,
                            pageSize:15
                        }
                    }).then(function(response){
                      if (response.data.code == 0) {
                        var responseData = response.data.datas.addQuotation.rows;
                        Toast('生成报价单成功');
                        self.$emit('generatedBill');
                        self.selectedAllItemTag = false;
                        self.selectedItems = [];
                        self.selectedItemsWid = [];
                        if (responseData && responseData.length>0) {
                            responseData[0].PRICE = responseData[0].PRICE.toFixed(2);
                            self.goBillDetailPage(responseData[0]);

                            sessionStorage.setItem("billSelectedTab","AlreadyGenerated");
                        }  
                      }else {
                        Toast('生成报价单失败');
                      }
                    }).catch(function(err){
                      Toast(err);
                    });
                }else {
                    Toast('请至少选择一项');
                }
            },
            goBillDetailPage(item) {
                delete item.CJSJ;
                delete item.DATASTATUS;
                delete item.APP_NAMES;
                delete item.YHID;
                delete item.PRICE;
                delete item.NAME1;
                console.log(item);
                this.$router.push({
                  name: 'billDetail',
                  query:item
                });
            },
            goAppDetailPage(item) {
                this.$router.push({
                  name: 'app',
                  query: {
                    WID:item.WID,
                    APP_ID:item.APP_ID
                  }
                });
            },
            loadBottom(){
                this.$emit('toBeGeneratedLoadMore');
            }
        }
    }
</script>