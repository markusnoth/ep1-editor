const Vue = require('vue')

const app = new Vue({
    el: '#container',
    template: '<message message="Hello World" />',
    components: {
        message: require('./components/message')
    }
})
