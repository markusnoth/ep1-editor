import Vue from 'vue'
import Vuex from 'vuex'

import App from './components/App'
import { loadEp1 } from './ep1-provider'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        data: []
    },
    mutations: {
        setData(state, data) {
            if (typeof data === 'string') {
                data = data.split('').map((c, i) => data.charCodeAt(i))
            }
            state.data = data
        }
    },
    actions: {
        loadData(context) {
            return loadEp1().then(response => {
                context.commit('setData', response.data)
            })
        }
    }
})

new Vue({
    el: '#app',
    template: '<App/>',
    store,
    components: { App },
    mounted() {
        store.dispatch('loadData')
    }
})