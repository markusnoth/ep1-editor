<template>
    <div :class="cssClass">
        <input v-if="isSelected" :value="editContent" @input="onInput" v-select />
        <span v-else v-html="displayContent"></span>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        name: 'EditorItem',
        props: ['value','fgColor','bgColor','isSelected'],
        directives: {
            select(e) {
                Vue.nextTick(() => {
                    e.focus()
                    e.select()
                })
            }
        },
        computed: {
            editContent() {
                return typeof this.value === 'string' ? this.value.replace(' ', '') : null
            },
            displayContent () {
                return this.editContent || '&nbsp;'
            },
            cssClass () {
                return {
                    [this.fgColor]: this.fgColor,
                    [`bg-${this.bgColor}`]: this.bgColor,
                    selected: this.isSelected
                }
            }
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

</style>