<template>
  <div id="register-box">
    <van-nav-bar title="注册" />
    <van-form @submit="onSubmit" label-align="right" label-width="80px">
      <van-field
        v-model="field.phone"
        type="number"
        label="手机号"
        placeholder="请输入手机号"
        class="label-justify"
        autocomplete="off"
        :clearable="true"
        maxlength="11"
        :rules="[
          { required: true, message: '' },
          { pattern: phoneRule, message: '手机号格式错误' },
        ]"
      />
      <van-field
        v-model="field.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        class="label-justify"
        autocomplete="off"
        :clearable="true"
        :rules="[
          { required: true, message: '' },
          {
            pattern: /^[\w]{6,12}$/,
            message: '密码由6-12位字母、数字、下划线组成',
          },
        ]"
      />
      <van-field
        v-model="field.repassword"
        type="password"
        label="确认密码"
        placeholder="请确认密码"
        class="label-justify"
        autocomplete="off"
        :clearable="true"
        :rules="[
          { required: true, message: '' },
          { validator: passwordRule, message: '两次密码不一致' },
        ]"
      />
      <van-field
        v-model="field.code"
        type="number"
        maxlength="6"
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
        class="label-justify"
        autocomplete="off"
        :rules="[{ required: true, message: '' }]"
      >
        <template #button>
          <van-button
            size="mini"
            native-type="button"
            plain
            type="primary"
            @click="getCode"
            :disabled="BtnNo"
            >{{ getCodeHtml }}</van-button
          >
        </template>
      </van-field>
      <p class="aui-flex-links">
        <span class="a-left">
          已有账号?
          <router-link tag="a" :to="{ path: 'login' }">立即登录</router-link>
        </span>
      </p>
      <div style="margin: 10px 16px">
        <van-button block type="info" size="small" native-type="submit"
          >立即注册</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import Vue from "vue";
import { Form, Field, Button, NavBar, Toast } from "vant";
Vue.use(Form).use(Field).use(Button).use(NavBar).use(Toast);
export default {
  name: "Register",
  data() {
    return {
      phoneRule: /^1[3456789]\d{9}$/,
      field: {
        phone: "",
        password: "",
        repassword: "",
        code: "",
      },
      t: 120,
      timer: null,
      getCodeHtml: "获取验证码",
      BtnNo: false,
    };
  },
  components: {},
  methods: {
    onSubmit() {
      this.$Http("POST", this.$Path.UserRegister, this.field).then((res) => {
        if (res.code == 200) {
          Toast({
            type: "success",
            message: res.msg,
            onClose: () => {
              this.$router.push({ path: "/login" });
            },
          });
        } else {
          Toast.fail(res.msg);
        }
      });
    },
    passwordRule(value) {
      if (value !== this.field.password) {
        return false;
      }
      return true;
    },
    getCode() {
      let phone = this.field.phone;
      if (phone == "") {
        Toast("请先填写手机号");
        return;
      }
      if (this.phoneRule.test(phone) === false) {
        Toast("手机号格式错误");
        return;
      }
      if (this.timer) clearInterval(this.timer);
      this.$Http("POST", this.$Path.getCode, { phone: this.field.phone }).then(
        (res) => {
          Toast(res.msg);
          if (res.code == 200) {
            this.BtnNo = true;
            this.timer = setInterval(() => {
              this.getCodeHtml = this.t + "秒后重新获取";
              if (this.t <= 0) {
                this.getCodeHtml = "重新获取";
                this.BtnNo = false;
                clearInterval(this.timer);
                this.t = 120;
              }
              this.t = this.t - 1;
            }, 1000);
          }
        }
      );
    },
  },
};
</script>
<style type="text/scss" lang="scss">
#register-box {
  .van-cell {
    height: 60px;
    line-height: 35px;
  }
  .van-field__error-message {
    height: 12px;
    line-height: 12px;
    text-align-last: left;
  }
  .aui-flex-links {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: right;
    padding: 6px 16px;
    box-sizing: border-box;
    margin: 0;
    a,
    span {
      color: #bbb;
      font-size: 12px;
    }
    .clear {
      clear: both;
    }
    .a-left {
      float: right;
      a {
        color: #1989fa;
      }
    }
    .a-right {
      float: right;
    }
  }
  .aui-login-line {
    position: relative;
    text-align: center;
    padding-top: 30px;
    h2 {
      font-size: 12px;
      color: #cccccc;
      background: #fff;
      width: 120px;
      margin: 0 auto;
      z-index: 1002;
      position: relative;
    }
  }
  .aui-login-line:after {
    content: "";
    position: absolute;
    z-index: 0;
    bottom: 8px;
    left: 10px;
    width: 95%;
    height: 1px;
    border-bottom: 1px solid #cccccc;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
  }
  .aui-login-armor {
    width: 85%;
    position: relative;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 30px 5px 7px 5px;
    margin: 0 auto;
    .aui-tabBar-item {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #979797;
      img {
        width: 40px;
        height: 40px;
        display: block;
        border: none;
        border-radius: 100%;
      }
    }
  }
}
</style>