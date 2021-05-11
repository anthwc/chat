import vue from 'vue'
import index from '../../index'
import axios from 'axios'
import {Toast} from 'vant'

import cleanInfo from './cleanInfo';
vue.use(Toast);
axios.defaults.baseURL = BASE_API;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.retry = 1;
axios.defaults.retryDelay = 1000;
axios.defaults.timeout = 10000; // 超时时间
axios.defaults.headers.Author = 'Huang';
// 请求前
axios.interceptors.request.use(
    config => {
        let token = JSON.parse(localStorage.getItem('UserInfo')) ? JSON.parse(localStorage.getItem('UserInfo')).token : null;
        let phone = JSON.parse(localStorage.getItem('UserInfo')) ? JSON.parse(localStorage.getItem('UserInfo')).phone : null;
        if (token) config.headers.Token = token;
        if (phone) config.headers.Phone = phone;
        return config;
    },
    err => Promise.reject(err)
);
let _num = 0;
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            let encryption = JSON.parse(localStorage.getItem('UserInfo')) ? JSON.parse(localStorage.getItem('UserInfo')).encryption : null;
            let data = encryption ? index.$decode(response.data) : response.data;
            if (data.code == undefined) {
                Toast.fail("数据异常");
                return {};
            }
            if (data.code == 403) {
                Toast({
                    type : 'fail',
                    message : data.msg,
                    onClose(){
                        cleanInfo();
                    }
                });
                return {};
            }
            response = data;
            return response;
        } else {
            Toast.fail("请求失败");
            return {};
        }
    },
    error => {
        _num++;
        if (_num >= 2) {
            _num = 0;
            Toast.fail("服务器错误");
            return {};
        }
        if (error.response === undefined) {
            Toast.fail("连接错误");
            return {};
        }
        if (error.response.status == 404) {
            Toast.fail("地址异常");
            return {};
        }
    }
);