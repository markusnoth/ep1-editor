import Vue from 'vue'
import Vuex from 'vuex'
import App from './components/App'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        message: 'Hello World!'
    }
})

new Vue({
    el: '#app',
    template: '<App/>',
    store,
    components: { App }
})