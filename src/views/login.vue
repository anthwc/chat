<template>
  <div id="login-box">
    <van-nav-bar title="登录" />
    <van-form @submit="onSubmit" label-align="right" label-width="80px">
      <van-field
        v-model="field.phone"
        type="number"
        label="手机号"
        placeholder="请输入手机号"
        class="label-justify"
        autocomplete="off"
        maxlength="11"
        :clearable="true"
        :rules="[
          { required: true, message: '' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误' },
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
        :rules="[{ required: true, message: '' }]"
      />
      <van-field
        v-if="loginNum >= 3"
        v-model="field.code"
        clearable
        label="验证码"
        placeholder="请输入图片验证码"
        class="label-justify"
        autocomplete="off"
        :rules="[
          { required: true, message: '', trigger: 'onChange' },
          { validator: codeRule, message: '验证码错误' },
        ]"
      >
        <template #button>
          <code-img :codeLength="4" @code="codeFun"></code-img>
        </template>
      </van-field>
      <p class="aui-flex-links">
        <span class="a-left">
          没有账号?
          <router-link tag="a" :to="{ path: 'register' }">立即注册</router-link>
        </span>
        <!--<a href="javascript:;" class="a-right">忘记密码?</a>-->
      </p>
      <div style="margin: 10px 16px">
        <van-button block type="info" size="small" native-type="submit"
          >登 <span class="space-2"></span>录</van-button
        >
      </div>
      <div class="aui-login-line">
        <!--<h2>其他登录方式</h2>-->
      </div>
      <div class="aui-login-armor">
        <!--<a href="javascript:;" class="aui-tabBar-item">-->
        <!--<img :src="icon1" alt="支付宝">-->
        <!--</a>-->
        <!--<a href="javascript:;" class="aui-tabBar-item">-->
        <!--<img :src="icon2" alt="微信">-->
        <!--</a>-->
        <!--<a href="javascript:;" class="aui-tabBar-item">-->
        <!--<img :src="icon3" alt="微博">-->
        <!--</a>-->
      </div>
    </van-form>
  </div>
</template>
<script>
import Vue from "vue";
import { Form, Field, Button, NavBar, Toast } from "vant";
Vue.use(Form).use(Field).use(Button).use(NavBar).use(Toast);
import icon1 from "../assets/images/icon-sin-001.png";
import icon2 from "../assets/images/icon-sin-002.png";
import icon3 from "../assets/images/icon-sin-003.png";
import CodeImg from "../components/codeImg";
export default {
  name: "Login",
  data() {
    return {
      field: {
        // phone: "",
        phone : '13077929790',
        password: "123456",
        code: "",
      },
      icon1: icon1,
      icon2: icon2,
      icon3: icon3,
      loginNum: 0,
      code: "",
    };
  },
  components: {
    "code-img": CodeImg,
  },
  created() {
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("userInfo");
    let code = sessionStorage.getItem("code");
    if (code == 3) {
      this.loginNum = 3;
    }
    // let a = this.$encode({code:200,"msg":"请求成功",data:{"phone":"13077929790","state":"1",token:"184d62530e745fa1dee131cb8222222222222222222222222222284eb8a3333333333333333333333333333336184d62530e745fa1dee131cb8222222222222222222222222222284eb8a3333333333333333333333333333336184d62530e745fa1dee131cb8222222222222222222222222222284eb8a3333333333333333333333333333336184d62530e745fa1dee131cb8222222222222222222222222222284eb8a3333333333333333333333333333336"}});
    // console.log('加密',a);
    // let b = this.$decode(a);
    // console.log('解密',b);
  },
  methods: {
    onSubmit() {
      this.$Http("POST", this.$Path.login, this.field)
        .then((res) => {
          sessionStorage.setItem("code", this.loginNum);
          if (res.code == 200) {
            sessionStorage.removeItem("code");
            res.data.client_id = "";
            this.$store.commit("userInfo", res.data);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            this.$router.push({
              name: "home",
            });
          } else {
            this.loginNum = this.loginNum + 1;
            Toast(res.msg);
          }
        })
        .catch((res) => {
          this.loginNum = this.loginNum + 1;
        });
    },
    codeFun(val) {
      this.code = val;
    },
    codeRule(val) {
      if (val.toUpperCase() !== this.code) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style type="text/scss" lang="scss" scoped>
#login-box {
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
  .space-2 {
    display: inline-block;
    width: 2em;
  }
}
</style>