import { EP1_FILE_ROWS, EP1_FILE_COLS, EP1_CODES, EP1_COLORS, GRAPHIC_MODES } from './constants'
import { getBytes, getChar, isDoubleHeightLine, getLang } from './helper'

export default function (ep1File) {
	if (!ep1File || ep1File.length !== 1008)
		throw new Error('Invalid ep1File')

	var data = []
	var doubleHeight = false
	for (var row = 1; row <= EP1_FILE_ROWS; row++) {
		var rowData = []
		// reset flags for each line
		var graphicsMode = GRAPHIC_MODES.Off
		var holdGraphics = false
		var fgColor = EP1_COLORS[7]; // alpha white
		var bgColor = EP1_COLORS[0]
		var lastGraphic = null
		var blink = false
		var normalHeight = true
		var conceal = false; // TODO: implement conceal

		if (doubleHeight) {
			doubleHeight = false
		} else {
			for (var col = 0; col < EP1_FILE_COLS; col++) {
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
					if (graphicsMode != GRAPHIC_MODES.Off && ep1Code != EP1_CODES.NewBackground && holdGraphics && lastGraphic) {
						rowData[col] = { bgColor, fgColor, lastGraphic, blink, doubleHeight: doubleHeight && !normalHeight, graphicsMode }
					}

					// change foreground color
					if (ep1Code < 8) {
						graphicsMode = GRAPHIC_MODES.Off
						fgColor = EP1_COLORS[ep1Code]
					}
					// change to graphics mode
					if (ep1Code >= 0x10 && ep1Code <= 0x17) {
						if (graphicsMode == GRAPHIC_MODES.Off)
							graphicsMode = GRAPHIC_MODES.Contiguous
						fgColor = EP1_COLORS[ep1Code & 7]
					}
					// set seperated/contiguous graphics mode
					if (ep1Code == EP1_CODES.SeperatedGraphics)
						graphicsMode = GRAPHIC_MODES.Seperated
					else if (ep1Code == EP1_CODES.ContiguousGraphics)
						graphicsMode = GRAPHIC_MODES.Contiguous

					// set blink on/off
					if (ep1Code == EP1_CODES.Blink)
						blink = true
					if (ep1Code == EP1_CODES.Steady)
						blink = false

					// change background color
					if (ep1Code == EP1_CODES.NewBackground || ep1Code == EP1_CODES.BlackBackground) {
						bgColor = ep1Code == EP1_CODES.BlackBackground ? EP1_COLORS[0] : fgColor
						var rowStart = 46 + row * EP1_FILE_COLS
						rowData[col] = { bgColor, fgColor, blink, doubleHeight: isDoubleHeightLine(getBytes(ep1File, row)) }
					}

					// switch to/from double height mode
					if (ep1Code == EP1_CODES.DoubleHeight) {
						doubleHeight = true
						normalHeight = false
					} else if (ep1Code == EP1_CODES.NormalSize) {
						normalHeight = true
					}

					if (!rowData[col]) {
						rowData[col] = { bgColor, fgColor, blink, doubleHeight: doubleHeight && !normalHeight }
					}
				} else {
					if (graphicsMode != GRAPHIC_MODES.Off && !((currentByte & 0x40) > 0 && (currentByte & 0x20) == 0) || currentByte == 0x7F) // special case for 0x7F always use graphics (blob)
					{
						lastGraphic = currentByte
						content = currentByte
					} else {
						var charToOutput = getChar(currentByte, getLang(ep1File))
						content = charToOutput
					}
					rowData[col] = { bgColor, fgColor, content, blink, doubleHeight: doubleHeight && !normalHeight, graphicsMode }
				}
			}
		}
		data[row - 1] = rowData
	}
	return data
}