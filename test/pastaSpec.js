import Pasta from '../src/pasta.js';

describe('Pasta', () => {
  it('should be defined', () => {
    expect(Pasta).toBeDefined();
  });

  it('should init right', () => {
    const instance = new Pasta();

    // static
    expect(Pasta.config).toBeDefined();
    expect(Pasta.customInfo).toBeDefined();
    expect(Pasta.updateCustomInfo).toBeDefined();
    // data
    expect(instance.buffer).toBeDefined();
    expect(instance.config).toBeDefined();
    expect(instance.customInfo).toBeDefined();
    expect(instance.pending).toBeDefined();
    // method
    expect(instance.customConfig).toBeDefined();
    expect(instance.push).toBeDefined();
    expect(instance.pop).toBeDefined();
    expect(instance.send).toBeDefined();
  });

  it('should Pasta.updateCustomInfo work', () => {
    const oriCustomInfo = Object.keys(Pasta.customInfo);

    Pasta.updateCustomInfo({
      more1() { return 'more1'; },
    });

    expect(Object.keys(Pasta.customInfo).length).toEqual(oriCustomInfo.length + 1);
    expect(Object.keys(Pasta.customInfo.more1)).toBeDefined();
  });

  it('should customConfig work', () => {
    Pasta.updateCustomInfo({
      more2(opts) { return opts.more2; },
      more1: false,
    });
    const instance = new Pasta();
    const opts = {
      more2: 'more2',
    };
    expect(Pasta.customInfo.more1).toBeDefined();

    const result = instance.customConfig(opts);
    expect(result.more1).not.toBeDefined();
    expect(result.more2).toEqual(opts.more2);
  });

  it('should push work', () => {
    const instance = new Pasta();

    expect(instance.buffer.length).toEqual(0);
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer[0].evtName).toBeDefined();
    expect(instance.buffer[0].time).toBeDefined();
  });

  it('should push work, [buffer.length pending]=[<maxBuff, !pending]', () => {
    const instance = new Pasta();

    spyOn(instance, 'send');

    expect(instance.pending).toEqual(false);
    expect(instance.buffer.length).toEqual(0);
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer.length).toBeLessThan(instance.config.maxBuff);
    expect(instance.send).not.toHaveBeenCalled();
  });

  it('should push work, [buffer.length pending]=[<maxBuff, pending]', () => {
    const instance = new Pasta();

    instance.pending = true;
    spyOn(instance, 'send');

    expect(instance.pending).toEqual(true);
    expect(instance.buffer.length).toEqual(0);
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer.length).toBeLessThan(instance.config.maxBuff);
    expect(instance.send).not.toHaveBeenCalled();
  });

  it('should push work, [buffer.length pending]=[>=maxBuff, !pending]', () => {
    const instance = new Pasta({
      maxBuff: 1,
    });

    instance.pending = false;
    spyOn(instance, 'send');

    expect(instance.pending).toEqual(false);
    expect(instance.buffer.length).toEqual(0);
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer.length).not.toBeLessThan(instance.config.maxBuff);
    expect(instance.send).toHaveBeenCalled();
  });

  it('should push work, [buffer.length pending]=[>=maxBuff, pending]', () => {
    const instance = new Pasta({
      maxBuff: 1,
    });

    instance.pending = true;
    spyOn(instance, 'send');

    expect(instance.pending).toEqual(true);
    expect(instance.buffer.length).toEqual(0);
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer.length).not.toBeLessThan(instance.config.maxBuff);
    expect(instance.send).not.toHaveBeenCalled();
  });

  it('should pop work, [buffer.length]=[<maxBuff]', () => {
    const instance = new Pasta();

    spyOn(instance, 'send');
    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(1);
    expect(instance.buffer.length).toBeLessThan(instance.config.maxBuff);
    instance.pop();
    expect(instance.buffer.length).toEqual(0);
    expect(instance.send).not.toHaveBeenCalled();
  });

  it('should pop work, [buffer.length]=[=maxBuff]', () => {
    const instance = new Pasta({
      maxBuff: 1,
    });

    spyOn(instance, 'send');
    instance.buffer.push({
      evtName: 'test-evt',
    });
    expect(instance.buffer.length).toEqual(instance.config.maxBuff);
    instance.pop();
    expect(instance.buffer.length).toEqual(0);
    expect(instance.send).not.toHaveBeenCalled();
  });

  it('should pop work, [buffer.length]=[>maxBuff]', () => {
    const instance = new Pasta({
      maxBuff: 1,
    });

    spyOn(instance, 'send');
    instance.buffer = [
      { evtName: 'test-evt' }, { evtName: 'test-evt' },
    ];
    expect(instance.buffer.length).toBeGreaterThan(instance.config.maxBuff);
    instance.pop();
    expect(instance.buffer.length).toEqual(Math.abs(2 - instance.config.maxBuff));
    expect(instance.send).toHaveBeenCalled();
  });

  it('should send work, [buffer]=[empty]', () => {
    const instance = new Pasta();

    spyOn(self, 'fetch').and.callFake(() => {
      const p = new Promise((resolve, reject) => {
        throw 'error';
      });
      return p;
    });

    expect(instance.buffer.length).toEqual(0);
    expect(instance.send()).toEqual(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should send work, [buffer]=[!empty], resolved and ok', () => {
    const instance = new Pasta();
    spyOn(instance, 'pop');
    spyOn(self, 'fetch').and.callFake(() => {
      return {
        then(cb) { cb({ ok: true }); return this; },
        catch(cb) { cb(); return this; },
      }
    });

    instance.push({
      evtName: 'test-evt',
    });
    const p = instance.send();
    expect(p).not.toEqual(false);
    expect(fetch).toHaveBeenCalled();
    expect(instance.pop).toHaveBeenCalled();
  });

  it('should send work, [buffer]=[!empty], resolved and !ok', () => {
    const instance = new Pasta();
    spyOn(instance, 'pop');
    spyOn(self, 'fetch').and.callFake(() => {
      return {
        then(cb) { cb({ ok: false }); return this; },
        catch(cb) { cb(); return this; },
      }
    });

    instance.push({
      evtName: 'test-evt',
    });
    const p = instance.send();
    expect(p).not.toEqual(false);
    expect(fetch).toHaveBeenCalled();
    expect(instance.pop).not.toHaveBeenCalled();
  });

  it('should send work, [buffer]=[!empty], rejected', () => {
    const instance = new Pasta();
    spyOn(instance, 'pop');
    spyOn(self, 'fetch').and.callFake(() => {
      return {
        then(cb) { return this; },
        catch(cb) { cb(); return this; },
      }
    });

    instance.push({
      evtName: 'test-evt',
    });
    expect(instance.send()).not.toEqual(false);
    expect(fetch).toHaveBeenCalled();
    expect(instance.pop).not.toHaveBeenCalled();
  });
});