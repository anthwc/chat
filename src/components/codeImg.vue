<template>
    <div id="codeImgBox" :style="{height:h+'px'}">
        <canvas v-if="!codeState" id="codeBox" @click="getRandomStr" title="点击更换验证码">验证码生成失败</canvas>
        <img id="codeImg" v-if="codeState" :src="imgUrl" alt="验证码生成失败" title="点击更换验证码" @click="getRandomStr">
    </div>
</template>
<script>
    export default {
        name: 'Code',
        components: {},
        data() {
            return {
                codeLen: 0,
                code: '',
                w: 90,
                h: 25,
                size: 0,
                codeState: false,
                imgUrl: '',
            }
        },
        props: ['codeLength', 'codeSize'],
        created() {
            this.codeLen = this.codeLength || 6;
            this.size = this.codeSize || 25;
        },
        mounted() {
            this.getRandomStr();
        },
        methods: {
            getRandomStr() {
                let randomArr = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
                let arrLen = randomArr.length;
                let code = '';
                for (let i = 0; i < this.codeLen; i++) {
                    let index = Math.floor(Math.random() * arrLen);
                    code += randomArr[index];
                }
                this.code = code;
                this.createCode();
            },
            createCode() {
                this.codeState = false;
                this.$nextTick(() => {
                    let fontSize = this.size;
                    let canvas = document.getElementById("codeBox");
                    let ctx = canvas.getContext("2d");
                    ctx.font = fontSize + "px 微软雅黑";
                    this.w = ctx.measureText(this.code).width;
                    this.h = fontSize;
                    canvas.width = this.w;
                    canvas.height = this.h;

                    ctx.font = "20px Helvetica";
                    ctx.textAlign = "center";
                    // 设置垂直对齐方式
                    ctx.textBaseline = "middle";
                    ctx.fillText(this.code, this.w / 2, this.h / 2 + 2);
                    this.imgUrl = canvas.toDataURL("image/png");
                    this.codeState = true;
                    this.$emit('code', this.code);
                })
            }
        },

    }
</script>

<style lang="css" scoped>
    #codeImgBox {
        width: max-content;
    }
    #codeBox,#codeImg {
        /*position: relative;*/
        /*top: 50%;*/
        /*left: 50%;*/
        /*transform: translate(-50%, -50%);*/
        cursor: pointer;
    }
</style>
