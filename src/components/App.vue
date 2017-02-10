<template>
    <div class="app">
        <div class="toolbar">
            <div>
                <PageLoader style="display: inline-block;" @pageLoaded="setData" />
                <button :disabled="!data" @click="download"><img src="static/save.png"/></button>
                <button :disabled="!history.length" @click="undo"><img src="static/undo.png" /></button>
                <button :disabled="!history.redo" @click="redo"><img src="static/redo.png" /></button>
            </div>
        </div>
        <Editor v-if="data" :value="data" @input="setData" @selectionChanged="setSelection" :displayCodes="displayCodes" />
        <div class="statusbar">
            <label v-if="data"><input type="checkbox" v-model="displayCodes" /> Display Codes</label>
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
        computed: mapState(['data','history']),
        methods: {
            ...mapMutations(['setData','undo','redo']),
            setSelection(selection) {
                this.selection = selection
            },
            download() {
                const blob = new Blob([new Int8Array(this.data)], { type: 'application/ep1' })
                const a = document.createElement('a')
                a.setAttribute('href', URL.createObjectURL(blob))
                a.setAttribute('download', 'TeletextPage.ep1')
                a.click()
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
        .toolbar {
            margin-bottom: 10px;
            button {
                padding: 3px;
                img {
                    width: 16px;
                    height: 16px;
                }
                &:disabled {
                    opacity: 0.5;
                }
            }
        }
        .statusbar {
            margin-top: 10px;
            font-size: 0.6em;
        }
    }
</style>