<template>
    <Ep1Editor :data="data" />
</template>

<script>
    import Ep1Editor from './Ep1Editor'
    import { mapState } from 'vuex'

    export default {
        computed: mapState(['data']),
        components: { Ep1Editor }
    }
</script>

<style>
    body {
        margin: 50px;
        background-color: #222;
        color: #eee;
        font-family:Verdana, Geneva, Tahoma, sans-serif;
    }
</style>