<template>
    <div>
        <div class="tool-bar">
            <PageLoader style="display: inline-block;" @pageLoaded="updateData" />
            <label><input type="checkbox" v-model="displayCodes" /> Display Codes</label>
        </div>
        <Editor v-if="data" :value="data" @input="updateData" @selectionChanged="setSelection" :displayCodes="displayCodes" />
        <div class="status-bar">
            <span v-if="selection">[{{ selection.row + 1 }} : {{ selection.col }}]</span>
        </div>
    </div>
</template>

<script>
    import Editor from './Editor'
    import PageLoader from './PageLoader'
    import { mapState, mapMutations } from 'vuex'

    export default {
        data:() => ({ 
            selection: null,
            displayCodes: false
        }),
        computed: mapState(['data']),
        methods: {
            ...mapMutations({
                updateData: 'setData'
            }),
            setSelection(selection) {
                this.selection = selection
            }
        },
        components: { Editor, PageLoader }
    }

</script>

<style lang="sass">
    body {
        margin: 20px 30px;
        background-color: #d5d5cb;
        color: #333;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        .tool-bar {
            margin-bottom: 10px;
        }
        .status-bar {
            margin-top: 10px;
            text-align: right;
            font-size: 0.6em;
        }
    }
</style>