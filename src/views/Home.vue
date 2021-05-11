<template>
  <div class="container">
    <component :is="activeComponent"></component>
    <van-tabbar route v-model="active">
      <van-tabbar-item
        v-for="menu in menu_list"
        replace
        :name="menu.id"
        :to="menu.url"
        :icon="menu.icon"
        :key="menu.id"
      >
        {{ menu.name }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Vue from "vue";
import socket from "../js/config/socket"; // socket
import { Tabbar, TabbarItem, Dialog, Toast } from "vant";
Vue.use(Tabbar).use(TabbarItem).use(Dialog).use(Toast);
export default {
  name: "Home",
  data() {
    return {
      activeComponent: "msgList",
      userList: [],
      phone: this.$store.state.userInfo.phone,
      username: this.$store.state.userInfo.name,
      img: this.$store.state.userInfo.img || this.$defaultImg,
      active: 1,
      today: "",
      menu_list: [
        {
          name: "消息",
          url: "/home",
          state: true,
          icon: "home-o",
          id: 1,
        },
        {
          name: "好友",
          url: "/friends",
          state: true,
          icon: "friends-o",
          id: 2,
        },
      ],
      msgList: [],
      socketState: this.$socketState,
      initTimer: "",
    };
  },
  watch: {
    socketState(newVal) {
      console.log("new", newVal);
    },
  },
  components: {
    Tabbar,
    TabbarItem,
  },
  created() {
    this.today = this.$dateFormat("YYYY-mm-dd", new Date());
  },
  mounted() {
    this.$socket.emit('send', {
      type: "init",
      phone: this.phone,
      name: this.username,
      img: this.img,
      location: 1,
      token: this.$store.state.userInfo.token,
    })
    this.init();
    // Dialog.alert({
    //     title: '提示',
    //     message: '您的账号在其他地方登录,如非本人操作,请修改密码'
    // }).then(() => {
    //     // on close
    // });
  },
  methods: {
    // socket 连接
    init() {
      socket.onopen = () => {
        Vue.prototype.$socket = socket;
        this.$socket.sendMsg({
          type: "init",
          phone: this.phone,
          name: this.username,
          img: this.img,
          location: 1,
          token: this.$store.state.userInfo.token,
        });
        this.$socket.onmessage = (res) => {
          let data = JSON.parse(res.data);
          switch (data.type) {
            case "init":
              let client_id = data.client_id;
              let userInfo = this.$store.state.userInfo;
              userInfo.client_id = client_id;
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
              break;
            case "chat":
              let msgList = this.$store.state.msgList[data.send_user];
              if (msgList == undefined) {
                 msgList = [];
              }
              this.$store.commit('msgList',{user:data.send_user,data:data});
              this.set_last_msg(data);
              break;
            case "list":
              data.list.forEach((v, k) => {
                if (v.phone != this.phone) {
                  // 不是当前登录用户
                  v.lastMsgTime = "";
                  v.lastMsgContent = "";
                  v.lastMsgType = "";
                  v.lastMsgNum = 0;
                  if (this.msgList[v.phone] == undefined) {
                    this.msgList[v.phone] = [];
                  } else {
                    let temp = this.msgList[v.phone],
                      len = temp.length;
                    let last_data = this.msgList[v.phone][len - 1];
                    if (last_data) {
                      let t = last_data.send_time;
                      if (t) {
                        let send_time = t.substr(0, 10);
                        if (t.substr(0, 10) == this.today) {
                          send_time = t.substr(11, 5);
                        }
                        v.lastMsgTime = send_time;
                      }
                      v.lastMsgContent = last_data.msg_content;
                      v.lastMsgType = last_data.msg_type;
                      v.lastMsgNum = 0; // 后期考虑已读未读
                    }
                  }

                  let temp_arr = [];
                  for (let i = 0, len = this.userList.length; i < len; i++) {
                    temp_arr.push(this.userList[i].phone);
                  }
                  if (temp_arr.indexOf(v.phone) == -1) {
                    this.userList.push(v);
                  }
                  this.$store.commit('userList',JSON.stringify(this.userList));
                }
              });
              break;
            case "repeat_login": // 异地登录
              // Dialog.confirm({
              //     title: '提示',
              //     message: '您的账号在其他地方登录\n如非本人操作，请修改密码',
              //     confirmButtonText : '修改密码'
              // }).then(() => {
              //     Toast({
              //         type: 'fail',
              //         message: '还没做',
              //         onClose : () => {
              //             this.$socket.close();
              //             this.$router.push({
              //                 path : '/login'
              //             })
              //         }
              //     });
              // }).catch(() => {
              //     this.$router.push({
              //         path : '/login'
              //     })
              // });
              break;
          }
        };
      };
    },
    // onChange(val){
    // this.$router.push({
    //     name : this.active
    // })
    // }

    // 取消未读
    set_user_list(phone) {
      for (let i = 0, len = this.userList.length; i < len; i++) {
        if (this.userList[i].phone == phone) {
          this.userList[i].lastMsgNum = 0;
          break;
        }
      }
    },
    // 设置最后一条显示内容
    set_last_msg(data) {
      for (let i = 0, len = this.userList.length; i < len; i++) {
        // 获取最新一条
        if (
          this.userList[i].phone == data.send_user ||
          this.userList[i].phone == data.accept_user
        ) {
          //
          if (this.userList[i].location == data.accept_user) {
            // 正在聊天界面
            this.userList[i].lastMsgNum = 0;
          } else {
            if (data.send_user != this.phone) {
              this.userList[i].lastMsgNum = this.userList[i].lastMsgNum + 1;
            }
          }
          this.userList[i].lastMsgContent = data.msg_content;
          let t = data.send_time;
          if (t) {
            let send_time = t.substr(0, 10); // 其他时间数据显示日期
            if (t.substr(0, 10) == this.today) {
              // 今天数据显示发送时间
              send_time = t.substr(11, 5);
            }
            this.userList[i].lastMsgTime = send_time;
          }
          break;
        }
      }
      this.$store.commit('userList',JSON.stringify(this.userList));
    },


    
  },
  components: {
    // 主页
    msgList: () =>
      import(/* webpackChunkName: "showHome" */ "../views/msgList.vue"),
  },
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.content {
  width: 100%;
  height: 100%;
  /* height: calc(100% - 50px); */
}
.van-tabbar {
  background-color: #fafbfc;
}
</style>