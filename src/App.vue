<template>
    <Message message="Hello World" />
</template>

<script>
    import Message from './components/Message'

    export default {
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