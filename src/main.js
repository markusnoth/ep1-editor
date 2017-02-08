require('core-js')
import Vue from 'vue'
import Vuex from 'vuex'

import App from './components/App'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        data: null
    },
    mutations: {
        setData(state, data) {
            if (typeof data === 'string') {
                data = data.split('').map((c, i) => data.charCodeAt(i))
            }
            state.data = data
        }
    }
})

new Vue({
    el: '#app',
    template: '<App/>',
    store,
    components: { App }
})