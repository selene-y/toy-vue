## 步骤描述
```js
let count = ref(0);
effect(() => { console.log(count.value)});
```
effect 的内部函数，会执行。run();
触发了refNum.value 去收集依赖；
track 的过程。
-- targetMap() 添加副作用函数


```js
setInterval(() => {
    count.value++
}, 1000)
```

trigger 
targetMap 取出对应的activeEffect对象
执行 run 方法。