### 使用
1. 需要在本地或者全局安装eslint

```bash
$ npm install eslint --save-dev
```

2. 然后初始化配置文件

```bash
$ ./node_modules/.bin/eslint --init
```

3. 此时vscode的eslint插件会生效。会在你的代码上标红提示错误。

当然也可以运行`eslint ./src`来跑



```javascript
module.exports = {
    "root": true, //为了不让eslint继续去父级目录下寻找.eslintrc，因为它默认会去父级目录下找并且与当前文件merge
    //env是用来定义全局变量的（which environments your script is designed to run in. Each environment brings with it a certain set of predefined global variables.）
    "env": {		
        "browser": true,
        "commonjs": true,
        "es6": true  // for new ES6 global variables, use { "env": { "es6": true } } (this setting enables ES6 syntax automatically).  会自动允许使用es6语法
    },
    "extends": ["eslint:recommended", "plugin:vue/essential"],	//使用哪些整套的规则（第一个是eslint官方推荐的；第二个是lint vue文件的时候所必须的eslint-plugin-vue）
    "parserOptions": {			
        "sourceType": "module",
        "ecmaVersion": 3		//支持语法的ecma版本（写es3的时候不能写"sourceType": "module", 否则会失效）
    },
    "globals": {			//允许使用的全局变量 （例如直接在页面中使用$）
        "expect": true,
        "sinon": true,
        "a": true
    },
     "plugins": ["html", "json"], 	//指定一个要加载的插件。你可以省略插件名的前缀 eslint-plugin-。
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
```

```cmd
eslint ./src --ext .js,.vue --quiet --fix
--ext 进行eslint的文件的后缀名；
--quiet 只在error的时候进行报告
--fix 自动修复
```

### 关于vscode的eslint插件

需要在本地或者全局安装eslint

```bash
$ npm install eslint --save-dev
```

然后初始化配置文件

```bash
$ ./node_modules/.bin/eslint --init
```

eslint插件才会生效。会在你的代码上标红提示错误。

当然也可以运行`eslint ./src`来跑