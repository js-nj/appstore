<template>
    <div>
        <!-- <div>这里是组件</div> -->
        <div class="comWithBorder">
            <mt-swipe :auto="4000">
                <mt-swipe-item v-for="item in imgs" >
                    <div class="center" @click="goSwipeItem(item)">
                        <img :src="item.YDTP" onerror='this.src="./static/assets/logo.png"' />
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>
<style>
.comWithBorder{
    height: 200px;
    background-color: #eee;
}
.center{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
<script>
    import axios  from 'axios';
    import { Swipe, SwipeItem } from 'bh-mint-ui2';
    export default {
        data () {
            return {
               
            }
        },
        props:{
            imgs:Array
        },
        created() {},
        methods:{
            goSwipeItem(item) {
                switch(item.TZLX) {
                    case '1':
                        if (item.URL.indexOf('http')>-1) {
                            window.location.href = item.URL;
                        }else {
                            window.location.href = 'http://'+item.URL;
                        }
                        
                        break;
                    case '2':
                        item.PAGETYPE = 'app';
                        this.goPagesByType(item);
                        break;
                    case '3':
                        item.PAGETYPE = 'custom';
                        this.goPagesByType(item);
                        break;
                } 
            },
            goPagesByType(param) {
                if (param.PAGETYPE == 'app') {
                    this.$router.push({
                      name: 'app',
                      query: param
                      // query: {
                      //   item: JSON.stringify(param)
                      //  }
                    });
                }else if (param.PAGETYPE == 'custom') {
                    this.$router.push({
                      name: 'custom',
                      query: param
                      // query: {
                      //     item: JSON.stringify(param)
                      //   }
                    });
                }
            }
        },
        components:{
            Swipe, SwipeItem
        }
    }
</script>