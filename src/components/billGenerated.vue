<template>
    <div class="bh-mt-16 bill-generated-content">
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

    export default {
        data () {
            return {
                
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
                  // query: {
                  //     param: JSON.stringify(item)
                  // }
                });
            },
            loadBottom2(){
                this.$emit('AlreadyGeneratedLoadMore');
            }
        }
    }
</script>