import { EP1_FILE_ROWS, EP1_FILE_COLS, GRAPHIC_MODES } from './constants'
import { ep1ToRgbColor } from './helper'

export default class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas
        this.rowHeight = canvas.height / EP1_FILE_ROWS
        this.colWidth = canvas.width / EP1_FILE_COLS

        this.context = canvas.getContext('2d')
        this.context.font = this.rowHeight + 'px sans-serif'
        this.context.textAlign = "center"
        this.context.textBaseline = 'top'
    }

    outputGraphic(row, col, code, fgColor, graphicsMode, doubleHeight) {
        this.context.save()
        this.context.fillStyle = ep1ToRgbColor(fgColor)
        var border = graphicsMode == GRAPHIC_MODES.Seperated ? 1 : 0
        this.context.setTransform(1, 0, 0, doubleHeight ? 2 : 1, col * this.colWidth, row * this.rowHeight)
        var blockWidth = this.colWidth / 2 - border * 2, blockHeight = this.rowHeight / 3 - border * 2

        if ((code & 1) > 0)
            this.context.fillRect(border, border, Math.round(blockWidth), Math.round(blockHeight))
        if ((code & 2) > 0)
            this.context.fillRect(border + this.colWidth / 2, border, blockWidth, Math.ceil(blockHeight))
        if ((code & 4) > 0)
            this.context.fillRect(border, border + this.rowHeight / 3, Math.ceil(blockWidth), Math.ceil(blockHeight))
        if ((code & 8) > 0)
            this.context.fillRect(border + this.colWidth / 2, border + this.rowHeight / 3, blockWidth, Math.ceil(blockHeight))
        if ((code & 16) > 0)
            this.context.fillRect(border, Math.round(border + this.rowHeight * 2 / 3), Math.round(blockWidth), Math.round(blockHeight))
        if ((code & 64) > 0)
            this.context.fillRect(Math.round(border + this.colWidth / 2), Math.round(border + this.rowHeight * 2 / 3), Math.round(blockWidth), Math.round(blockHeight))
        this.context.restore()
    }

    changeBackground(row, col, bgColor, doubleHeight) {
        this.context.save()
        this.context.setTransform(1, 0, 0, doubleHeight ? 2 : 1, col * this.colWidth, row * this.rowHeight)
        this.context.fillStyle = ep1ToRgbColor(bgColor)
        this.context.fillRect(0, 0, this.canvas.width, this.rowHeight)
        this.context.restore()
    }

    outputText(row, col, charToOutput, fgColor, doubleHeight) {
        this.context.save()
        this.context.setTransform(1, 0, 0, doubleHeight ? 2 : 1, col * this.colWidth, row * this.rowHeight)
        this.context.fillStyle = ep1ToRgbColor(fgColor)
        this.context.fillText(charToOutput, this.colWidth / 2, 0, this.colWidth)
        this.context.restore()
    }
} 