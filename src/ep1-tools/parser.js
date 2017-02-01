import { EP1_CODES, EP1_COLORS, GRAPHIC_MODES } from './constants'
import { getChar } from './constants'

export default class {
    constructor(handler) {
        this.handler = handler
    }

    parse(ep1File, showBlink) {
        var doubleHeight = false
        for (var row = 1; row < 23; row++) {
            {
                // reset flags for each line
                var graphicsMode = GRAPHIC_MODES.Off
                var holdGraphics = false
                var fgColor = 0x07; // alpha white
                var lastGraphic = null
                var blink = false
                var normalHeight = true
                var conceal = false; // TODO: implement conceal

                if (doubleHeight) {
                    doubleHeight = false
                } else {
                    for (var col = 0; col <= 40; col++) {
                        {
                            var currentByte = ep1File.getBytes(row, col)
                            var isCode = currentByte < 32

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
                                if (graphicsMode != GRAPHIC_MODES.Off && ep1Code != EP1_CODES.NewBackground && holdGraphics && (!blink || showBlink) && lastGraphic) {
                                    this.handler.outputGraphic(row - 1, col, lastGraphic, fgColor, graphicsMode, doubleHeight && !normalHeight)
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
                                    fgColor = EP1_COLORS[ep1Code]
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
                                    var bgColor = ep1Code == EP1_CODES.BlackBackground ? EP1_COLORS[0] : fgColor
                                    var rowStart = 46 + row * 40
                                    var isDoubleHeightLine = false
                                    this.handler.changeBackground(row - 1, col, bgColor, ep1File.isDoubleHeightLine(row))
                                }

                                // switch to/from double height mode
                                if (ep1Code == EP1_CODES.DoubleHeight) {
                                    doubleHeight = true
                                    normalHeight = false
                                } else if (ep1Code == EP1_CODES.NormalSize) {
                                    normalHeight = true
                                }
                            } else if (showBlink || !blink) {
                                if (graphicsMode != GRAPHIC_MODES.Off && !((currentByte & 0x40) > 0 && (currentByte & 0x20) == 0) || currentByte == 0x7F) // special case for 0x7F always use graphics (blob)
                                {
                                    this.handler.outputGraphic(row - 1, col, currentByte, fgColor, graphicsMode, doubleHeight)
                                    lastGraphic = currentByte
                                } else {
                                    var charToOutput = getChar(currentByte, ep1File.getLang())
                                    this.handler.outputText(row - 1, col, charToOutput, fgColor, doubleHeight && !normalHeight)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}