import { assert } from 'chai'
import PSD from '../dist'

describe('init', () => {
  it('should be PSD', () => {
    assert.instanceOf(new PSD(), PSD);
    assert.instanceOf(new PSD('./test/test.psd'), PSD);
    assert.instanceOf(new PSD({ path: './test/test.psd' }), PSD)
  })
  it('should be undefined', () => {
    assert.typeOf(PSD(), 'undefined')
  })
})

describe('parser', () => {
  let psd = new PSD('./test/test.psd')
  let indexed = new PSD('./test/indexed.psd')
  let duotone = new PSD('./test/duotone.psd')
  it('header', () => {
    assert.equal(psd.header.signature, '8BPS')
    assert.equal(psd.header.version, 1)
    assert.equal(psd.header.channels, 4)
    assert.equal(psd.header.height, 400)
    assert.equal(psd.header.width, 400)
    assert.equal(psd.header.depth, 8)
    assert.equal(psd.header.mode, 'RGB')
  })
  it('color mode', () => {
    assert.equal(psd.colorMode.length, 0)
    assert.equal(indexed.colorMode.length, 768)
    assert.equal(duotone.colorMode.length, 524)
  })
})

describe('lazy load', () => {
  it('base test', () => {
    let psd = new PSD('./test/test.psd', { lazy: true })
    assert.typeOf(psd.$header, 'undefined')
    assert.equal(psd.header.signature, '8BPS')
    assert.typeOf(psd.$header, 'object')
  })
})