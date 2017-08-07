<template>
    <ul class="as-lists" v-if="items.length>0">
        <li v-for="item in items" class="as-list bh-pl-16" @click="goPagesByType(item)">
            <div class="as-pv-10 bh-pr-16 bh-clearfix as-list-content">
                <div class="as-list-des">
                    <p class="bh-pv-8 as-list-title">
                        <label v-if="item.TYPE == 'app'">{{item.NAME1}}</label>
                        <label v-else>{{item.SCHOOL_BM_DISPLAY}}</label>
                        <label class="as-tag bh-l-inline bh-mh-8 bh-ph-4 bh-color-primary-lv1 as-bgcolor-tag" v-if="item.VIDEO_URL" style="font-size:10px;">视频</label>
                    </p>
                    <div class="bh-pv-4 bh-mt-4 as-list-service as-color-666">
                        <label v-if="item.TYPE == 'app'">正在服务学校</label>
                        <label v-else>已拥有应用数</label>
                        <label v-if="item.TYPE == 'app'" class="bh-l-inline bh-ph-4 bh-color-primary-lv1" style="font-weight:800;">{{item.SCHOOL_COUNT}}</label>
                        <label v-else class="bh-l-inline bh-ph-4 bh-color-primary-lv1" style="font-weight:800;">{{item.APP_COUNT}}</label>
                    </div>
                </div>
                <div v-if="item.TYPE == 'app'" class="as-list-img"><img :src="item.IMAGE" onerror='this.src="./static/assets/logo.png"'/></div>
                <div v-else class="as-list-img as-college"><img :src="item.BADGE" onerror='this.src="./static/assets/logo.png"' /></div>
            </div>  
        </li>
    </ul>
    <ul v-else></ul>
</template>
<style>
.as-lists {
    border-top: solid 1px #eee;
}
.as-content > div:last-child .as-lists:last-child {
    border-top:none;
}
#as-index-items > div:last-child .as-lists:last-child {
    /*为了首页最后一个tab*/
    border-top: solid 1px #eee;
    border-bottom:solid 1px #eee;
}
.as-list {
    font-size: 16px;
}
.as-list-content {
    border-bottom:solid 1px #eee;
}
.as-lists .as-list:last-child .as-list-content{
    border-bottom:none;
}
.as-list:active {
    background-color: #eee;
}
.as-list-des {
    float: left;
    width: 75%;
}
.as-list-title {
    font-weight: 600;
}
.as-list-service {
    font-size: 12px;
}
.as-list-img {
    float: left;
    width: 25%;
    overflow: hidden;
}
.as-list-img img {
    float:right;
    width: 85px;
    height: 62px;
}
.as-list-img.as-college img{
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
    padding:9px 0;
}
.as-bgcolor-tag {
    background-color: #e9f2fd;
}
</style>
<script>
    import { Swipe, SwipeItem } from 'bh-mint-ui2';
    
    export default {
        data () {
            return {
       
            }
        },
        props:{
            items:Array
        },
        components:{
            Swipe, SwipeItem
        },
        methods: {
            goPagesByType(item) {
                console.log(item);
                delete item.NAME1;
                delete item.APPTYPE
                delete item.APPTYPE_DISPLAY;
                delete item.IMAGE;
                delete item.BADGE;
                delete item.SCHOOL_BM_DISPLAY;
                delete item.SCHOOL_COUNT;
                delete item.VIDEO_URL;
                delete item.APP_COUNT;
                delete item.CJSJ;
                delete item.JSSJ;
                delete item.STATE;
                delete item.CJR;
                delete item.XGR;
                delete item.XGSJ;
                delete item.XSXX;
                delete item.STATE_DISPLAY;
                delete item.KSSJ;
                delete item.APP_ID_DISPLAY;
                delete item.SCHOOL_BM;
                console.log(item);
                if (item.TYPE == 'app') {
                    delete item.TYPE;
                    this.$router.push({
                      name: 'app',
                      query: item
                      // query: {
                      //   item: JSON.stringify(item)
                      // }
                    });
                }else if (item.TYPE == 'custom') {
                    if (item.PARENTTYPE && item.PARENTTYPE =='school') {
                        console.log('from school.vue')
                    }else {
                        delete item.TYPE;
                        this.$router.push({
                          name: 'custom',
                          query:item
                            // query: {
                            //     item: JSON.stringify(item)
                            // }
                        });  
                    }    
                }
            }
        }
    }
</script>