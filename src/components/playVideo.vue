<template>
    <video-player class="video-player"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
    ></video-player>
</template>

<script>
    import vue from 'vue';

    export default {
        name: "PlayVideo",
        data(){
            return {
                playerOptions : {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [
                        // {
                        // // type: "video/mp4",
                        // // src: 'http://vjs.zencdn.net/v/oceans.mp4'//url地址
                        // // src: "" //url地址
                        // }
                    ],
                    poster: "", //你的封面地址
                    // width: document.documentElement.clientWidth,
                    notSupportedMessage: '',
                    controlBar: {
                        timeDivider: true, // 声音控制
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    }
                }
            }
        },
        props : ['playlist','options'],
        created() {
            if (this.options) {
                for (var key in this.options) {
                    this.playerOptions[key] = this.options[key];
                }
            }
            this.playerOptions.sources = this.playlist;
        }
    }
</script>

<style type="text/scss" lang="scss">
    .video-player .video-js .vjs-big-play-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        line-height: 37px;
        top: calc(50% - 20px);
        left: calc(50% - 20px);
    }
</style>