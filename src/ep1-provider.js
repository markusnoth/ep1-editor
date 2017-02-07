import axios from 'axios'

import { decodeBase64 } from './ep1-tools/helper'

export function loadEp1(channel = 'SRF1', page = 107) {
    const url = `http://r4int.teletext.ch/api/live/page?channel=${channel}&page=${page}`
    return axios.request(url)
        .then(response => {
            return decodeBase64(response.data.subpages[0].data)
        })
}