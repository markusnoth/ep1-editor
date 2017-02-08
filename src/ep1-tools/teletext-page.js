import { EP1_CODES, EP1_COLORS } from './constants'
import { getBytes, getChar, isDoubleHeightLine, getLang } from './helper'

const DEFAULT_COLOR = EP1_COLORS[7] // white
const DEFAULT_BG_COLOR = EP1_COLORS[0] // black

const CONTIGUOUS_GRAPHICS = 'CONTIGUOUS_GRAPHICS'
const SEPERATED_GRAPHICS = 'SEPERATED_GRAPHICS'

export default function (ep1File) {
	if (!ep1File || ep1File.length !== 1008)
		throw new Error('Invalid ep1File')

	var data = []
	var doubleHeight = false
	for (var row = 1; row <= 23; row++) {
		var rowData = []
		// reset flags for each line
		var graphicsMode = false
		var holdGraphics = false
		var fgColor = DEFAULT_COLOR
		var bgColor = DEFAULT_BG_COLOR
		var lastGraphic = false
		var blink = false
		var normalHeight = true
		var conceal = false // TODO: implement conceal

		if (doubleHeight) {
			doubleHeight = false // ignore whole line if the line before was a double height line (and reset flag)
		} else {
			for (var col = 0; col < 40; col++) {
				var currentByte = getBytes(ep1File, row, col)
				var isCode = currentByte < 32
				var content
				// ep1 code handling
				if (isCode) {
					var ep1Code = currentByte

					// set hold/release graphics mode
					if (ep1Code == EP1_CODES.HoldMosaics) {
						holdGraphics = true
					} else if (ep1Code == EP1_CODES.ReleaseMosaics) {
						holdGraphics = false
					}

					// repeat last graphics if hold graphics mode is on (not if new background -> this has priority!)
					if (graphicsMode && ep1Code != EP1_CODES.NewBackground && holdGraphics && lastGraphic) {
						rowData[col] = {
							code: currentByte,
							graphicContent: lastGraphic,
							fgColor,
							bgColor,
							blink: blink && blink,
							doubleHeight: doubleHeight && !normalHeight,
							seperated: graphicsMode === SEPERATED_GRAPHICS
						}
					}

					// change foreground color
					if (ep1Code < 8) {
						graphicsMode = false
						fgColor = EP1_COLORS[ep1Code]
					}
					// change to graphics mode
					if (ep1Code >= 0x10 && ep1Code <= 0x17) {
						if (!graphicsMode)
							graphicsMode = CONTIGUOUS_GRAPHICS
						fgColor = EP1_COLORS[ep1Code & 7]
					}
					// set seperated/contiguous graphics mode
					if (ep1Code == EP1_CODES.SeperatedGraphics)
						graphicsMode = SEPERATED_GRAPHICS
					else if (ep1Code == EP1_CODES.ContiguousGraphics)
						graphicsMode = CONTIGUOUS_GRAPHICS

					// set blink on/off
					if (ep1Code == EP1_CODES.Blink)
						blink = true
					if (ep1Code == EP1_CODES.Steady)
						blink = false

					// change background color
					if (ep1Code == EP1_CODES.NewBackground || ep1Code == EP1_CODES.BlackBackground) {
						bgColor = ep1Code == EP1_CODES.BlackBackground ? DEFAULT_BG_COLOR : fgColor
						rowData[col] = {
							code: currentByte,
							bgColor,
							fgColor,
							blink,
							doubleHeight: isDoubleHeightLine(getBytes(ep1File, row))
						}
					}

					// switch to/from double height mode
					if (ep1Code == EP1_CODES.DoubleHeight) {
						doubleHeight = true
						normalHeight = false
					} else if (ep1Code == EP1_CODES.NormalSize) {
						normalHeight = true
					}

					if (!rowData[col]) {
						rowData[col] = {
							code: currentByte,
							bgColor,
							fgColor,
							blink,
							doubleHeight: doubleHeight && !normalHeight
						}
					}
				} else {
					if (graphicsMode && !((currentByte & 0x40) > 0 && (currentByte & 0x20) == 0) || currentByte == 0x7F) // special case for 0x7F always use graphics (blob)
					{
						lastGraphic = currentByte
						content = currentByte
					} else {
						var charToOutput = getChar(currentByte, getLang(ep1File))
						content = charToOutput
					}
					rowData[col] = {
						code: currentByte,
						content,
						bgColor,
						fgColor,
						blink,
						doubleHeight: doubleHeight && !normalHeight,
						graphicsMode
					}
				}
			}
		}
		data[row - 1] = rowData
	}
	return data
}