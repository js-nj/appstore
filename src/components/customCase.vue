<template>
    <div class="custom-case-contaier" >
        <h3 v-if="this.details.TYPE == 'indexView'" class="bh-ph-16 bh-pv-16 custom-name">{{details.SCHOOL_BM_DISPLAY}}</h3>
        <h4 v-else class="bh-ph-16 bh-pv-16 custom-name">{{details.SCHOOL_BM_DISPLAY}}</h4>
        <div v-if="this.details.TYPE == 'indexView'">
            <div class="bh-pv-8 bh-ph-16">
                <span class="custom-use-circle bh-bColor-primary-lv1"></span>
                <div class="bh-ph-4 custom-use-content">使用应用</div>
            </div>
            <div class="ct-list bh-clearfix bh-ph-16 bh-pv-8 bh-mv-8" @click="goAppPage()">
                <div class="as-list-des">
                    <p class="bh-pv-8 as-list-title">
                        <label>{{targetApp.NAME1}}</label>
                        <label class="as-tag bh-l-inline bh-mh-16 bh-ph-4 bh-color-primary-lv1 bh-bgColor-primary-lv3" v-if="this.targetApp.VIDEO_URL">视频</label>
                    </p>
                    <div class="bh-pv-4 bh-mt-4 as-list-service as-color-666">
                        <label>正在服务学校</label>
                        <label class="bh-l-inline bh-ph-16 bh-color-primary-lv1" style="font-weight: 800;">{{targetApp.SCHOOL_COUNT}}</label>
                    </div>
                </div>
                <div class="as-list-img"><img :src="this.targetApp.IMAGE" onerror='this.src="./static/assets/logo.png"' /></div>
            </div>
        </div>
        <div class="bh-ph-16 custom-content-body">
            <div class="">
                <div class="bh-pb-8">
                    <span class="custom-use-circle bh-bColor-primary-lv1"></span>
                    <div class="bh-ph-4 custom-use-content">案例介绍</div>
                </div>
                <div class="bh-color-gray-lv2 custom-use-detail" v-html="details.INFORMATION">
                    
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.ct-list {
    border-top: solid 1px #f6f6f6;
    border-bottom: solid 1px #f6f6f6; 
}
.custom-name {
    font-weight: 600;
    font-size: 18px;
}
.custom-use-circle {
    position: relative;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    border:solid 1px; 
    display: inline-block;
}
.custom-use-content {
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
}
.custom-content-body {
    padding-bottom:55px;
}
.custom-case-contaier {
    /*border-top: solid 1px #eee;*/
    background-color: #fff;
}
.custom-use-detail img {
    max-width: 100% !important;
}
.custom-use-detail {
    font-size: 16px;
    word-break: break-word;
    line-height: 26px;
}
</style>
<script>
    import { Swipe, SwipeItem ,Toast} from 'bh-mint-ui2';
    import wechatShare from '../../static/mobile/js/wechatShare.js';
    import api from '../api.js';
    import axios  from 'axios';
    export default {
        data () {
            return {

            }
        },
        props:{
            details:Object,
            targetApp:Object,
            subTag:Boolean
        },
        components:{
            [Toast.name]: Toast,
            Swipe, SwipeItem
        },
        created() { 
            //设置bill中间内容部分的高度
            this.customTabContentHeight = document.body.clientHeight +'px';
            // setTimeout(function(){
            //     console.log('preventBodyScroll -subc')
            //     wechatShare.preventBodyScroll();
            // },1000);
        },
        // beforeUpdate() {
        //     console.log('this.details');
        //     console.log(this.details);
        //     console.log('this.details end');
        //     if(this.details.INFORMATION){
        //         console.log('old:'+this.details.INFORMATION);
        //         var regString = /getFileByToken\/(\w+)\.do/g;
        //         this.details.INFORMATION = this.details.INFORMATION.replace(regString,'getSingleImageByToken.do?fileToken=$1&type=ORIGINAL');
        //         //console.log('old:'+this.details.INFORMATION);
        //         this.details.INFORMATION = this.details.INFORMATION.replace(/\\/g,'');
        //         console.log('new:'+this.details.INFORMATION);
        //     }
        // },
        // filters: {
        //     capitalize: function (value) {
        //       console.log('this.details');
        //       console.log(this.details);
        //       console.log('this.details end');
        //       if(this.details.INFORMATION){
        //           console.log('old:'+this.details.INFORMATION);
        //           var regString = /getFileByToken\/(\w+)\.do/g;
        //           this.details.INFORMATION = this.details.INFORMATION.replace(regString,'getSingleImageByToken.do?fileToken=$1&type=ORIGINAL');
        //           //console.log('old:'+this.details.INFORMATION);
        //           this.details.INFORMATION = this.details.INFORMATION.replace(/\\/g,'');
        //           console.log('new:'+this.details.INFORMATION);
        //       }
        //     }
        // },
        methods:{
            goAppPage() {
                this.$router.push({
                      name: 'app',
                      query: {
                        WID:this.targetApp.WID
                      }
                });
            } 
        }
    }
</script>