require('core-js')
import Vue from 'vue'
import Vuex from 'vuex'

import App from './components/App'

Vue.use(Vuex)

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        data: null,
        history: []
    },
    mutations: {
        setData(state, data) {
            if (typeof data === 'string') {
                data = data.split('').map((c, i) => data.charCodeAt(i))
            }
            if(state.data) {
                state.history.unshift(state.data)
            }
            state.data = data
        },
        undo(state) {
            if(state.history.length) {
                if(!state.history.redo) {
                    state.history.redo = []
                }
                state.history.redo.push(state.data)
                state.data = state.history.shift()
            }
        },
        redo(state) {
            if(state.history.redo) {
                state.history.unshift(state.data)
                state.data = state.history.redo.pop()
                if(!state.history.redo.length) {
                    state.history.redo = null
                }
            }
        }
    }
})

document.body.onkeydown = e => {
    if(e.keyCode === 90 && (e.ctrlKey || e.metaKey) && store.state.history.length) {
        store.commit('undo')
    }
}

new Vue({
    el: '#app',
    template: '<App/>',
    store,
    components: { App }
})