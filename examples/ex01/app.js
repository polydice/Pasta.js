import '../images';
import { Pasta } from '../../src';

document.querySelector('h1').innerHTML = 'EXAMPLE';
const tracking = new Pasta({
  endpoint: 'http://localhost:9090/icook.homepage-event.web',
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
