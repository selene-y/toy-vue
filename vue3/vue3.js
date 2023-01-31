/**
 * targetMap结构
 * {
 *    target: {
 *      key: [ReactiveEffect, ReactiveEffect, ReactiveEffect, ...]
 *    }
 * }
*/
const targetMap = new WeakMap()

let activeEffect // 相当于vue2中的Dep.target 


// track 函数的核心，依赖收集
function trackEffect(dep) {
  if (!dep.has(activeEffect)) dep.add(activeEffect)
}

// 收集依赖
function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  trackEffect(dep)
}

// 触发依赖
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  depsMap.get(key).forEach(effect => effect && effect.run())
}


// const reactiveData = new Reactive({message: 'hello', num: 0})
export function reactive(data) {
  if (!isObject(data)) return
  return new Proxy(data, {
    get(target, key, reciever) {
      const ret = Reflect.get(target, key, reciever)
      // 订阅
      track(target, key)
      return isObject(ret) ? reactive(ret) : ret
    },
    set(target, key, value, reciever) {
      // 发布
      Reflect.set(target, key, value, reciever)
      trigger(target, key)
      return true
    },
    deleteProperty(target, key) {
      trigger(target, key)
      return Reflect.deleteProperty(target, key)
    },
    has(target, key) {
      const ret = Reflect.has(target, key)
      track(target, key)
      return ret
    },
    ownKeys(target) {
      track(target, key)
      return Reflect.ownKeys(target)
    }
  })
}

// const num = ref(0)
// num.value
export function ref(init) {
  class RefImpl{
    constructor(init) {
      this._value = init
    }

    get value() {
      track(this, 'value')
      return this._value
    }

    set value(newVal) {
      this._value = newVal
      trigger(this, 'value')
    }
  }
  return new RefImpl(init)
}

// const m = computed(() => `${num.vakue}!!!`)
export function computed(fn) {
  // 只考虑函数的用法
  let __computed
  const e = effect(fn, {lazy: true})
  __computed = {
    get value() {
      return e.run()
    }
  }
  return __computed
}

// 简单实现，不做compile部分
export function mount(instance, el) {
  effect(function() {
    instance.$data && update(instance, el)
  })
  instance.$data = instance.setup()
  update(instance, el)
  function update() {
    el.innerHTML = instance.render()
  }
}


// effect(() => { console.log(num.value) })
function effect(fn, options = {}) {
  const __effect = new ReactiveEffect(fn)
  if (!options.lazy) {
    __effect.run()
  }
  return __effect
}


class ReactiveEffect{
  constructor(fn) {
    this.fn = fn
  }

  run() {
    activeEffect = this
    return this.fn()
  }
}

function isObject(data) {
  return data && typeof data === 'object'
}
