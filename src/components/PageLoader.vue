<template>
    <form @submit.prevent="onSubmit">
        <select v-model="channel">
            <option v-for="channel in channels" :value="channel">{{channel.toUpperCase()}}</option>
        </select>
        <input v-model="page"/>
        <button>load</button>
    </form>
</template>

<script>
    import axios from 'axios'

    const channels = ['srf1', 'rts1', 'rsi1']
    export default {
        name: 'PageLoader',
        data: () => ({
            channels,
            channel: channels[0],
            page: 100
        }),
        methods: {
            onSubmit() {
                const url = `http://r4int.teletext.ch/api/live/page?channel=${this.channel}&page=${this.page}`
                return axios.request(url)
                    .then(response => {
                        const data = atob(response.data.subpages[0].data)
                        this.$emit('pageLoaded', data)
                    })
            }
        }
    }
</script>

<style scoped="true">
    input {
        width: 50px;
    }
</style>