import Parser from './parser'
import Hook from './hook'

/**
 * Constructor of PSD Object
 * @param {(String|Object)} path 
 * @param {Object} config 
 */
function PSD(path, config) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof PSD)) {
    console.warn('PSD should be called by `new` keyword.')
    return
  }
  if (typeof path === 'string') {
    this.$path = path
    path = config
  } else {
    this.$path = ""
  }
  if (typeof path === 'object') {
    if (process.env.NODE_ENV !== 'production' && (config === null || config instanceof Array)) {
      console.warn('`config` should be pure object.')
    }
    this.$config = path
    if (!this.$path) {
      this.$path = this.$config.path
    }
  } else {
    this.$config = {}
  }
  if (this.$config.lazy) {
    Hook(this)
  } else if (this.$path) {
    Parser(this)
  }
}

export default PSD