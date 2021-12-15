<template>
    <div @click="textBtn">
        {{text}}
    </div>
</template>
<script>
    export default {
        data() {
            return {
                text: '在md中使用vue'
            }
        },
        methods: {
            textBtn() {
                console.log('被点击了')
            }
        }
    }
</script>
