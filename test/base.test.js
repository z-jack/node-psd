const should = require('chai').should
const assert = require('chai').assert
const PSD = require('../dist')
should()

describe('init', () => {
    it('should be PSD', () => {
        (new PSD()).should.be.instanceOf(PSD)
    })
    it('should be undefined', () => {
        assert.typeOf(PSD(), 'undefined')
    })
})