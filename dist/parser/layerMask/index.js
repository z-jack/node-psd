import PSDLayerInfo from './layerInfo'
import PSDGlobalLayerMaskInfo from './globalLayer'
import PSDAdditionalLayerInfo from './tagged'
import { hookProp } from '../../hook'
import { read } from '../../reader'
import { defProp } from '../index'

class PSDLayerMaskInfoSection {
  constructor() {
    this.length = 0
    this.$psd = null
    this.layer = new PSDLayerInfo()
    this.globalLayer = new PSDGlobalLayerMaskInfo()
    this.tagged = new PSDAdditionalLayerInfo()
  }
}

export default function parser() {
  let lm = new PSDLayerMaskInfoSection()
  lm.$psd = this
  if (this.header.valid) {
    let hlen = this.header.version == 1 ? 4 : 8
    let buf = read(this, hlen, 34 + this.colorMode.length + this.imgRes.length)
    if (buf.length > 0) {
      let length
      if (hlen == 4) {
        length = buf.readInt32BE()
      } else {
        length = buf.readInt64BE()
      }
      lm.length = length
      if (this.$config.lazy) {
        // hookProp(lm, 'blocks', loadBlock)
      } else {
        // defProp(lm, 'blocks', loadBlock)
      }
    }
  }
  return lm
}