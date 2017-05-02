class Pasta {
  static config = {
    maxBuff: 10,
    endpoint: '',
    username: null,
    customInfo: {},
  }

  static customInfo = {}

  static defaultCustomInfo = {
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
      return `${width}x${height}`;
    },
  }

  static updateCustomInfo(more) {
    Pasta.customInfo = Object.assign({}, Pasta.defaultCustomInfo, more);
  }

  static customConfig(opts) {
    let result = {};
    const customInfo = Pasta.customInfo;
    const keys = Object.keys(customInfo);
    keys.forEach((key) => {
      if (customInfo[key]) {
        result = Object.assign({}, result, {
          [key]: customInfo[key](opts),
        });
      }
    });
    return result;
  }

  constructor(config = {}) {
    const tmpConfig = Object.assign({}, Pasta.config, config);
    Pasta.updateCustomInfo(tmpConfig.customInfo);
    const customInfo = Pasta.customConfig(tmpConfig);

    this.buffer = []; // [{...}, {...}]
    this.config = Object.assign({}, tmpConfig, customInfo);
    this.customInfo = customInfo;
    this.pending = false;
  }

  push(data) {
    const { maxBuff } = this.config;
    this.buffer.push(Object.assign({
      time: (new Date()).getTime() / 1000,
    }, data, this.customInfo));
    if (this.buffer.length >= maxBuff && !this.pending) {
      this.send('auto');
    }
  }

  pop() {
    const { maxBuff } = this.config;
    const length = Math.min(this.buffer.length, maxBuff);
    this.buffer.splice(0, length);
    if (this.buffer.length >= maxBuff) {
      this.send('auto');
    }
  }

  send(isAuto = false) {
    const { maxBuff, endpoint } = this.config;
    const { length: bufLen } = this.buffer;
    const length = isAuto ? (Math.min(bufLen, maxBuff)) : bufLen;
    const data = this.buffer.slice(0, length);
    if (data.length === 0) { return false; }
    // sending
    this.pending = true;
    return fetch(endpoint, {
      async: false,
      body: JSON.stringify(data),
      header: {
        'Accept-Charset': 'utf-8',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
    }).then((res) => {
      this.pending = false;
      if (res.ok) { this.pop(); }
    }).catch(() => {
      this.pending = false;
    });
  }
}

export default Pasta;
