<template>
    <div :class="cssClass">
        <input v-if="isSelected" :value="textContent" @input="onInput" v-select />
        <span v-else-if="isCode && displayCode" class="code" :title="codeName">{{ codeShortName }}</span>
        <span v-else-if="textContent">{{textContent}}</span>
        <div v-else-if="graphicContent" class="graphic" :class="{ separated: seperatedGraphics }">
            <div class="block" v-for="block in graphicContent" :style="block">&nbsp;</div>&nbsp;
        </div>
        <span v-else>&nbsp;</span>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { EP1_CODES } from '../ep1-tools/constants'
    
    export default {
        name: 'EditorItem',
        props: ['value','code','fgColor','bgColor','isSelected','displayCode','seperatedGraphics'],
        directives: {
            select(e) {
                Vue.nextTick(() => {
                    e.focus()
                    e.select()
                })
            }
        },
        computed: {
            textContent() { return typeof this.value === 'string' ? this.value.replace(' ', '') : null },
            graphicContent() { 
                if(typeof this.value !== 'number') return null
                let bits = (this.value >> 6 & 1) << 5 | this.value & 0x1f, blocks = [], i, bit, block
                for (i = 0; i < 6; i++) {
                    bit = bits >> i & 1
                    if (bit) {
                        blocks.push({
                            left: i % 2 === 1 && '50%',
                            top: i > 1 && (Math.floor(i / 2) * 100 / 3) + '%'
                        })
                    }
                }
                return blocks
            },
            cssClass() {
                return {
                    [this.fgColor]: this.fgColor,
                    [`bg-${this.bgColor}`]: this.bgColor,
                    selected: this.isSelected
                }
            },
            isCode() { return this.code < 32 },
            codeName() { return Object.keys(EP1_CODES).filter(key => EP1_CODES[key] === this.code)[0] },
            codeShortName() { return this.codeName && this.codeName.replace(/[a-z]/g,'') }
        },
        methods: {
            onInput(e) {
                this.$emit('input', e.target.value)
                e.target.select()
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

.col {
    div {
        height: 100%;
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
        .code {
            background-color: #ccc;
            color: #000;
            font-size: 0.5em;
            vertical-align: middle;
        }
        .graphic {
            height: 100%;
            .block {
                position: absolute;
                width: 50%;
                height: percentage(1/3);
            }
            &.separated .block {
                width: 40%;
                height: 25%;
                margin: 5%;
            }
        }
    }
}

.black { 
    color: $black;
    .graphic .block { background-color: $black; }
}
.red {
    color: $red;
    .graphic .block { background-color: $red; }
}
.green { 
    color: $green;
    .graphic .block { background-color: $green; }
}
.yellow { 
    color: $yellow;
    .graphic .block { background-color: $yellow; }
}
.blue { 
    color: $blue;
    .graphic .block { background-color: $blue; }
}
.magenta { 
    color: $magenta;
    .graphic .block { background-color: $magenta; }
}
.cyan { 
    color: $cyan;
    .graphic .block { background-color: $cyan; }
}
.white { 
    color: $white;
    .graphic .block { background-color: $white; }
}

.bg-red { background-color: $red }
.bg-green { background-color: $green }
.bg-yellow { background-color: $yellow }
.bg-blue { background-color: $blue }
.bg-magenta { background-color: $magenta }
.bg-cyan { background-color: $cyan }
.bg-white { background-color: $white }
</style>