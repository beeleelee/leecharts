import { isFunction } from "mytoolkit"


class emitter {
  constructor() {
    this.listeners = {}
  }
  on(type, func) {
    let listenersByType = this.listeners[type]
    !listenersByType && (this.listeners[type] = listenersByType = [])
    listenersByType.push(func)
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
}

export default emitter
