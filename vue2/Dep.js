export default class Dep {
  constructor() {
    // 用一个set对象来收集依赖，每一个dep其实是一个watcher
    // 每一个属性会创建一个自己的Dep实例
    this.deps = new Set()
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  addSub(watcher) {
    this.deps.add(watcher)
  }
  notify() {
    this.deps.forEach(dep => {
      return dep.update()
    })
  }
}