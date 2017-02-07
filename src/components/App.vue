<template>
    <div>
        <div class="tool-bar">
            
        </div>
        <Editor :value="data" @input="updateData" />
    </div>
</template>

<script>
    import Editor from './Editor'
    import { mapState, mapMutations } from 'vuex'

    export default {
        computed: mapState(['data', 'selection']),
        methods: {
            ...mapMutations({
                updateData: 'setData'
            })
        },
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
    .status-bar {
        margin-top: 10px;
        text-align: right;
        font-size: 0.6em;
    }
</style>