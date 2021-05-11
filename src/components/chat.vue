<!--聊天内容区域-->
<template>
  <div class="container">
    <van-nav-bar :title="toUserInfo.name" left-arrow @click-left="back" />
    <ul id="content">
      <li
        v-for="(item, i) in msgList"
        :class="[item.accept_user == phone ? 'left' : 'right']"
        :key="i"
      >
        <span class="img-box">
          <img :src="img" class="chat-img" />
        </span>
        <chat-content
          :content="item.msg_content"
          :type="item.msg_type"
          :addr="[
            item.accept_user == phone
              ? 'left-' + item.msg_type
              : 'right-' + item.msg_type,
          ]"
        ></chat-content>
        <div class="clear"></div>
      </li>
      <div class="clear"></div>
    </ul>
    <div class="footer">
      <!--<div class="input-box">-->
      <!---->
      <!--</div>-->
      <van-search
        v-model="textMsg"
        show-action
        placeholder=""
        left-icon=""
        @search="sendText"
      >
        <template #action>
          <div @click="sendText">
            <van-button
              type="info"
              v-if="sendState"
              loading
              size="small"
              loading-type="spinner"
              >发送</van-button
            >
            <van-button type="info" v-if="!sendState" size="small"
              >发送</van-button
            >
          </div>
        </template>
      </van-search>
    </div>
  </div>
</template>
<script>
import vue from "vue";
import CodeImg from "./codeImg";
import {
  Toast,
  Search,
  NavBar,
  Field,
  Picker,
  Popup,
  Cell,
  Button,
} from "vant";
import fk from "../assets/video/fk.mp4";
import ChatContent from "./chatContent";
vue
  .use(Toast)
  .use(Search)
  .use(NavBar)
  .use(Field)
  .use(Picker)
  .use(Popup)
  .use(Cell)
  .use(Button);

export default {
  name: "Home",
  data() {
    return {
      sendState: false,
      textMsg: "",
      phone: this.$store.state.userInfo.phone,
      username: this.$store.state.userInfo.name,
      img: this.$store.state.userInfo.img || this.$defaultImg,
      toUserInfo: {
        name: "",
        img: "",
        username: "",
        phone: "",
      },
      msgList: [],
    };
  },
  components: {
    CodeImg,
    ChatContent,
  },
  props: ["option"],
  created() {
    this.toUserInfo = this.option;
    if (this.toUserInfo == "") {
      this.back();
    }
  },
  watch: {
    msgList(val) {
      this.$nextTick(() => {
        this.toFooter("content");
      });
    },
  },
  mounted() {
    if (this.$socketState) {
      // 设置用户位置 已读未读状态
      this.$socket.sendMsg({
        type: "user_location",
        phone: this.phone,
        location: this.toUserInfo.phone,
      });
    }
    this.$getChatContent(this.phone, this.toUserInfo.phone, (res) => {
      this.msgList = this.$store.state.msgList[this.toUserInfo.phone];
    });
  },
  methods: {
    back() {
      this.$emit("to_msgList", false);
    },
    sendText() {
      
      let acceptUserId = this.toUserInfo.phone;
      if (!acceptUserId) {
        Toast({
          type: "fail",
          message: "用户不存在",
        });
        return false;
      }
      let msg = this.textMsg;
      if (msg == null || msg == "") {
        return false;
      }
      if (this.sendState) return false;
      this.sendState = true;
      let param = {
        type: "chat",
        msg_content: msg,
        accept_user: acceptUserId,
        send_user: this.phone,
        msg_type: "text",
      };
      this.send(param);
    },
    send(param) {
      this.$Http("POST", this.$Path.sendMsg, param).then((res) => {
        this.sendState = false;
        if (res.code == 200) {
          this.textMsg = null;
          this.$emit('set_msg_list',param);
          this.$store.commit("msgList", {user:param.accept_user,data:param});
          this.$nextTick(() => {
            this.toFooter("content");
          });
        } else {
          Toast({
            type: "fail",
            message: res.msg,
          });
        }
      });
    },

    toFooter(id, type) {
      var content = document.getElementById(id);
      if (type == "top") {
        content.scrollTo(0, 0);
      } else {
        content.scrollTo(0, content.scrollHeight);
      }
    },

    c() {
      let val = this.val;
      console.log("即将加密:" + val);
      let en = this.en(val);
      console.log("加密后:" + en);
      let de = this.de(en);
      console.log("解密后:" + de);
    },
    en(val) {
      this.jsEnDe.setPublicKey(
        "-----BEGIN PUBLIC KEY-----\n" +
          "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/QNQ2nB8wI0x9/SRP7F0ozrAn\n" +
          "i9FUOMlTn7ExJJJkG4nAaBieAGP5cP+Gy7ahX+qekG4wJ5GTpGRdxmnaBZHBU+CV\n" +
          "SE0nQTN3AUQy+FjqsODEZCaw7Cnfl6h3XkigqQ2C/pTR6CT7nSQGMFOhuBxsfqow\n" +
          "GbsX+WpfP6xH3i2+2wIDAQAB\n" +
          "-----END PUBLIC KEY-----"
      );
      return this.jsEnDe.encrypt(val);
    },
    de(val) {
      this.jsEnDe.setPrivateKey(
        "-----BEGIN RSA PRIVATE KEY-----\n" +
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
          "-----END RSA PRIVATE KEY-----"
      );
      return this.jsEnDe.decrypt(val);
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped>
.van-popup--bottom {
  overflow: hidden;
}
#content {
  width: 100%;
  height: calc(100% - 46px - 54px);
  box-sizing: border-box;
  position: relative;
  padding: 15px 10px 5px 10px;
  background: #ebebeb;
  overflow-y: auto;
  .img-box {
    display: block;
    width: 35px;
    height: 35px;
    float: left;
    .chat-img {
      width: 100%;
      border-radius: 3px;
    }
  }

  li {
    position: relative;
    display: block;
    margin-bottom: 15px;
  }

  .left {
    .chat-content {
      float: left;
      margin-left: 15px;
    }
  }

  .right {
    .chat-content {
      float: right;
      margin-right: 15px;
    }
    .img-box {
      float: right;
    }
  }
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
}
</style>
