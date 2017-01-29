export const EP1_FILE_ROWS = 23
export const EP1_FILE_COLS = 40

export const EP1_CODES = {
    AlphaBlack: 0x00,
    AlphaRed: 0x01,
    AlphaGreen: 0x02,
    AlphaYellow: 0x03,
    AlphaBlue: 0x04,
    AlphaMagenta: 0x05,
    AlphaCyan: 0x06,
    AlphaWhite: 0x07,
    Blink: 0x08,
    Steady: 0x09,
    EndBox: 0x0A,
    StartBox: 0x0B,
    NormalSize: 0x0C,
    DoubleHeight: 0x0D,
    DoubleWidth: 0x0E,
    DoubleSize: 0x0F,
    GraphicsBlack: 0x10,
    GraphicsRed: 0x11,
    GraphicsGreen: 0x12,
    GraphicsYellow: 0x13,
    GraphicsBlue: 0x14,
    GraphicsMagenta: 0x15,
    GraphicsCyan: 0x16,
    GraphicsWhite: 0x17,
    StartConceal: 0x18,
    ContiguousGraphics: 0x19,
    SeperatedGraphics: 0x1A,
    Esc: 0x1B,
    BlackBackground: 0x1C,
    NewBackground: 0x1D,
    HoldMosaics: 0x1E,
    ReleaseMosaics: 0x1F,
    Space: 0x20,
    Blob: 0x7F
}

export const GRAPHIC_MODES = {
	Off: 0,
	Contiguous: 1,
	Seperated: 2
}

export const CHAR_TRANSLATIONS = {
	0x23: { 'D': '#', 'F': 'é', 'I': '£', 'E': '£' },
	0x24: { 'D': '$', 'F': 'ï', 'I': '$', 'E': '$' },
	0x40: { 'D': '§', 'F': 'à', 'I': 'é', 'E': '@' },
	0x5B: { 'D': 'Ä', 'F': 'ë', 'I': '§', 'E': '<' },
	0x5C: { 'D': 'Ö', 'F': 'ê', 'I': 'ç', 'E': '½' },
	0x5D: { 'D': 'Ü', 'F': 'ù', 'I': '>', 'E': '>' },
	0x5E: { 'D': '^', 'F': 'î', 'I': '^', 'E': '^' },
	0x5F: { 'D': '_', 'F': '#', 'I': '#', 'E': '#' },
	0x60: { 'D': '°', 'F': 'è', 'I': 'ù', 'E': '_' },
	0x7B: { 'D': 'ä', 'F': 'â', 'I': 'à', 'E': '¼' },
	0x7C: { 'D': 'ö', 'F': 'ô', 'I': 'ò', 'E': '‖' },
	0x7D: { 'D': 'ü', 'F': 'û', 'I': 'è', 'E': '¾' },
	0x7E: { 'D': 'ß', 'F': 'ç', 'I': 'ì', 'E': ':' }
}

export const EP1_COLORS = [
	'black',
	'red',
	'green',
	'yellow',
	'blue',
	'magenta',
	'cyan',
	'white'
]