import 'es5-shim';
import 'es6-shim';
import 'whatwg-fetch';

class Pasta {
  static config = {
    maxBuff: 10,
    endpoint: '',
    username: null,
    customInfo: {},
  }

  static otherInfo = {
    page_path() {
      return location.pathname;
    },
    page_title() {
      return document.title;
    },
    page_url() {
      return location.href;
    },
    referrer() {
      return document.referrer;
    },
    user_agent() {
      return navigator.userAgent;
    },
    username(config) {
      return config.username;
    },
    viewport() {
      const clientHeight = document.documentElement && document.documentElement.clientHeight;
      const clientWidth = document.documentElement && document.documentElement.clientWidth;
      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;
      const height = clientHeight < innerHeight ? innerHeight : clientHeight;
      const width = clientWidth < innerWidth ? innerWidth : clientWidth;
      return width + 'x' + height;
    },
  }

  static updateOtherInfo(more) {
    Pasta.otherInfo = Object.assign({}, Pasta.otherInfo, more);
  }

  constructor(config = {}) {
    const tmpConfig = Object.assign({}, Pasta.config, config);
    Pasta.updateOtherInfo(tmpConfig.customInfo);
    const otherInfo = this.configOther(tmpConfig);

    this.buffer = []; // [{...}, {...}]
    this.config = Object.assign({}, tmpConfig, otherInfo);
    this.otherInfo = otherInfo;
    this.pending = false;
  }

  configOther(opts) {
    let result = {};
    const otherInfo = Pasta.otherInfo;
    const keys = Object.keys(otherInfo);
    keys.forEach((key) => {
      if (otherInfo[key]) {
        result = Object.assign({}, result, {
          [key]: otherInfo[key](opts)
        });
      }
    });
    return result;
  }

  push(data) {
    const { maxBuff } = this.config;
    this.buffer.push(Object.assign({
      time: (new Date()).getTime() / 1000,
    }, data, this.otherInfo));
    if (this.buffer.length >= maxBuff && !this.pending) {
      this.send();
    }
  }

  pop() {
    const { maxBuff } = this.config;
    const length = Math.min(this.buffer.length, maxBuff);
    this.buffer.splice(0, length);
    if (this.buffer.length >= maxBuff) {
      this.send();
    }
  }

  send() {
    const { maxBuff, endpoint } = this.config;
    const length = Math.min(this.buffer.length, maxBuff);
    const data = this.buffer.slice(0, length);
    if (data.length === 0) { return false; }
    // sending
    this.pending = true;
    fetch(endpoint, {
      async: false,
      body: JSON.stringify(data),
      header: {
        'Accept-Charset': 'utf-8',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
    }).then(res => {
      this.pending = false;
      res.ok && this.pop();
    }).catch(()=> {
      this.pending = false;
    });
  }
}

export default Pasta;
