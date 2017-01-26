const Vue = require('vue')

const app = new Vue({
    el: '#app',
    template: '<message message="Hello World" />',
    components: {
        message: require('./components/message')
    }
})
