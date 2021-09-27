import Dep from './Dep.js'

export default class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
  }

  defineReactive(obj, key, value) {
    let that = this
    this.walk(value) // 处理value为对象的情况
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        Dep.target && dep.add(Dep.target)
        return value
      },
      set(newValue) {
        if (value === newValue || __isNaN(value, newValue)) return;
        value = newValue
        that.walk(newValue)
        dep.notify()
      }
    })
  }
}