<template>
    <Editor :value="ep1Data" @input="onEp1Change" />
</template>

<script>
    import Editor from './Editor'
    import { mapState, mapMutations } from 'vuex'

    export default {
        computed: mapState({
            ep1Data: state => state.data.length ? state.data : null
        }),
        methods: mapMutations({
            onEp1Change: 'setData'
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