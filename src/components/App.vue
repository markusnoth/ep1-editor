<template>
    <div>
        <div class="tool-bar">

        </div>
        <Editor :value="data" @input="updateData" @selectionChanged="setSelection" />
        <div class="status-bar">
            <span v-if="selection">[{{ selection.row + 1 }} : {{ selection.col }}]</span>
        </div>
    </div>
</template>

<script>
    import Editor from './Editor'
    import { mapState, mapMutations } from 'vuex'

    export default {
        data:() => ({ selection: null }),
        computed: mapState(['data']),
        methods: {
            ...mapMutations({
                updateData: 'setData'
            }),
            setSelection(selection) {
                this.selection = selection
            }
        },
        components: { Editor }
    }

</script>

<style lang="sass">
    body {
        margin: 50px;
        background-color: #d5d5cb;
        color: #333;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        .status-bar {
            margin-top: 10px;
            text-align: right;
            font-size: 0.6em;
        }
    }
</style>