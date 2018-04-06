import headerParser from './header'
import cmParser from './colorMode'
import irParser from './imageRes'
import lmParser from './layerMask'
import imgParser from './imageData'

export { headerParser, cmParser, irParser, lmParser, imgParser }

/**
 * Create the read-only property
 * @param {Any} psd 
 * @param {String} prop 
 * @param {Function} func 
 */
export function defProp(psd, prop, func) {
  Object.defineProperty(psd, prop, {
    enumerable: true,
    value: func.call(psd)
  })
}

/**
 * Parse the document and bind to properties
 * @param {PSD} psd 
 */
export default function Parser(psd) {
  defProp(psd, 'header', headerParser)
  defProp(psd, 'colorMode', cmParser)
  defProp(psd, 'imgRes', irParser)
  defProp(psd, 'layerMask', lmParser)
  defProp(psd, 'imgData', imgParser)
}