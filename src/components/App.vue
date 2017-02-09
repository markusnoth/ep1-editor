<template>
    <div>
        <div class="tool-bar">
            <PageLoader style="display: inline-block;" @pageLoaded="updateData" />
            <label><input type="checkbox" v-model="displayCodes" /> Display Codes</label>
            <a href="#" @click.prevent="download" download="TeletextPage.ep1">Download EP1</button>
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
            },
            download(e) {
                if(this.data) {
                    const blob = new Blob([new Int8Array(this.data)], { type: 'application/ep1' })
                    const link = document.createElement('a')
                    link.setAttribute('href', URL.createObjectURL(blob))
                    link.setAttribute('download', 'teletext_page.ep1')
                    link.click()
                }
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
            font-size: 0.6em;
        }
    }
</style>