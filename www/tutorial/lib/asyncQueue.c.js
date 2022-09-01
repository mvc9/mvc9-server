(function (env) {
  var asyncQueue = (functionsQueue, onQueueEndCallback) => {
    if (functionsQueue.constructor.name !== 'Array') {
      throw new Error('asyncQueue.js: Param functionsQueue must be an Array!');
    }
    var queueMemory = {
      step: 0,
      queue: functionsQueue
    };

    var errCatchAndContinue = (err) => {
      try {
        throw new Error(err);
      } catch (error) {
        queueMemory.lastError = err;
        queueMemory.errorCallBack && queueMemory.errorCallBack.constructor.name === 'Function' && queueMemory.errorCallBack(err);
        queueMemory.step += 1;
        setTimeout(queueExecuter, 10, functionsQueue[queueMemory.step]);
      }
    }

    var queueExecuter = (queueFunc) => {
      if (queueFunc && queueFunc.constructor && queueFunc.constructor.name === 'Function') {
        try {
          if (queueMemory.beforeStepCallback) {
            queueMemory.beforeStepCallback();
          }
          queueFunc({
            next: () => {
              queueMemory.step += 1;
              setTimeout(queueExecuter, 10, functionsQueue[queueMemory.step]);
            },
            again: () => {
              setTimeout(queueExecuter, 10, functionsQueue[queueMemory.step]);
            },
            to: (stepChange) => {
              queueMemory.step = queueMemory.step + stepChange;
              setTimeout(queueExecuter, 10, functionsQueue[queueMemory.step]);
            },
            insertNext: (queueFunc) => {
              functionsQueue.splice(queueMemory.step + 1, 0, queueFunc);
            },
            errorAndNext: (err) => {
              errCatchAndContinue(err);
            },
            errorAndExit: (err) => {
              queueMemory.step = functionsQueue.length;
              errCatchAndContinue(err);
            }
          }, queueMemory);
          if (queueMemory.afterStepCallback) {
            queueMemory.afterStepCallback();
          }
        } catch (err) {
          errCatchAndContinue(err);
        }
      } else {
        if (queueFunc && queueFunc.constructor && queueFunc.constructor.name !== 'Function') {
          var errMsg = 'asyncQueue.js: The member of queue must be a function!';
          errCatchAndContinue(errMsg);
        } else {
          onQueueEndCallback && onQueueEndCallback(queueMemory);
        }
      }
    }
    // async queue boot
    setTimeout(queueExecuter, 10, functionsQueue[queueMemory.step]);
    return
  }
  Boolean(env.navigator) ? window.asyncQueue = asyncQueue : module.exports = asyncQueue;
  return asyncQueue;
})(this);
