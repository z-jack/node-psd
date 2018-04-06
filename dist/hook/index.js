import { headerParser, cmParser, irParser, lmParser, imgParser } from '../parser'

/**
 * Hook the specific property
 * @param {Any} psd 
 * @param {String} prop 
 * @param {Function} func 
 */
export function hookProp(psd, prop, func) {
  Object.defineProperty(psd, prop, {
    enumerable: true,
    get() {
      if (psd['$' + prop]) return psd['$' + prop]
      let value = func.call(psd)
      psd['$' + prop] = value
      return value
    }
  })
}

/**
 * Hook for lazy load
 * @param {PSD} psd 
 */
export default function Hook(psd) {
  hookProp(psd, 'header', headerParser)
  hookProp(psd, 'colorMode', cmParser)
  hookProp(psd, 'imgRes', irParser)
  hookProp(psd, 'layerMask', lmParser)
  hookProp(psd, 'imgData', imgParser)
}