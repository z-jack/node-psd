import { read } from '../reader'

/**
 * @prop {String} signature
 * - always equal to '8BPS'
 * @prop {Number} version
 * - 1 for PSD, 2 for PSB
 * @prop {Number} reserved
 * - must be 0
 * @prop {Number} channels
 * - the number of channels
 * @prop {Number} height
 * - the height of the image in pixels
 * @prop {Number} width
 * - the width of the image in pixels
 * @prop {Number} depth
 * - the number of bits per channel.
 * - suppored values are 1, 8, 16, 32.
 * @prop {Number} _mode
 * - the color mode of the file.
 * - 0: Bitmap, 1: Grayscale, 2: Indexed, 3: RGB, 4: CMYK, 7: Multichannel, 8: Duotone, 9: Lab
 */
class PSDHeader {
  constructor() {
    this.signature = ''
    this.version = 0
    this.reserved = 0
    this.channels = 0
    this.height = 0
    this.width = 0
    this.depth = 0
    this._mode = 0
  }

  /**
   * @returns {String} the string description of color mode.
   */
  get mode() {
    switch (this._mode) {
      case 0:
        return 'Bitmap'
      case 1:
        return 'Grayscale'
      case 2:
        return 'Indexed'
      case 3:
        return 'RGB'
      case 4:
        return 'CMYK'
      case 7:
        return 'Multichannel'
      case 8:
        return 'Duotone'
      case 9:
        return 'Lab'
      default:
        return `Unknown<${this._mode}>`
    }
  }

  /**
   * @returns {Boolean} the file header is valid or not
   */
  get valid() {
    return this.signature === '8BPS'
  }
}

export default function parser() {
  let buffer = read(this, 26, 0)
  let header = new PSDHeader()
  let signature = buffer.slice(0, 4).toString('ascii')
  if (signature !== '8BPS') {
    return header
  }
  header.signature = signature
  header.version = buffer.readInt16BE(4)
  header.channels = buffer.readInt16BE(12)
  header.height = buffer.readInt32BE(14)
  header.width = buffer.readInt32BE(18)
  header.depth = buffer.readInt16BE(22)
  header._mode = buffer.readInt16BE(24)
  return header
}