<template>
    <div v-if="teletextPage" class="editor" tabindex="0" @keydown="onKey" v-resized="onResize">
        <div class="toolbar">
            <button v-for="color in EP1_COLORS" @click="insertColorCode(color)" :disabled="!selection" :title="color" :style="{color}">A</button>
        </div>
        <div class="content">
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
    import { parse, moveLine, insertLineBreak, EP1_COLORS, EP1_CODES } from '../ep1-tools'
    import EditorItem from './EditorItem'

    export default {
        name: 'Editor',
        data() {
            return {
                data: this.value,
                selection: null,
                EP1_COLORS
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
            },
            selectionIndex() {
                return this.selection && 46 + this.selection.row * 40 + this.selection.col
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
                const { selection, data } = this
                const keyHandlers = {
                    37: () => { if(selection.col > 0) { selection.col-- } },
                    38: () => { // arrow up
                        if(selection.row > 0) { 
                            if(e.metaKey || e.ctrlKey) { moveLine(data, selection.row, -1, selection.col) }
                            selection.row--
                        }
                    },
                    39: () => { if( selection.col < 39) { selection.col++ } },
                    40: () => { // arrow down
                        if(selection.row < 22) { 
                            if(e.metaKey || e.ctrlKey) { moveLine(data, selection.row, 1, selection.col) }
                            selection.row++ 
                        }
                    },
                    27: () => { this.selection = null }, // esc
                    13: () => { // enter
                        if(selection.row < 22) {
                            if(e.metaKey || e.ctrlKey || e.shiftKey) { insertLineBreak(data, selection.row, selection.col) }
                            selection.row++;
                            selection.col = 1
                        }
                    },
                    8: () => { // backspace
                        if(e.metaKey) {
                            data.splice(this.selectionIndex, 1)
                            data.splice(46 + selection.row * 40 + 39, 0, EP1_CODES.Space)
                        } else {
                            data.splice(this.selectionIndex-1, 1)
                            data.splice(46 + selection.row * 40 + 39, 0, EP1_CODES.Space)
                            selection.col--
                        }
                    }
                }
                if(keyHandlers[e.keyCode]) {
                    e.preventDefault()
                    keyHandlers[e.keyCode]()
                }
            },
            onInput(row, col, value) {
                if(typeof value === 'string') {
                    // TODO: translate to correct char
                    value = value.charCodeAt(0)
                }
                this.data.splice(this.selectionIndex, 1, value)
                this.selection.col++
            },
            onResize(e) {
                const rowSize = e.offsetHeight * 0.8 / 23
                e.style.fontSize = rowSize + 'px'
            },
            insertColorCode(color) {
                if(this.selection) {
                    const code = `Alpha${color[0].toUpperCase()}${color.slice(1)}`
                    this.data.splice(this.selectionIndex, 1, EP1_CODES[code])
                }
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
    .editor {
        display: flex;
        flex-flow: column;
        width: 500px;
        height: 405px;
        resize: both;
        overflow: auto;
        outline: none;
        border: 2px solid #999;
        .toolbar {
            flex: 0 1 auto;
            margin: 0;
            text-align: right;
            button {
                font-weight: bold;
                margin: 5px;
                border: 1px solid #333;
                background-color: #999;
            }
        }
        .content {
            flex: 1 1 auto;
            background-color: #000;
            color: #fff;
            font-weight: bold;
            font-family: courier, monospace;
            position: relative;
            height: 100%;
            overflow: hidden;
            .row {
                position: relative;
                height: percentage(1/23);
                .col {
                    position: relative;
                    height: 100%;
                    overflow: hidden;
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