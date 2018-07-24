//import _ from 'lodash';
import printMe from './print.js';

import Icon from './icon.jpg';

import './style.css';

function component() {
  var element = document.createElement('div');

  var btn = document.createElement('button');



  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  element.classList.add('hello')

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);

  // var myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon)

  return element;
}

document.body.appendChild(component());

if (module.hot) {
   module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
   })
}
