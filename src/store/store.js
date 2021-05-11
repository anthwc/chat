import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        userInfo: {
            state: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).state : null,
            phone: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).phone : null,
            name: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).name : null,
            img: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).img : null,
            token: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).token : null,
            encryption: JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).encryption : null,
            client_id : JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).client_id : null,
        },
        msgList : {},
        userList : null
    },
    mutations: {
        logOut(state) {
            state.userInfo = {};
        },
        userInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        msgList(state, param) {
            if (!state.msgList[param.user]) state.msgList[param.user] = [];
            if (param.data.length == undefined) {
                state.msgList[param.user].push(param.data);
            } else {
                state.msgList[param.user] = param.data;
            }
        },
        userList(state,param) {
            state.userList = param;
        }
    }
});
export default store;