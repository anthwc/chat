import vue from 'vue';
import { Toast } from 'vant';
vue.use(Toast);
let socket = {

};
function init() {
    socket = new WebSocket('ws://' + BASE_SOCKET);
    //打开事件
    socket.onopen =  () => {
        vue.prototype.$socketState = 1;
    };
    //获得消息事件
    socket.onmessage =  (msg) => {

    };
    //关闭事件
    socket.onclose = function () {
        console.log("Socket已关闭");
        vue.prototype.$socketState = 0;
    };
    //发生了错误事件
    socket.onerror = function () {
        console.log("Socket发生了错误");
        vue.prototype.$socketState = 0;
        init();
    };
    socket.sendMsg = function (msg) {
        if (this.readyState == 1) {
            this.send(JSON.stringify(msg));
        } else {
            Toast('服务连接失败!\n'+JSON.stringify(msg));
        }
    }
}

if (typeof (WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
} else {
    init();
}
export default socket;