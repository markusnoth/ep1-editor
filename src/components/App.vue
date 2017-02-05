<template>
    <Editor :data="data" />
</template>

<script>
    import Editor from './Editor'
    import { mapState } from 'vuex'

    export default {
        computed: mapState({
            data: state => state.data.length ? state.data : null
        }),
        components: { Editor }
    }
</script>

<style>
    body {
        margin: 50px;
        background-color: #222;
        color: #eee;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        max-width: 800px;
    }
</style>