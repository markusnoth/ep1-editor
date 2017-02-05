<template>
    <div v-if="teletextPage" class="ep1-editor" tabindex="0" @focus="onFocus" @blur="onBlur" @keyup="onKeyup">
        <div class="row" v-for="(row, rowIdx) in teletextPage">
            <div class="col" v-for="(col, colIdx) in row" @click="select(rowIdx, colIdx)">
                <EditorItem v-model="col.content" :fgColor="col.fgColor" :bgColor="col.bgColor" :isSelected="isSelected(rowIdx, colIdx)" @input="value => onInput(rowIdx, colIdx, value)" />
            </div>
        </div>
        <div style="margin-top: 10px; text-align: right">{{ selection }}</div>
    </div>
</template>

<script>
    import teletextPage from '../ep1-tools/teletext-page'
    import EditorItem from './EditorItem'

    export default {
        name: 'Editor',
        data() {
            return {
                selection: null
            }
        },
        props: ['data'],
        components: {
            EditorItem
        },
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
            isSelected(row, col) {
                return this.selection && this.selection.row == row && this.selection.col == col
            },
            select (row, col) {
                this.selection = { row, col }
            },
            onKeyup (e) {
                const { selection } = this
                if(e.keyCode === 37 && selection.col > 0) { selection.col-- }
                if(e.keyCode === 38 && selection.row > 0) { this.selection.row-- }
                if(e.keyCode === 39 && selection.col < 39) { this.selection.col++ }
                if(e.keyCode === 40 && selection.row < 22) { this.selection.row++ }
            },
            onFocus() {
                this.selection = this.lastSelection
            },
            onBlur() {
                this.lastSelection = this.selection
                this.selection = null
            },
            onInput(row, col, value) {
                console.log(row, col, value)
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
        font-weight: bold;
        font-size: 0.9em;
        outline: none;
        .row {
            height: percentage(1/23);
            .col {
                box-sizing: border-box;
                display: inline-block;
                text-align: center;
                width: percentage(1/40);
                cursor: default;
                &:hover {
                    filter: invert(10%);
                }
                div.selected {
                    filter: invert(20%);
                    input {
                        width: 100%;
                        padding: 0;
                        background-color: transparent;
                        border: none;
                        outline: none;
                        color: inherit;
                        text-align: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        font-size: inherit;
                    }
                }
            }
        }
    }
</style>