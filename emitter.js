import {
  isFunction,
  isUnset,
} from "mytoolkit"


class emitter {
  constructor() {
    this.listeners = {}
  }
  on(type, func) {
    let listenersByType = this.listeners[type]
    !listenersByType && (this.listeners[type] = listenersByType = [])
    // find previous func with same id 
    if (!listenersByType.find(l => l === func)) {
      listenersByType.push(func)
    }
  }
  off(type, func) {
    let listenersByType = this.listeners[type]
    if (listenersByType && isFunction(func)) {
      listenersByType = listenersByType.filter(l => l !== func)
    }
  }
  emit(type, ...arg) {
    let listenersByType = this.listeners[type]
    if (listenersByType) {
      listenersByType.forEach(l => {
        l(...arg)
      })
    }
  }
  clear(type) {
    if (isUnset(type)) {
      this.listeners = {}
      return
    }
    let listenersByType = this.listeners[type]
    if (listenersByType && listenersByType.length) {
      this.listeners[type] = []
    }
  }
}

export default emitter
