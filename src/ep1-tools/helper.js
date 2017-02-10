
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

export function getChar(data, lang) {
    return CHAR_TRANSLATIONS[data] ? CHAR_TRANSLATIONS[data][lang] : String.fromCharCode(data)
}

export function fillArray(length, array = [], filler = EP1_CODES.Space) {
    while(array.length < length) {
        array.push(filler)
    }
    return array
}

export function moveLine(data, row, offset, startIndex = 0) {
    const sourceIndex = 46 + 40 * row + startIndex
    let targetIndex = sourceIndex + 40 * offset
    const length = 40 - startIndex
    if (offset > 0) { // if the content is moved down we have to adjust the target index
        targetIndex -= length
    }
    data.splice(sourceIndex, 0, ...data.splice(targetIndex, length, ...data.splice(sourceIndex, length)))
}

export function insertLineBreak(data, row, col) {
    const fillLength = 40 - col
    let temp = data.splice(46 + 40 * row + col, fillLength, ...fillArray(fillLength))
    for (++row; row < 23; row++) {
        const rowStartIndex = 46 + 40 * row
        // trim temp content
        temp = temp.reduce((target, value) => {
            if (value !== EP1_CODES.Space || target.length && target[target.length - 1] !== EP1_CODES.Space) {
                target.push(value)
            }
            return target
        }, [])
        data.splice(rowStartIndex + 1, 0, ...temp)
        temp = data.splice(rowStartIndex + col + temp.length, temp.length)
    }
}