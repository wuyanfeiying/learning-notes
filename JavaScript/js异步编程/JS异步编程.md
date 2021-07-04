## JS异步编程

#### JS为什么是单线程

JavaScript语言的一大特点就是单线程，也就是，同一个时间内只能做一件事。

> 线程 和 进程

举例：`进程`就是一个公司，每个公司都有自己的资源可以调度；公司之间是相互独立的；而`线程`就是公司中的每个员工（你、我、他），多个员工一起合作，完成任务，公司可以有一名员工或多个，员工之间共享公司的空间。



如果是windows电脑中，可以打开任务管理器，可以看到有一个后台进程列表。对，那里就是查看进程的地方，而且可以看到每个进程的内存资源信息以及cpu占有率。

<img src=".\img\jinchenghexiancheng.png" style="zoom:50%;" />

进程是CPU资源分配的最小单位（系统会给它分配内存）



*什么是进程呢？*

进程：是CPU分配资源的最小单位（是能拥有资源和独立运行的最小单元）

*什么是线程呢？*

线程：是CPU调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）



- 不同进程之间也可以通信，不过代价较大

- 现在，一般通用的叫法：单线程与多线程，都是指在一个进程内的单和多。（所以核心还是得属于一个进程才行）

  

*浏览器是多线程的*

在浏览器中，没打开一个他tab页面，其实就是新开了一个进程，在这个进程中，还有UI渲染线程，JS引擎线程，HTTP请求线程等。所以，浏览器是一个多进程的。

> 为什么JavaScript不能有多个线程呢？

1. 单线程可以提高效率；
2. 与其自身的用途有关，作为浏览器脚本语言，JavaScript的主要用途就是与用户交互，以及操作DOM。这决定了它只可能是单线程，否者会带来很复杂的同步问题。例如：假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准呢？所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。
3. HTML5提出的Web Worker标准其核核心本质也是单线程：为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

#### 栈和队列

`栈结构`是一端封口，特点是`"先进后出"`；而`队列`的两端全是开口，特点是`"先进先出"`。

<img src=".\img\Stack.png" style="zoom:75%;" />

<img src=".\img\queue.png" style="zoom:75%;" />

#### JavaScript是单线程，怎样执行异步的代码？

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。
js引擎执行`异步代码`而不用等待，是因有为有 `消息队列`和`事件循环`。

- `消息队列`：**消息队列**是一个先进先出的队列，它里面存放着各种消息。
- `事件循环`：**事件循环**是指主线程重复从消息队列中取消息、执行的过程。

实际上，主线程只会做一件事情 ，就是从消息队列里面取消息、执行消息，再取消息、再执行。当消息队列为空时，就会等待直到消息队列变成非空。而且主线程只有在将当前的消息执行完成后，才会去取下一个消息。这种机制就叫做事件循环机制，取一个消息并执行的过程叫做一次循环。

> 消息就是注册异步任务时添加的回调函数。

以下是一个异步代码

```javascript
$.ajax('http://baidu.com', function(resp) {
    console.log('我是响应：', resp);
});

// 其他代码
...
...
...
```

主线程在发起AJAX请求后，会继续执行其他代码。AJAX线程负责请求baidu.com，拿到响应后，它会把响应封装成一个JavaScript对象，然后构造一条消息：

```javascript
// 消息队列中的消息就长这个样子
var message = function () {
    callbackFn(response);
}
```

其中的callbackFn就是前面代码中得到成功响应时的回调函数。

主线程在执行完当前循环中的所有代码后，就会到消息队列取出这条消息(也就是message函数)，并执行它。到此为止，就完成了工作线程对主线程的通知，回调函数也就得到了执行。如果一开始主线程就没有提供回调函数，AJAX线程在收到HTTP响应后，也就没必要通知主线程，从而也没必要往消息队列放消息。

用图表示这个过程就是：

<img src=".\img\tujiexiaoxiduilie.png" style="zoom:75%;" />



#### **event loop**

> JS的Event Loop是JS的执行机制。深入了解JS的执行,就等于深入了解JS里的event loop



```javascript
   console.log(1)
    
    setTimeout(function(){
        console.log(2)
    },0)
 
    console.log(3)
```

运行结果是: 1 3 2

也就是说,setTimeout里的函数并没有立即执行,而是延迟了一段时间,满足一定条件后,才去执行的,这类代码,我们叫`异步代码`。

所以,这里我们首先知道了JS里的一种分类方式,就是将任务分为: **同步任务**和**异步任务**

*JS的执行机制*

- 首先判断JS是同步还是异步,同步就进入主进程,异步就进入event table
- 异步任务在event table中注册函数,当满足触发条件后,被推入event queue
- 同步任务进入主线程后一直执行,直到主线程空闲时,才会去event queue中查看是否有可执行的异步任务,如果有就推入主进程中

```javascript
console.log(1) 是同步任务,放入主线程里
setTimeout() 是异步任务,被放入event table, 0秒之后被推入event queue里
console.log(3 是同步任务,放到主线程里
 
当 1、 3在控制条被打印后,主线程去event queue(事件队列)里查看是否有可执行的函数,执行setTimeout里的函数
```





#### 宏任务与微任务

<img src=".\img\macrotask与microtask.png" style="zoom:75%;" />

一次事件循环：先运行macroTask队列中的一个，然后运行microTask队列中的所有任务。接着开始下一次循环（只是针对macroTask和microTask，一次完整的事件循环会比这个复杂的多）。

JS中分为两种任务类型：macrotask和microtask，在ECMAScript中，microtask称为jobs，macrotask可称为task

> 它们的定义？区别？简单点可以按如下理解：
>

**macrotask（又称之为宏任务）**，可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）

每一个task会从头到尾将这个任务执行完毕，不会执行其它

浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染
（**task->渲染->task->...**）

**microtask（又称为微任务）**，可以理解是在当前 task 执行结束后立即执行的任务

也就是说，在当前task任务后，下一个task之前，在渲染之前

所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染

也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）

> 分别很么样的场景会形成macrotask和microtask呢？
>

**macroTask:** 主代码块, setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering（可以看到，事件队列中的每一个事件都是一个macrotask）

**microTask:** process.nextTick, Promise, Object.observe, MutationObserver



> 参考：
>

JavaScript 运行机制详解：再谈Event Loop：[查看](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

js为什么是单线程 [查看](https://juejin.cn/post/6844903849837215758)

JS是单线程，你了解其运行机制吗？[查看](https://segmentfault.com/a/1190000015806981)

栈和队列 [查看](http://c.biancheng.net/view/3352.html)

js为什么是单线程的？10分钟了解js引擎的执行机制 [查看](https://www.cnblogs.com/yzhihao/p/9377446.html)

