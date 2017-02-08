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
    import { decodeBase64 } from '../ep1-tools/helper'

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
                        const data = decodeBase64(response.data.subpages[0].data)
                        this.$emit('pageLoaded', data)
                    })
            }
        }
    }
</script>