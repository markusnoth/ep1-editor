<template>
    <div class="container">
        <div>{{ data }}</div>
    </div>
</template>

<script>
export default {
    props: ['data']
}
</script>

<style scoped>
    .container {
        min-width: 600px;
        min-height: 400px;
        border: 1px solid #fff;
    }
</style>