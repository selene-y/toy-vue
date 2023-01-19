import Dep from './Dep.js'

let watcherId = 0
let watcherQueue = []
let targetStack = [] // 存起Dep.target 防止两个watcher同时创建时被覆盖

export default class Watcher {
  constructor(vm, exp, cb, options = {}) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = null
    this.id = ++watcherId
    this.dirty = true
    this.lazy = options.lazy
    this.deps = new Set()

    if (!this.lazy) {
      this.get()
    }
  }

  addDep(dep) {
    this.deps.add(dep)
    dep.addSub(this)
  }

  get() {
    targetStack.push(this)
    Dep.target = this
    if (typeof this.exp === 'function') {
      this.value = this.exp.call(this.vm) // this.count + 1
    } else {
      this.value = this.vm[this.exp] // 存下了初始值，触发getter
    }
    if (targetStack.length > 0) {
      Dep.target = targetStack.pop()
    } else {
      Dep.target = null
    }
  }

  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      this.run()
    }
  }

  run () {
    if (watcherQueue.indexOf(this.id) !== -1) {
      return
    }
    watcherQueue.push(this.id)
    // if (this.__old === newValue || __isNaN(newValue, this.__old)) return;
    // 在微任务中执行
    Promise.resolve().then(() => {
      this.get() // 触发计算属性 重新求值
      let index = watcherQueue.length - 1
      this.cb.call(this.vm, this.value)
      watcherQueue.splice(index, 1)
    })
  }

}