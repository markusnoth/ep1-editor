import Vue from 'vue'
import Vuex from 'vuex'

import App from './components/App'
import { loadEp1 } from './ep1Provider'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        data:'asdf'
    },
    mutations: {
        setData(state, data) {
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