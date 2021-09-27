import Dep from './Dep.js'
export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this
    this.__old = vm[key] // 存下了初始值，触发getter
    Dep.target = null
  }
  update() {
    let newValue = this.vm[this.key]
    if (this.__old === newValue || __isNaN(newValue, this.__old)) return;
    this.cb(newValue)
  }

}