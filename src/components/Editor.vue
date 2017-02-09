<template>
    <div v-if="teletextPage" class="ep1-editor" tabindex="0" @keydown="onKey" v-resized="onResize">
        <div class="editor-content">
            <div class="row" v-for="(row, rowIdx) in teletextPage">
                <div class="col" v-for="(col, colIdx) in row" @click="select(rowIdx, colIdx)">
                    <EditorItem v-model="col.content" :code="col.code"
                                :fgColor="col.fgColor" :bgColor="col.bgColor" :isSelected="isSelected(rowIdx, colIdx)" :displayCode="displayCodes"
                                @input="value => onInput(rowIdx, colIdx, value)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import elementResizeEvent from 'element-resize-event'
    import { parse, moveLine } from '../ep1-tools'
    import EditorItem from './EditorItem'

    export default {
        name: 'Editor',
        data() {
            return {
                data: this.value,
                selection: null
            }
        },
        props: ['value','displayCodes'],
        components: {
            EditorItem
        },
        computed: {
            teletextPage() {
                if(this.data) {
                    try {
                        return parse(this.value)
                    } catch (err) {
                        console.error(err.message || err)
                    }
                }
                return null
            }
        },
        directives: {
            resized(e, binding) {
                elementResizeEvent(e, () => binding.value(e))
            }
        },
        methods: {
            isSelected(row, col) {
                return this.selection && this.selection.row == row && this.selection.col == col
            },
            select (row, col) {
                this.selection = { row, col }
                this.$emit('selectionChanged', this.selection)
            },
            onKey (e) {
                const { selection } = this
                const keyHandlers = {
                    37: () => { if(selection.col > 0) { this.selection.col-- } },
                    38: () => { // arrow up
                        if(selection.row > 0) { 
                            if(e.metaKey || e.ctrlKey) { moveLine(this.data, selection.row, -1, selection.col) }
                            this.selection.row--
                        }
                    },
                    39: () => { if( selection.col < 39) { this.selection.col++ } },
                    40: () => { 
                        if( selection.row < 22) { 
                            if(e.metaKey || e.ctrlKey) { moveLine(this.data, selection.row, 1, selection.col) }
                            this.selection.row++ 
                        }
                    }
                }
                if(keyHandlers[e.keyCode]) {
                    e.preventDefault()
                    keyHandlers[e.keyCode]()
                }
            },
            onInput(row, col, value) {
                const index = 46 + row * 40 + col
                if(typeof value === 'string') {
                    // TODO: translate to correct char
                    value = value.charCodeAt(0)
                }
                this.data.splice(index, 1, value)
                this.selection.col++
            },
            onResize(e) {
                const rowSize = e.offsetHeight * 0.8 / 23
                e.style.fontSize = rowSize + 'px'
            }
        },
        watch: {
            value(value) {
                this.data = value
            },
            data(data) {
                this.$emit('input', data)
            }
        }
    }
</script>

<style lang="sass">
    .ep1-editor {
        width: 500px;
        height: 405px;
        resize: both;
        overflow: auto;
        outline: none;
        border: 2px solid #999;
        background-color: #000;
        color: #fff;
        font-weight: bold;
        font-family: courier, monospace;
        .editor-content {
            position: relative;
            height: 100%;
            .row {
                position: relative;
                height: percentage(1/23);
                .col {
                    position: relative;
                    height: 100%;
                    width: percentage(1/40);
                    box-sizing: border-box;
                    display: inline-block;
                    text-align: center;
                    cursor: text;
                    &:hover {
                        filter: invert(10%);
                    }
                    div.selected {
                        filter: invert(20%);
                    }
                }
            }
        }
    }
</style>