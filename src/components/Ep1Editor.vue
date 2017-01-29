<template>
    <div class="container">
        <div v-if="teletextPage">
            <div v-for="row in teletextPage">
                <div class="row">
                    <div v-for="col in row">
                        <span v-if="isTextContent(col)">{{ col.content }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { GRAPHIC_MODES } from '../ep1-tools/constants'
    import teletextPage from '../ep1-tools/teletext-page'

    export default {
        props: ['data'],
        computed: {
            teletextPage() {
                try {
                    return teletextPage(this.data)
                } catch (err) {
                    console.error(err)
                    return null
                }
            }
        },
        methods: {
            isTextContent: (data) => data.graphicsMode === GRAPHIC_MODES.Off
        }
    }
</script>

<style scoped>
    .container {
        min-width: 600px;
        min-height: 400px;
        border: 1px solid #fff;
        color: #fff;
        font-family: Courier New, Courier, monospace;
        font-weight: bold;
        font-size: 0.9em;
    }
    .row {
        height: 4%;
    }
    .row div {
        display: inline-block;
        width: 2.5%;
    }
</style>