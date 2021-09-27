// 解析器，解析页面dom结构，创建watcher
import Watcher from './Watcher.js'
export default class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.methods = vm.$methods

    this.compile(vm.$el)
  }

  compile(el) {
    let childNodes = el.childNodes
    // 处理类数组
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileTextNode(node)
      }
      else if (this.isElementNode(node)) {
        this.compileElementNode(node)
      }

      // 文本节点是一个元素节点的子节点
      if (node.childNodes && node.childNodes.length) this.compile(node)
    })
  }
  compileTextNode(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent; // 获取文本节点，与innerHtml相比，能防止XSS攻击
    if (reg.test(value)) {
      let key = RegExp.$1.trim() // RegExp.$X 非标准写法，尽量不要在生产环境使用！！！
      node.textContent = value.replace(reg, this.vm[key])

      new Watcher(this.vm, key, value => {
        node.textContent = value
      })
    }
  }
  // 解析元素节点 <input v-model="msg">
  compileElementNode(node) {
    if (!node.attributes.length) return
    // attributes 是一个类数组，存了该对象的所有属性
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name // 属性名
      if (this.isDirective(attrName)) {
        // v-on:click v-model
        attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
        let key = attr.value // 属性值
        this.update(node, key, attrName, this.vm[key])
      }
    })
  }
  update(node, key, attrName, value) {
    if (attrName === 'text') {
      node.textContent = value
      new Watcher(this.vm, key, val => node.textContent = val)
    }
    else if (attrName === 'model') {
      node.value = value
      new Watcher(this.vm, key, val => node.value = val)
      node.addEventListener('input', () => {
        this.vm[key] = node.value
      })
    }
    else if (attrName === 'click') {
      node.addEventListener(attrName, this.methods[key].bind(this.vm))
    }
  }
  isDirective(str) {
    return str.startsWith('v-')
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
}