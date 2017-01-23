const Vue = require('vue')

const messageComponent = Vue.component('my-message', {
    props: ['message'],
    template: '<div>{{ message }}</div>'
})
const app = new Vue({
    el: '#container',
    template: '<my-message message="Hello World" />'
})
