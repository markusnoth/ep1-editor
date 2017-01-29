<template>
    <Message v-bind:message="message" />
</template>

<script>
    import Message from './Message'
    import { mapState } from 'vuex'

    export default {
        computed: mapState(['message']),
        components: { Message }
    }
</script>

<style>
    body {
        margin: 50px;
        background-color: #222;
        color: #eee;
        font-family:Verdana, Geneva, Tahoma, sans-serif;
    }
</style>