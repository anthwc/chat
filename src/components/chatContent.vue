<!--聊天内容-->
<template>
    <div>
        <div v-if="msg_type == 'text'" :class="[class_name,'chat-text']">{{msg_content}}</div>
        <div v-if="msg_type == 'image'" :class="[class_name,'chat-img']"><img :src="msg_content" width="100%" @click="imgPreview(msg_content)"></div>
        <div v-if="msg_type == 'media'" :class="[class_name,'chat-video']">
            <video :src="msg_content" width="100%" @click="videoPlay = true"></video>
            <img v-if="false" :src="poster" width="100%" @click="videoPlay = true">
        </div>
        <van-overlay :show="videoPlay" @click="videoPlay = false">
            <div class="big-video" v-if="videoPlay">
                <play-video :playlist="[{src:msg_content,type:'video/mp4'}]" :options="videoOption"></play-video>
            </div>
        </van-overlay>
    </div>
</template>
<script>
    import vue from 'vue';
    import {ImagePreview,Overlay} from 'vant';
    import PlayVideo from './playVideo';
    vue.use(ImagePreview).use(Overlay);
    export default {
        name: "ChatContent",
        data() {
            return {
                videoPlay : false,
                videoOption : {
                    playbackRates : [],
                    controlBar : {
                        timeDivider: false,
                        durationDisplay: true,
                        remainingTimeDisplay: false, //剩余时间
                        fullscreenToggle: true  //全屏按钮
                    }
                },
                msg_type : '',
                msg_content : '',
                class_name : '',
                poster : false,
            }
        },
        components : {
            PlayVideo
        },
        props : ['content','addr','type'],
        created(){
            this.msg_content = this.content;
            this.class_name = this.addr;
            this.msg_type = this.type;
        },
        mounted(){
            if (this.msg_type == 'video') {
                // poster
                this.getVideoBase64(this.msgContent);
            }
        },
        methods : {
            getVideoBase64(url) {
                this.$nextTick(()=> {
                    let video = document.createElement("video");
                    video.setAttribute('crossOrigin', 'anonymous');//处理跨域
                    video.setAttribute('src', url);
                    video.setAttribute('width', 400);
                    video.setAttribute('height', 240);
                    console.log(video);
                    video.addEventListener('loadeddata', () => {
                        let canvas = document.createElement("canvas"),
                            width = video.offsetWidth,
                            height = video.offsetHeight;
                        console.log(video,width, height);
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
                        this.poster = canvas.toDataURL('image/jpeg'); //转换为base64
                    });
                })
            },
            imgPreview(img){
                ImagePreview({
                    images: [img],
                    showIndex : false,
                })
            }
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    .chat-img {
        width: 30%;
        img {
            border-radius: 6px;
        }
    }
    .chat-video {
        max-width: 40%;
    }
    .right-img,.right-video {
        float: right;
        margin-right: 15px;
    }
    .left-img,.left-video {
        float: left;
        margin-left: 15px;
    }

    .chat {
        width: 100%;
        height: 100%;
    }

    .right-text {
        background: #98E165;
        float: right;
        margin-right: 15px;
    }

    .right-text:before {
        content: '';
        position: absolute;
        left: calc(100% - 1px);
        top: 8px;
        width: 0;
        height: 0;
        border-width: 8px;
        border-style: solid;
        border-color: transparent;
        border-left-width: 8px;
        border-left-color: currentColor;
        color: #98E165;
    }

    .left-text {
        background: #ffffff;
        float: left;
        margin-left: 15px;
    }

    .left-text:before {
        content: '';
        position: absolute;
        right: calc(100% - 1px);
        top: 8px;
        width: 0;
        height: 0;
        border-width: 8px;
        border-style: solid;
        border-color: transparent;
        border-right-width: 8px;
        border-right-color: currentColor;
        color: #ffffff;
    }

    .chat-text {
        position: relative;
        max-width: 60%;
        width: max-content;
        box-sizing: border-box;
        line-height: 22px;
        padding: 10px;
        font-size: 16px;
        border-radius: 6px;
        color: #000;
        word-break: break-all;
        word-wrap: break-word;
    }

    .big-video {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .video-player {
        width: 100%!important;
        text-align: center;
    }
    .van-overlay {
        z-index: 100;
    }


</style>