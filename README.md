## pasta-js

[![Build Status](https://travis-ci.org/polydice/pasta-js.svg)](https://travis-ci.org/polydice/pasta-js)

It makes easy to collect data to send.

### How to run examples?
- `npm install`
- `npm start`
- Open `http://localhost:8000/ex01`, and show log in the terminal.

### Installation

Using npm:

```
$ npm install --save @polydice/pasta-js
```

Then with a module bundler like webpack

```
// using ES6 modules
import {Pasta} from 'pasta-js'

// using CommonJS modules
var Pasta = require('pasta-js').pasta;
```

Or UMD build in `dist/pasta-full.min.js` in the installed folder.

### Browser Support
It should use some polyfills expect for modern browsers, such as Chrome, Firefox, Microsoft Edge and Safari.

### API

#### Initialization - Pasta(config)
- *config* : Object(required)

core parameters

- endpoint: String(required).
- maxBuff: Number(option), default: `10`. It is the limit for the buffer to send.
- username: Any(option), default: `null`.


```
  var tracking = new Pasta({
    endpoint: '',
  });
```

#### push(data)

- *data*: Object(required), any tracked data.

After initialization, use push to candidated queue. It will send automatically if buffer is up to limit (default: 10).

```
  tracking.push({
    event: 'click-button',
    count: 4
  });
```

#### send()

Send data to host by manually.

```
  tracking.send();
```

#### Tracked information

Every time a track is called, the following information is sent:

- page_path
- page_title
- page_url
- referrer
- time
- user_agent
- username
- viewport

They can disable or overwrite at initialization. But `time` can not disable or overwrite.

```
  var tracking = new Pasta({
    endpoint: '',
    customInfo: {
      viewport: false, // disable to send
      page_title() { return 'test title'; } // overwrite the data
    }
  });
```

It can set other information to send every time.

```
  var tracking = new Pasta({
    endpoint: '',
    customInfo: {
      customKey() { return 'custom value'; }
    }
  });
```

### License
Check license [here](https://github.com/polydice/pasta-js/blob/master/LICENSE).
