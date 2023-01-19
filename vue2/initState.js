import Dep from "./Dep.js";
import Watcher from "./Watcher.js";
export function initComputed () {
  let computed = this.$options.computed
  if (computed) {
    let keys = Object.keys(computed)
    for (let index = 0; index < keys.length; index++) {
      const watcher = new Watcher(this, computed[keys[index]], function() {
      }, {lazy: true})

      Object.defineProperty(this, keys[index], {
        enumerable: true,
        configurable: true,
        get: function computedGetter () {
          if (watcher.dirty) {
            watcher.get()
            watcher.dirty = false
          }
          // if (Dep.target) {
          //   watcher.deps.forEach(dep => dep.depend())
          // } 
          return watcher.value
        },
        set: function computedSetter () {
          console.warn('请不要给计算属性赋值')
        }
      })
    }
  }
}

export function initWatch () {
  let watch = this.$options.watch
  if (watch) {
    let keys = Object.keys(watch)
    for (let index = 0; index < keys.length; index++) {
      new Watcher(this, keys[index], watch[keys[index]])
    }

  }
  // if ()
}