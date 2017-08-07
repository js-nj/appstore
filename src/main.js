import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import {
    install as Mint
} from 'bh-mint-ui2';
// import VueResource from 'vue-resource';
import route from './router';
// import SDK, {
//     init
// } from 'bh-mobile-sdk';
import init from 'bh-mixin-sdk';
import 'bh-mint-ui2/lib/style.css'

Vue.use(Mint);
Vue.use(VueRouter);
// Vue.use(VueResource);
// Vue.http.options.credentials = true;
const router = new VueRouter(route);
let Init = () => {
    console.log("Init!!!");
    new Vue({
        el: '#app',
        router: router,
        render: h => h(App)
    });
}
init(() => {
    console.log("init");
    // var sdk = SDK();
    // if(sdk.UI && sdk.UI.toggleNavBar) {
    //     sdk.UI.toggleNavBar(false);
    // }
    Init();

}, {
    wx: {
        debug: false,
        url: WEBPACK_CONIFG_HOST + 'sys/appstoreservice/users/ticks.do',
        //url: 'http://res.wisedu.com:9090/checkSign',
        corp: ''
    }
})