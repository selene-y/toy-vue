import Observer from './Observer.js'
import Compiler from './Compiler.js'
export class Vue {
  constructor(options = {}) {
    this.$options = options
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this.$data = options.data
    this.$methods = options.methods

    this.proxy(this.$data)

    // observer 拦截 this.$data 中的数据获取和设置
    new Observer(this.$data)
    new Compiler(this)
  }

  // 将this.$data.XXX 代理到 this.XXX
  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key] || __isNaN(newValue, data[key])) return
          data[key] = newValue
        }
      })
    })
  }

}

function __isNaN(a, b) {
  return Number.isNaN(a) && Number.isNaN(b)
}

window.__isNaN = __isNaN
