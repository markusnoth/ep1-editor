
import { EP1_CODES, CHAR_TRANSLATIONS } from './constants'

export function getLang(data) {
    return data[45] != 0x20 ? String.fromCharCode(data[45]) : 'D'
}

export function getBytes(data, row, col, length) {
    if (!length && typeof col === 'undefined') {
        length = 40
    }
    var i = 6 + row * 40 + (col || 0)
    return length && length > 1 ? data.slice(i, i + length) : data[i]
}

export function isDoubleHeightLine(rowData) {
    return rowData.reduce((isDoubleHeight, col) => {
        return isDoubleHeight && col == EP1_CODES.DoubleHeight
    }, false)
}

export function ep1ToRgbColor(ep1Code) {
    if (!(ep1Code < 8 || ep1Code >= 0x10 && ep1Code <= 0x17))
        throw new Error("Provided ep1Code is not a colorCode")
    if (ep1Code > 8) {
        ep1Code -= 0x10
    }
    var hex = ((ep1Code & 1) * 0xFF << 16 | (ep1Code & 2) * 0xFF / 2 << 8 | (ep1Code & 4) * 0xFF / 4).toString(16)
    return '#' + Array(7 - hex.length).join('0') + hex
}

export function isBase64(value) {
    return typeof value === 'string' && (/^[a-z0-9\+\/\s]+\={0,2}$/i.test(value) || value.length % 4 > 0)
}

export function decodeBase64(text) {
    text = text.replace(/\s/g, "")
    if (!(/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text)) || text.length % 4 > 0)
        throw new Error("Not a base64-encoded string.")
    //local variables
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", cur, prev = 0, digitNum, i = 0, result = []
    text = text.replace(/=/g, "")
    while (i < text.length) {
        cur = digits.indexOf(text.charAt(i))
        digitNum = i % 4
        switch (digitNum) {
            //case 0: first digit - do nothing, not enough info to work with  
            case 1:
                //second digit
                result.push(prev << 2 | cur >> 4)
                break
            case 2:
                //third digit
                result.push((prev & 0x0f) << 4 | cur >> 2)
                break
            case 3:
                //fourth digit
                result.push((prev & 3) << 6 | cur)
                break
        }
        prev = cur
        i++
    }
    return result
}

export function getChar(data, lang) {
    return CHAR_TRANSLATIONS[data] ? CHAR_TRANSLATIONS[data][lang] : String.fromCharCode(data)
}
