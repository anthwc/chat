import Vue from "vue"; //引入vue文件
// import './js/rem';
import VueRouter from 'vue-router';
import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import 'amfe-flexible';
Vue.use(VueRouter).use(VideoPlayer);
import Router from './router/router'; // 自定义路由
import store from './store/store';// vuex
Vue.config.productionTip = false; // 阻止生产信息
import { Toast } from 'vant';
Vue.use(Toast);
import { JSEncrypt } from 'jsencrypt';
let Encrypt = new JSEncrypt();
//加密
Vue.prototype.$encode = (val) => {
    Encrypt.setPublicKey("-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/QNQ2nB8wI0x9/SRP7F0ozrAn\n" +
        "i9FUOMlTn7ExJJJkG4nAaBieAGP5cP+Gy7ahX+qekG4wJ5GTpGRdxmnaBZHBU+CV\n" +
        "SE0nQTN3AUQy+FjqsODEZCaw7Cnfl6h3XkigqQ2C/pTR6CT7nSQGMFOhuBxsfqow\n" +
        "GbsX+WpfP6xH3i2+2wIDAQAB\n" +
        "-----END PUBLIC KEY-----");
    let json_str = JSON.stringify(val);
    let sub_len = 117;
    let max_num = Math.ceil(json_str.length / sub_len);
    let temp_str = '';
    for (let i = 0; i < max_num; i++) {
        let sub_str = json_str.substring(i * sub_len, sub_len * (i + 1));
        temp_str += Encrypt.encrypt(sub_str);
    }
    return temp_str;
};
//解密
Vue.prototype.$decode = (val) => {
    Encrypt.setPrivateKey("-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIICXgIBAAKBgQC/QNQ2nB8wI0x9/SRP7F0ozrAni9FUOMlTn7ExJJJkG4nAaBie\n" +
        "AGP5cP+Gy7ahX+qekG4wJ5GTpGRdxmnaBZHBU+CVSE0nQTN3AUQy+FjqsODEZCaw\n" +
        "7Cnfl6h3XkigqQ2C/pTR6CT7nSQGMFOhuBxsfqowGbsX+WpfP6xH3i2+2wIDAQAB\n" +
        "AoGAZTIzV5XyNrFmxv9L2HJTtMTwlmw33d2SQYos4rjcMNYVZFZwOCIyxAjTXAqs\n" +
        "XuT2quH3O8mkEMAaTzguSCtMPFjgjDXByy/0kHc4WgGkReGG+N8xLJ6fcF3LglLm\n" +
        "dP0kxJ5rCVtafgq4AW0WW1eIFomnEJ3UqFzzQtMzXCiydRECQQD1/VtRdvZG98DH\n" +
        "5E1rV6zUd+i7W1tXjXN7joD7Vvvao+173cbkFIIluRi3TuWfSE7XdSt3PqQlrB9b\n" +
        "lzF/xhzpAkEAxwk+xnl2EkPMwcBU3OcU9sBK3AVAMBHJu1kxI97Ei9bxBYqUlZSK\n" +
        "/4bkIh8nOz4CONXmrXn+H/J9PEOSYM6TIwJBAM9JsnwRnTLsb/2B+2NrPG7GpM3N\n" +
        "DEnZHumNik9CW3VBEkyA9KsaRRn4wkUmLQVub1HMoNYZaUV9p+cMn1+m2JECQQCE\n" +
        "ZGDuUlK4eYLUiiOowMkQDP5+dbupfduLFBv8uSxRvEqcHf8RtDn1GHvdOo20+V0v\n" +
        "AxEq6U+hXoHxOR0/6YizAkEAvxukdv+juMuhdv73vXUs4uzUTz69IMhGlK/he8ov\n" +
        "KHu4TNKEzFoHoUR7QKbMPTkQv6BzSMtkRbY4Xu5pkLpMDA==\n" +
        "-----END RSA PRIVATE KEY-----");
    let sub_len = 172;
    let max_num = Math.ceil(val.length / sub_len);
    let temp_str = '';
    for (let i = 0; i < max_num; i++) {
        let sub_str = val.substring(i * sub_len, sub_len * (i + 1));
        temp_str += Encrypt.decrypt(sub_str);
    }
    return JSON.parse(temp_str);
};


window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("userInfo", JSON.stringify(store.state.userInfo));
});
Toast.setDefaultOptions({ position: 'bottom' });
import Http from './js/config/http';
import './js/config/axios';
import Path from './js/config/path';
Vue.prototype.$Http = Http;
Vue.prototype.$Path = Path;
import dateFormat from './js/dateFormat';
Vue.prototype.$dateFormat = dateFormat;
import defaultImg from './assets/images/cat.jpg';
Vue.prototype.$defaultImg = defaultImg;
Vue.prototype.$getChatContent = (send_user, accept_user, callback) => {
    Http("POST", Path.getChatContent, { phone: send_user, accept_user: accept_user }).then(
        (res) => {
            if (res.code == 200) {
                let j = {
                    'user': accept_user,
                    'data': res.data
                }
                store.commit("msgList", j);
                console.log('msgList', store.state.msgList);
            }
            if (callback) callback(res);
        }
    );
};
console.log('BASE_SOCKET', BASE_SOCKET);

Vue.prototype.$Path = Path;
import preventBack from 'vue-prevent-browser-back';//组件内单独引入

Vue.mixin({
    methods:{

    },
    
})
import App from "./App.vue"; // 引入模板文件

const appAm = new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    router: Router,
    store: store,
    mixins: [preventBack]
});
export default appAm;