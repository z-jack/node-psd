import { hookProp } from '../hook'
import { read } from '../reader'
import { defProp } from './index'

/**
 * @prop {Number} length
 * - the length of blocks.
 * @prop {Array<PSDImageResourceBlock>} blocks
 * - contain several ir blocks.
 */
class PSDImageResourcesSection {
  constructor() {
    this.length = 0
    this.$psd = null
    this.blocks = []
  }
}

/**
 * @prop {String} signature
 * - always equals '8BIM'.
 * @prop {Number} uid
 * - resource type unique id.
 * @prop {String} name
 * - ir name.
 * @prop {Number} size
 * - following data size.
 * @prop {Buffer} data
 * - ir raw data.
 */
class PSDImageResourceBlock {
  constructor() {
    this.signature = ''
    this.uid = 0
    this.name = ''
    this.size = 0
    this.data = null
  }

  get formatData() {
    return this.data
  }

  get valid() {
    return this.signature == '8BIM'
  }
}

function loadBlock() {
  let blocks = []
  let buf = read(this.$psd, this.length, 34 + this.$psd.colorMode.length)
  let ptr = 0
  while (ptr < buf.length) {
    let blk = new PSDImageResourceBlock()
    let signature = buf.slice(ptr, ptr + 4).toString('ascii')
    if (signature == '8BIM') {
      blk.signature = signature
      ptr += 4
      blk.uid = buf.readUInt16BE(ptr)
      ptr += 2
      let startPtr = ptr
      while (ptr < buf.length) {
        if (buf.readUInt8(ptr++) == 0) {
          ptr += ptr % 2
          break
        }
      }
      blk.name = buf.slice(startPtr, ptr).toString('utf8').replace(/\0/g, '')
      blk.size = buf.readUInt32BE(ptr)
      ptr += 4
      blk.data = buf.slice(ptr, ptr + blk.size)
      ptr += blk.size
      ptr += ptr % 2
      blocks.push(blk)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('unfinished parsing in ir blocks.')
      }
      break
    }
  }
  return blocks
}

export default function parser() {
  let ir = new PSDImageResourcesSection()
  ir.$psd = this
  if (this.header.valid) {
    let buf = read(this, 4, 30 + this.colorMode.length)
    if (buf.length > 0) {
      let length = buf.readInt32BE()
      ir.length = length
      if (this.$config.lazy) {
        hookProp(ir, 'blocks', loadBlock)
      } else {
        defProp(ir, 'blocks', loadBlock)
      }
    }
  }
  return ir
}