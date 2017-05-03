import 'es5-shim';
import 'es6-shim';
import 'whatwg-fetch';
import '../images';
import { Pasta } from 'pasta-js';

document.querySelector('h1').innerHTML = 'EXAMPLE';
const tracking = new Pasta({
  endpoint: 'http://localhost:8000/icook.homepage-event.web',
  username: 'username',
  customInfo: {
    viewport: false,
  },
});

let count = 0;
const addnode = document.querySelector('#add');
addnode.addEventListener('click', () => {
  count++;
  tracking.push({
    content: `測試${count}`,
    event: 'test',
  });
});

const btnnode = document.querySelector('#send');
btnnode.addEventListener('click', () => {
  tracking.send();
});
