<!--聊天列表-->
<template>
  <div class="container-son">
    <div class="header">
      <span class="img-box">
        <img :src="img" class="chat-img" />
      </span>
      <div class="right-box">
        <span class="name">{{ username }}</span>
        <span class="logout" @click="login_out">退出</span>
      </div>
    </div>
    <ul id="chat-list">
      <li v-for="(item, i) of userList" @click="to_chat(item)" :key="i">
        <span class="img-box">
          <img :src="item.img" class="chat-img" />
        </span>
        <div class="right-box">
          <div class="content-div">
            <p class="user-name">{{ item.name }}</p>
            <p class="last-msg">{{ item.lastMsgContent }}</p>
          </div>
          <div class="msg-box">
            <p class="time">{{ item.lastMsgTime }}</p>
            <p class="msg_num" v-if="item.lastMsgNum > 0">
              {{ item.lastMsgNum > 99 ? "99+" : item.lastMsgNum }}
            </p>
          </div>
        </div>
      </li>
    </ul>
    <Chat
      v-if="chat"
      :option="toUserInfo"
      @to_msgList="to_msgList"
      @set_msg_list="set_msg_list"
      :msg_list="msgList[toUserInfo.phone]"
    ></Chat>
  </div>
</template>
<script>
import vue from "vue";
import Chat from "../components/chat";
import { Toast, Search, NavBar, Field, Picker, Popup, Cell } from "vant";
vue
  .use(Toast)
  .use(Search)
  .use(NavBar)
  .use(Field)
  .use(Picker)
  .use(Popup)
  .use(Cell);
export default {
  name: "Home",
  data() {
    return {
      chat: false,
      textMsg: "",
      phone: this.$store.state.userInfo.phone,
      username: this.$store.state.userInfo.name,
      img: this.$store.state.userInfo.img || this.$defaultImg,
      toUserInfo: {},
      msgList: {},
      userList:this.$store.state.userList
    };
  },
  components: {
    Chat,
  },
  watch: {
    
  },
  created() {},
  mounted() {
  },
  methods: {
    set_msg_list(item) {
        this.$parent.set_last_msg(item);
    },
    to_chat(item) {
      this.toUserInfo = item;
      this.chat = true;
    },
    to_msgList(val) {
      this.$socket.sendMsg({
        type: "user_location",
        phone: this.phone,
        location: "聊天列表",
      });
      this.chat = val;
    },
    login_out() {
      this.$Http("POST", this.$Path.loginOut, { phone: this.phone }).then(
        (res) => {
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("userInfo");
          this.$store.commit("userInfo", {});
          Toast({
            type: "success",
            message: "退出成功",
            position: "middle",
            duration: 1500,
            onClose: () => {
              this.$router.push({
                name: "login",
              });
            },
          });
        }
      );
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped>
.img-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  float: left;
  .chat-img {
    width: 100%;
    border-radius: 3px;
  }
}
.header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  padding-left: 10px;
  background-image: linear-gradient(to right, #00d9fe, #01a8ff);
  .img-box {
    width: 35px;
    height: 50px;
    display: flex;
    align-items: center;
    .chat-img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }
  .right-box {
    width: calc(100% - 50px);
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    padding-left: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name {
      font-size: 16px;
    }
    .logout {
      float: right;
      font-size: 12px;
    }
  }
}
#chat-list {
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  padding: 15px 0;
  background-color: #fff;
  li {
    width: 100%;
    height: 60px;
    line-height: 60px;
    box-sizing: border-box;
    padding: 5px 15px;
    margin-bottom: 8px;
    border-bottom: 1px solid #f5f5f5;
  }

  .right-box {
    width: calc(100% - 50px);
    height: 50px;
    float: left;
    .content-div {
      width: calc(100% - 51px);
      box-sizing: border-box;
      margin: 0;
      padding: 0 8px;
      float: left;
      overflow: hidden;
      height: 50px;
      p {
        width: 100%;
      }
      p.user-name {
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: #000;
      }
      p.last-msg {
        height: 20px;
        line-height: 15px;
        font-size: 14px;
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .msg-box {
      float: right;
      width: 51px;
      height: 50px;
      .time {
        height: 30px;
        line-height: 30px;
        font-size: 8px;
        color: #999999;
        text-align: right;
      }
      .msg_num {
        width: max-content;
        height: 16px;
        padding: 0 5px;
        line-height: 16px;
        font-size: 8px;
        float: right;
        text-align: center;
        color: #fff;
        background-color: #d3dae2;
        border-radius: 5px;
      }
    }
  }
}
</style>
