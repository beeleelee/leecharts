import {
  isObject,
} from 'mytoolkit'

export function isInBound(bound, x, y) {
  let bl = bound[0], br = bound[1]
  if (bl[0] - x > 0) return false
  if (br[0] - x < 0) return false
  if (bl[1] - y > 0) return false
  if (br[1] - y < 0) return false

  return true
}

export function deepExtend(source, target) {
  Object.keys(target).forEach(tk => {
    if (isObject(source[tk]) && isObject(target[tk])) {
      deepExtend(source[tk], target[tk])
    } else {
      source[tk] = target[tk]
    }
  })
  return source
}

export function getBoundingRect(doc) {
  if (doc && doc.getBoundingClientRect) {
    return doc.getBoundingClientRect()
  }
  return { left: 0, top: 0, width: 0, height: 0 }
}

export function d3Augment(d3) {
  if (!d3.selection.prototype.attrs) {
    let attrs = function (name) {
      if (isObject(name)) {
        Object.keys(name).forEach(k => {
          this.attr(k, name[k])
        })
      }
      return this
    }
    d3.selection.prototype.attrs = attrs
  }

  if (!d3.selection.prototype.styles) {
    let styles = function (name) {
      if (isObject(name)) {
        Object.keys(name).forEach(k => {
          this.style(k, name[k])
        })
      }
      return this
    }
    d3.selection.prototype.styles = styles
  }

  // make selection.append can accept [tag][class] synctax , it can also accept an initial attributes, an initial styles
  let appendProto = d3.selection.prototype.append
  if (!appendProto.lc_extended) {
    let append = function (name, attrs, styles) {
      let [tagName, className] = name.split('.')
      let s = appendProto.call(this, tagName)
      className && s.classed(className, 'true')
      isObject(attrs) && s.attr(attrs)
      isObject(styles) && s.style(styles)

      return s
    }
    append.lc_extended = true
    d3.selection.prototype.append = append
  }
}