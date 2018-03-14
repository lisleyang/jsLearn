```javascript
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var obj = yield fetch(url);
  console.log(obj.bio);
}

var g = gen();
var result = g.next();  /*执行完这句话以后，gen函数里面的obj还是undefined。g.next()会返回fetch(url)作为result的值*/

result.value.then(function(data){
  return data.json();
}).then(function(data){
  console.log(data)
  g.next(data);   //这个next里面的参数，才是var obj = yield fetch(url);中yield fetch(url)的返回值
});

```

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});

```