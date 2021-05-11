import vue from 'vue';
import store from "../../store/store";
import router from "../../router/router";
import axios from 'axios';
let cleanInfo = (click) => {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    source.cancel('请求取消');
    store.commit('logOut');
    localStorage.removeItem('UserInfo');
    sessionStorage.removeItem('store');
    if (vue.$socket) {
        vue.$socket.close();
    }
    router.push({
        path : '/login'
    })
};
export default cleanInfo;