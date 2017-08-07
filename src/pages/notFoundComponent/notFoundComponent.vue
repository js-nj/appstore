<template>
    <div>
        页面跑丢了
    </div>
</template>
<style>

</style>
<script>
    import { Button ,MessageBox,Field,Toast} from 'bh-mint-ui2';
    import api from '../../api.js';
    import axios  from 'axios';
    import wechatShare from '../../../static/mobile/js/wechatShare.js';
    export default {
        data () {
            return {

            }
        },
        methods:{
            
        },
        created() {
            
            
        },
        components:{
            [Button.name]: Button,
            [MessageBox.name]: MessageBox,
            [Field.name]: Field,
            [Toast.name]: Toast
        }
    }
</script>