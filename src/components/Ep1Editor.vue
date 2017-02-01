<template>
    <div v-if="teletextPage" class="ep1-editor">
        <div class="row" v-for="(row, rowIdx) in teletextPage">
            <div v-for="(col, colIdx) in row" @click="select(rowIdx, colIdx)" class="col" :class="getClass(col, rowIdx, colIdx)">
                <span v-if="getContent(col)" v-html="getContent(col)"></span>
            </div>
        </div>
        <div style="margin-top: 10px; text-align: right">{{ selection }}</div>
    </div>
</template>

<script>
    import { GRAPHIC_MODES } from '../ep1-tools/constants'
    import teletextPage from '../ep1-tools/teletext-page'

    export default {
        data() {
            return {
                selection: null
            }
        },
        props: ['data'],
        computed: {
            teletextPage() {
                if(this.data && this.data.length) {
                    try {
                        return teletextPage(this.data)
                    } catch (err) {
                        console.error(err.message || err)
                    }
                }
                return null
            }
        },
        methods: {
            getContent: (data) => (data.graphicsMode === GRAPHIC_MODES.Off) ? data.content.replace(' ', '&nbsp;') : '&nbsp;',
            getClass (data, rowIdx, colIdx) {
                return {
                    [data.fgColor]: data.fgColor,
                    [`bg-${data.bgColor}`]: data.bgColor,
                    selected: this.selection && this.selection.row === rowIdx && this.selection.col === colIdx
                }
            },
            select (row, col) {
                this.selection = { row, col }
            },
            onKeyup () {
                console.log('keyup', arguments)
            }
        }
    }
</script>

<style lang="sass">
    $black: #000;
    $red: #f00;
    $green: #0c0;
    $yellow: #ff0;
    $blue: #00f;
    $magenta: #f0f;
    $cyan: #0ff;
    $white: #fff;

    .black { color: $black }
    .red { color: $red }
    .green { color: $green }
    .yellow { color: $yellow }
    .blue { color: $blue }
    .magenta { color: $magenta }
    .cyan { color: $cyan }
    .white { color: $white }

    .bg-red { background-color: $red }
    .bg-green { background-color: $green }
    .bg-yellow { background-color: $yellow }
    .bg-blue { background-color: $blue }
    .bg-magenta { background-color: $magenta }
    .bg-cyan { background-color: $cyan }
    .bg-white { background-color: $white }

    .ep1-editor {
        min-width: 600px;
        min-height: 400px;
        color: #fff;
        font-family: Courier New, Courier, monospace;
        font-weight: bold;
        font-size: 0.9em;
    }
    .row {
        height: percentage(1/23);
        .col {
            box-sizing: border-box;
            display: inline-block;
            text-align: center;
            width: percentage(1/40);
            border: 1px solid transparent;
            cursor: default;
            &:hover {
                filter: invert(20%);
            }
            &.selected {
                filter: invert(100%);
            }
        }
    }
</style>