<template>
    <div :class="cssClass">
        <input v-if="isSelected" :value="content" @input="onInput" v-select />
        <span v-else-if="isCode && displayCode" class="code" :title="codeName">{{ codeShortName }}</span>
        <span v-else-if="content">{{content}}</span>
        <span v-else>&nbsp;</span>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { EP1_CODES } from '../ep1-tools/constants'

    export default {
        name: 'EditorItem',
        props: ['value','code','fgColor','bgColor','isSelected','displayCode'],
        directives: {
            select(e) {
                Vue.nextTick(() => {
                    e.focus()
                    e.select()
                })
            }
        },
        computed: {
            content() { return this.value && typeof this.value === 'string' ? this.value.replace(' ', '') : null },
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
    .code {
        background-color: #ccc;
        color: #000;
        font-size: 0.5em;
    }
</style>