import { should, assert } from 'chai'
import PSD from '../dist'
should()

describe('init', () => {
  it('should be PSD', () => {
    (new PSD()).should.be.instanceOf(PSD);
    (new PSD('./test/test.psd')).should.be.instanceOf(PSD);
    (new PSD({ path: './test/test.psd' })).should.be.instanceOf(PSD)
  })
  it('should be undefined', () => {
    assert.typeOf(PSD(), 'undefined')
  })
})

describe('parser', () => {
  it('header part', () => {
    let psd = new PSD('./test/test.psd')
    assert.equal(psd.header.signature, '8BPS')
    assert.equal(psd.header.version, 1)
    assert.equal(psd.header.channels, 4)
    assert.equal(psd.header.height, 400)
    assert.equal(psd.header.width, 400)
    assert.equal(psd.header.depth, 8)
    assert.equal(psd.header.mode(), 'RGB')
  })
})

describe('lazy load', () => {
  it('header part', () => {
    let psd = new PSD('./test/test.psd', { lazy: true })
    assert.typeOf(psd.$header, 'undefined')
    assert.equal(psd.header.signature, '8BPS')
    assert.equal(psd.header.version, 1)
    assert.equal(psd.header.channels, 4)
    assert.equal(psd.header.height, 400)
    assert.equal(psd.header.width, 400)
    assert.equal(psd.header.depth, 8)
    assert.equal(psd.header.mode(), 'RGB')
    assert.typeOf(psd.$header, 'object')
  })
})