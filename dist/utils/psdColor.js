import { range } from './index'

/**
 * The converter util of color mode
 */
export default class PSDColor {
  constructor() {
    this._r = 0
    this._g = 0
    this._b = 0
    this._a = 0
    this._dirty = true
    this._l = 0
    this._la = 0
    this._lb = 0
    this.description = ''
  }

  get rgb() {
    return [this._r, this._g, this._b]
  }

  set rgb(value) {
    if (value instanceof Array && value.length == 3) {
      value = value.map(x => range(0, 255)(Math.floor(x)))
      this._r = value[0]
      this._g = value[1]
      this._b = value[2]
      this._dirty = true
    }
  }

  get rgba() {
    return [this._r, this._g, this._b, this._a]
  }

  set rgba(value) {
    if (value instanceof Array && value.length == 4) {
      value = value.map(x => range(0, 255)(Math.floor(x)))
      this._r = value[0]
      this._g = value[1]
      this._b = value[2]
      this._a = value[3]
      this._dirty = true
    }
  }

  get cmyk() {
    let tmp = this.rgb.map(x => x / 255)
    let k = 1 - Math.max.apply(null, tmp)
    let mk = 1 - k
    let c = (mk - tmp[0]) / mk
    let m = (mk - tmp[1]) / mk
    let y = (mk - tmp[2]) / mk
    return [c, m, y, k]
  }

  set cmyk(value) {
    if (value instanceof Array && value.length == 4) {
      value = value.map(x => 1 - range(0, 1)(x))
      let r = 255 * value[0] * value[3]
      let g = 255 * value[1] * value[3]
      let b = 255 * value[2] * value[3]
      this.rgb = [r, g, b]
      this._dirty = true
    }
  }

  get hsb() {
    let tmp = this.rgb.map(x => x / 255)
    let b = Math.max.apply(null, tmp)
    let min = Math.min.apply(null, tmp)
    let delta = b - min
    let h, s
    if (delta < 0.000001) {
      h = s = 0
    } else {
      s = delta / b
      let tmp2 = this.rgb.map(x => (((b - x) / 6) + (delta / 2)) / delta)
      if (tmp[0] == b)
        h = tmp2[2] - tmp2[1]
      else if (tmp[1] == b)
        h = 1 / 3 + tmp2[0] - tmp2[2]
      else
        h = 2 / 3 + tmp2[1] - tmp2[0]
      h = h < 0 ? h + 1 : h > 1 ? h - 1 : h
    }
    return [h, s, b]
  }

  set hsb(value) {
    if (value instanceof Array && value.length == 3) {
      value = value.map(x => range(0, 1)(x))
      if (value[1] == 0) {
        this.grayscalef = value[2]
      } else {
        let h = value[0] * 6
        if (h == 6) h = 0
        let i = Math.floor(h)
        let o1 = value[2] * (1 - value[1])
        let o2 = value[2] * (1 - value[1] * (h - i))
        let o3 = value[2] * (1 - value[1] * (1 - (h - i)))
        let r, g, b
        switch (i) {
          case 0:
            r = value[2]
            g = o3
            b = o1
            break
          case 1:
            r = o2
            g = value[2]
            b = o1
            break
          case 2:
            r = o1
            g = value[2]
            b = o3
            break
          case 3:
            r = o1
            g = o2
            b = value[2]
            break
          case 4:
            r = o3
            g = o1
            b = value[2]
            break
          default:
            r = value[2]
            g = o1
            b = o2
        }
        this.rgb = [r, g, b].map(x => x * 255)
      }
    }
  }

  /**
   * the conversion between rgb and lab may be unstable
   */
  get lab() {
    if (this._dirty) {
      let tmp = this.rgb.map(x => Math.pow(x / 255, 2.19921875))
      let x = tmp[0] * 0.57667 + tmp[1] * 0.18556 + tmp[2] * 0.18823
      let y = tmp[0] * 0.29734 + tmp[1] * 0.62736 + tmp[2] * 0.07529
      let z = tmp[0] * 0.02703 + tmp[1] * 0.07069 + tmp[2] * 0.99134
      tmp = [x, y, z].map(x => x > 0.008856 ? Math.pow(x, 1 / 3) : ((7.787 * x) + (16 / 116)))
      let l = (116 * tmp[1]) - 16
      let a = 500 * (tmp[0] - tmp[1])
      let b = 200 * (tmp[1] - tmp[2])
      tmp = [l, a, b].map(x => Math.round(x))
      this._l = tmp[0]
      this._la = tmp[1]
      this._lb = tmp[2]
      this._dirty = false
      return tmp
    } else {
      return [this._l, this._la, this._lb]
    }
  }

  set lab(value) {
    if (value instanceof Array && value.length == 3) {
      value = value.map(x => range(-128, 127)(Math.floor(x)))
      value[0] = range(0, 100)(value[0])
      if (this.lab.toString() == value.toString()) return
      let y = (value[0] + 16) / 116
      let x = value[1] / 500 + y
      let z = y - value[2] / 200
      let tmp = [x, y, z].map(x => Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787)
      let r = tmp[0] * 2.04159 - tmp[1] * 0.56501 - tmp[2] * 0.34473
      let g = -tmp[0] * 0.96924 + tmp[1] * 1.87597 + tmp[2] * 0.03342
      let b = tmp[0] * 0.01344 - tmp[1] * 0.11836 + tmp[2] * 1.34926
      this.rgb = [r, g, b].map(x => Math.pow(x, 1 / 2.19921875) * 255)
      this._dirty = false
    }
  }

  get grayscale() {
    return Math.round(0.3 * this._r + 0.59 * this._g + 0.11 * this._b)
  }

  set grayscale(value) {
    if (typeof value === 'number') {
      value = Math.floor(value)
      this.rgb = Array(3).fill(value)
      this._dirty = true
    }
  }

  get grayscalef() {
    return this.grayscale / 255
  }

  set grayscalef(value) {
    if (typeof value === 'number') {
      this.rgb = Array(3).fill(range(0, 1)(value) * 255)
      this._dirty = true
    }
  }
}