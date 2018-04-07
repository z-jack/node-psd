import PSDColor from '../utils/psdColor'
import { hookProp } from '../hook'
import { read } from '../reader'
import { defProp } from './index'

/**
 * @prop {Number} length
 * - the length of color table.
 * @prop {Array<PSDColor>} colorTable
 * - the color data.
 */
class PSDColorModeData {
  constructor() {
    this.length = 0
    this.$psd = null
    this.colorTable = []
  }
}

function loadTable() {
  let table = []
  let buf = read(this.$psd, this.length, 30)
  if (buf.length > 0) {
    if (this.$psd.header.mode === 'Indexed') {
      for (let i = 0; i < 256; i++) {
        let color = new PSDColor()
        let r = buf.readUInt8(i)
        let g = buf.readUInt8(i + 256)
        let b = buf.readUInt8(i + 256 * 2)
        color.rgb = [r, g, b]
        table.push(color)
      }
    } else if (this.$psd.header.mode === 'Duotone') {
      let tones = buf.readInt8(3)
      for (let i = 0; i < tones; i++) {
        let color = new PSDColor()
        let textLength = buf.readInt8(i * 64 + 44)
        color.description = buf.slice(i * 64 + 45, i * 64 + 45 + textLength).toString('utf8')
        let h = buf.readUInt8(10 * i + 6)
        let s = buf.readUInt8(10 * i + 8)
        let b = buf.readUInt8(10 * i + 10)
        color.hsb = [h, s, b].map(x => x / 255)
        table.push(color)
      }
    }
  }
  return table
}

export default function parser() {
  let cm = new PSDColorModeData()
  cm.$psd = this
  if (this.header.valid) {
    let buf = read(this, 4, 26)
    if (buf.length > 0) {
      let length = buf.readInt32BE()
      cm.length = length
      if (this.$config.lazy) {
        hookProp(cm, 'colorTable', loadTable)
      } else {
        defProp(cm, 'colorTable', loadTable)
      }
    }
  }
  return cm
}