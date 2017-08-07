<template>
    <transition :name="transitionName" duration="0">
        <router-view class="child-view"></router-view>
      </transition>
</template>
<style type="text/css">

.child-view {
  -webkit-transition: all 0.3s cubic-bezier(.55,0,.1,1);
  transition: all 0.3s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0 !important;
  -webkit-transform: translateX(100%) !important;
  /*-webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);*/
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0 !important;
  -webkit-transform: translateX(-100%) !important;
  /*-webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);*/
}
.hid{
  position: fixed;
}
</style>
<script>
    import style from './style.css'
    export default {
        data () {
            return {
            	transitionName: 'slide-left'
            }
        },
        // created(){
        //   document.body.setAttribute("class","hid");
        // },
        // destroyed(){
        //   document.body.removeAttribute("class","hid");
        // },
        watch: {
           '$route'() {
              if (_czc) {
                 var location = window.location;
                 var content_url = location.pathname + location.hash;
                 var referer_url = '/';
                 _czc.push(['_trackPageview', content_url, referer_url]);
              }
           },
        }
    }
</script>
