<template>
    <div>
        {{msg}}
        <router-link :to="{path:'home'}">home</router-link>
        <router-link :to="{path:'b'}">b</router-link>
    </div>
</template>
<script>
    export default {
        name : 'C',
        data(){
            return {
                msg : 'C'
            }
        }
    }
</script>