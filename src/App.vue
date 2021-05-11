<template>
  <Router-view></Router-view>
</template>
<script>
export default {
  name: "App",
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {
      
  },
  methods: {
      
  },
};
</script>
<style type="text/scss" lang="scss">
* {
  padding: 0;
  margin: 0;
  text-decoration: none;
  list-style: none;
}

.container {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.container-son {
  width: 100%;
  height: 100%;
}

@media screen and (min-device-width: 641px) and (min-device-height: 764px) {
  ::-webkit-scrollbar {
    width: 5px;
    height: 1px;
  }

  ::-webkit-scrollbar-thumb {
    background: #1a355d;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #282f4b;
    background: #ebebeb;
  }
}

.clear {
  clear: both;
}
</style>