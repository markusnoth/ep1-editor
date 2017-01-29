import axios from 'axios'

export function loadEp1() {
    return axios.request('/ep1/SRF1_100_00.EP1')
}