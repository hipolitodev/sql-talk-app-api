const delay = async ({ startTime, callCount, maxTime, maxCalls }, onDelay) => {
  callCount++;

  if (callCount >= maxCalls) {
    let endTime = Date.now();
    let elapsedTime = endTime - startTime;

    if (elapsedTime < maxTime) {
      let delay = maxTime - elapsedTime;
      onDelay && onDelay();
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return { startTime: Date.now(), callCount: 0, maxTime, maxCalls };
  }

  return { startTime, callCount, maxTime, maxCalls };
};

module.exports = delay;
