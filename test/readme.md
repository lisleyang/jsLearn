### 断言库 ：保证最小单元是否正常运行检测方法

* TDD: (Test Driven Development) 测试驱动开发；
* BDD: (Behavior Driven Development) 行为驱动开发

TDD关注所有功能是否被实现（每一个功能都必须有对应的测试用例）；BDD关注整体行为是否符合整体预期，编写的每一行代码都有目的提供一个全面的测试用例集

* better-assert(TDD断言库)
* should.js (BDD断言库)
* expect.js(BDD断言库)
* **chai.js** (TDD,BDD双模)
* **Jasmine.js** (BDD断言库)
* Nodejs本身集成 (require("assert"))
* Qunit 一个游离在jQuery左右的测试框架

测试用例的一般性写法
```javascript
describe('测试用例',function(){
    it("1+1等于2",function(){
        expext(1+1==2).to.equal(true)
    })
})
```

### Karma : 测试的runner

因为单元测试是没有必要打开浏览器的；Karma通过内置的的Phantom（无UI界面浏览器）在chrome内核中运行测试用例。

### Karma与Mocha的区别：

Karma像是一个runner
Mocha/Jasmine 是testFramework

Mocha是一个单元测试框架。但这还不够，也不能每写完一次就运行一下单测代码，这也效率太低了，所以还需要一个框架（即 karma）来做这个事情。

Image the following scenario:
* Write your own test suites with Mocha
* Use Karma to run programmatically your Mocha tests cross-browser and cross-devices
* More, integrate Karma with your Jasmine existing environment
* Even more, integrate Karma in your Continuous Integration cycle
* Use a million Karma plugin to check coverage, complexity, framework stuff, etc...

The power of Karma is that it can spawn real browsers - such Chrome or Firefox - to effectively test your code with them.

With Mocha you can run it in a NodeJS environment or in a webpage.

o be fair though, you can run mocha in multiple browsers to get the cross-browser effect you list. Karma really shines as a test runner, continuous integration, retesting on file change, ability to use in conjunction with jasmine/qunit, etc