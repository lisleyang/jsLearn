function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  });
}

let result = loadImageAsync('./test.jpg');
result.then(img=>{
  console.log(img.width)
}).catch(err=>{
  cosnole.log(err)
})

//可以写多个then；Promise会把所有的回调函数放到一个数组里面,然后再status变为resolve的时候依次执行
result.then(img=>{
  console.log(img.height)
}).catch(err=>{
  cosnole.log(err)
})