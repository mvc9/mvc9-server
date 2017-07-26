/* buffer */
global.bufferMemory = {};
const buffer = {}

buffer.intervalClear = setInterval(() => {
  const currentTime = (new Date()).getTime();
  Object.keys(bufferMemory).map((path) => {
    if (!bufferMemory[path].data || bufferMemory[path].expireTime < currentTime) {
      delete bufferMemory[path].expireTime;
      delete bufferMemory[path].data;
      delete bufferMemory[path];
      logOnConsole({ name: 'Buffer', content: `Clear expired memory "${path}"`, logLevel: 5 });
    }
  });
}, config.server.BufferTime);

buffer.readRes = (path, alwaysReload) => {
  const loadFile = (path) => {
    const isResExist = fileSystem.existsSync(path);
    let resContent = false;
    if (isResExist) {
      resContent = fileSystem.readFileSync(path, config.server.Charset);
      logOnConsole({ name: 'Buffer', content: `ReadResource form file "${path}"`, logLevel: 5 });
    }
    return {
      expireTime: (new Date()).getTime() + config.server.BufferTime,
      data: resContent,
    }
  }
  if (bufferMemory[path] && !alwaysReload) {
    if (bufferMemory[path].expireTime < (new Date()).getTime()) {
      bufferMemory[path] = loadFile(path);
    }
  } else {
    bufferMemory[path] = loadFile(path);
  }
  return bufferMemory[path].data;
}

buffer.readMem = (path) => {
  if (bufferMemory[path]) {
    if (bufferMemory[path].expireTime > (new Date()).getTime()) {
      return bufferMemory[path].data
    }
  }
  return false;
}

buffer.writeMem = (path, data) => {
  if (bufferMemory[path]) {
    delete bufferMemory[path].expireTime;
    delete bufferMemory[path].data;
    delete bufferMemory[path];
  }
  bufferMemory[path] = {
    expireTime: (new Date()).getTime() + config.server.BufferTime,
    data: data,
  };
}

module.exports = buffer;
