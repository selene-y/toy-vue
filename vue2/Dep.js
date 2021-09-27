export default class Dep {
  constructor() {
    // 用一个set对象来收集依赖，每一个dep其实是一个watcher
    // 每一个属性会创建一个自己的Dep实例
    this.deps = new Set()
  }
  add(dep) {
    // REVIEW 这个update是什么
    if (dep && dep.update) this.deps.add(dep)
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}