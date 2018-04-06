import fs from 'fs'
let fd = {}

/**
 * Get the fd by path in PSD instance.
 * @param {PSD} psd 
 * @returns {(Number|Null)} fd
 */
export function getFd(psd) {
  if (psd.$path) {
    if (fd[psd.$path] === undefined) {
      try {
        fd[psd.$path] = fs.openSync(psd.$path, 'r')
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err.message)
        }
        return null
      }
    }
    return fd[psd.$path]
  }
  return null
}

/**
 * Read data using fd or PSD instance.
 * @param {(Number|PSD)} fdOrPsd 
 * @param {Number} size 
 * @param {Number} offset 
 * @returns {Buffer} buffered data
 */
export function read(fdOrPsd, size, offset) {
  let fdes
  if (typeof fdOrPsd === 'number') {
    fdes = fdOrPsd
  } else {
    fdes = getFd(fdOrPsd)
  }
  if (fdes === null) return Buffer.alloc(0)
  let buffer = Buffer.alloc(size)
  try {
    fs.readSync(fdes, buffer, 0, size, offset)
    return buffer
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.message)
    }
    buffer = null
    return Buffer.alloc(0)
  }
}