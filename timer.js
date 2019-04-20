module.exports = (function() {
  const pub = {};
  let timer;
  let interval = null;

  pub.run = function(options) {
    const { duration, callback } = options;
    let secondsLeft = duration * 10;

    timer = document.getElementById('timer');

    updateTimer(secondsLeft);

    interval = setInterval(function() {
      secondsLeft--;
      updateTimer(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        interval = null;
        callback();
      }
    }, 1000);
  };

  pub.reset = function() {
    if (interval === null) {
      return;
    }
    clearInterval(interval);
  }

  function updateTimer(secondsLeft) {
    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft - minutes * 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    timer.innerHTML = minutes + ':' + seconds;
  }

  return pub;
})();