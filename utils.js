import {
  isObject,
  isUnset,
  isSet,
} from 'mytoolkit'

export function getData(arr, index) {
  let item = arr[index]
  return item && isSet(item.value) ? item.value : item
}

export function maybePercentValue(value, target) {
  if (/^\d+(\.\d+)?%$/.test(value)) {
    if (isUnset(target)) {
      target = 1
    }

    return parsePercent(value) * target
  }
  return value
}

export function parsePercent(p) {
  if (!/^\d+(\.\d+)?%$/.test(p)) return p

  return parseFloat(p) / 100
}

export function isInBound(bound, x, y) {
  let bl = bound[0], br = bound[1]
  if (bl[0] - x > 0) return false
  if (br[0] - x < 0) return false
  if (bl[1] - y > 0) return false
  if (br[1] - y < 0) return false

  return true
}

export function deepExtend(source, target = {}) {
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
  if (!d3.transition.prototype.attrs) {
    let attrs = function (name) {
      if (isObject(name)) {
        Object.keys(name).forEach(k => {
          this.attr(k, name[k])
        })
      }
      return this
    }
    d3.transition.prototype.attrs = attrs
  }

  if (!d3.transition.prototype.styles) {
    let styles = function (name) {
      if (isObject(name)) {
        Object.keys(name).forEach(k => {
          this.style(k, name[k])
        })
      }
      return this
    }
    d3.transition.prototype.styles = styles
  }

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
      if (isUnset(name)) {
        return appendProto.call(this, name)
      }
      let [tagName, className] = name.split(/[.#]/)
      let s = appendProto.call(this, tagName)
      if (className) {
        name.includes('#') && s.attr('id', className)
        name.includes('.') && s.classed(className, 'true')
      }
      isObject(attrs) && s.attr(attrs)
      isObject(styles) && s.style(styles)

      return s
    }
    append.lc_extended = true
    d3.selection.prototype.append = append
  }

  if (!d3.selection.prototype.safeSelect) {
    d3.selection.prototype.safeSelect = function (selector) {
      let s = this.select(selector)
      if (s.empty()) {
        s = this.append(selector)
      }
      return s
    }
  }
}