<template>
    <div class="bh-mt-16 bill-generated-content" :style="{height:billGeHeight}" class="scroll" style="overflow:auto;">
        <mt-loadmore :bottom-method="loadBottom2" :bottom-all-loaded="allLoaded2" ref="loadmore2">
            <ul class="as-lists">
                <li v-for="item in items" class="as-list bh-pl-16" @click="goBillDetailPage(item)">
                    <div class="bh-pr-16 as-pv-10 bh-clearfix as-list-content">
                      <div class="bh-pv-2 h5 bill-h5-gen">{{item.NAME1}}</div>
                        <div class="bill-generated-detail bh-color-gray-lv3 bill-2line-ellipsis bh-mv-4">包含应用：{{item.APP_NAMES}}</div>  
                    </div>
                </li>
            </ul>
            <div class="as-nullData bh-color-gray-lv2" v-show="allLoaded2 && items.length>5">暂无更多数据</div>
        </mt-loadmore>
    </div>
</template>
<style>
.as-pv-10 {
    padding:9px 0;
}
.bill-h5 {
    font-weight: 600;
}
.bill-generated-detail {
    font-size:12px; 
}
.bill-2line-ellipsis {
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.bill-h5-gen {
    font-weight: 600;
    font-size: 16px;
}
.bill-generated-content .as-lists{
    border-bottom: solid 1px #eee;
}
</style>
<script>
    import { Swipe, SwipeItem ,Checklist,Cell} from 'bh-mint-ui2';
    import wechatShare from '../../static/mobile/js/wechatShare.js';
    export default {
        data () {
            return {
                billGeHeight:''
            }
        },
        props:{
            items:Array,
            allLoaded2:Boolean
        },
        components:{
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Checklist.name]: Checklist,
            [Cell.name]: Cell
        },
        watch: {
            allLoaded2:function(value,oldvalue){
                if (value) {
                    this.$refs.loadmore2.onBottomLoaded();
                }
            }
        },
        created() {
            // setTimeout(function(){
            //     console.log('preventBodyScroll -billg')
            //     wechatShare.preventBodyScroll();
            // },1000);
            //设置bill中间内容部分的高度
            this.billGeHeight = (document.body.clientHeight - 51 - 40) + 'px';//51是底部导航栏、tag的高度 40是顶部tab头的高度
            console.log(document.querySelectorAll('.scroll'))
            setTimeout(function(){
                console.log('preventBodyScroll-ge-bige')
                wechatShare.preventBodyScroll();
            },100);
        },
        methods: {
            goBillDetailPage(item) {
                delete item.CJSJ;
                delete item.DATASTATUS;
                delete item.APP_NAMES;
                delete item.YHID;
                delete item.PRICE;
                delete item.NAME1;
                this.$router.push({
                  name: 'billDetail',
                  query: item
                });
            },
            loadBottom2(){
                this.$emit('AlreadyGeneratedLoadMore');
            }
        }
    }
</script>