module.exports = (function() {
  const pub = {};
  let duration, changeCallback;

  pub.init = function(callback) {
    changeCallback = callback;
    duration = document.getElementById('duration');
    duration.onkeypress = stopBadChars;
    duration.onkeyup = changeCallback;
    document.getElementById('shorterDuration').onclick = shorterDurationClickHandler;
    document.getElementById('longerDuration').onclick = longerDurationClickHandler;
  };

  pub.getDuration = function() {
    return duration.value;
  };

  pub.isValid = function() {
    return duration.value > 0;
  }

  function shorterDurationClickHandler(e) {
    changeCallback();
    if (duration.value <= 1) {
      return;
    }
    duration.value--;
  }

  function longerDurationClickHandler(e) {
    changeCallback();
    if (duration.value >= 60) {
      return;
    }
    duration.value++;
  }

  function stopBadChars(e) {
    if (e.target.selectionStart === 0 && e.key === '0') {
      return false;
    }

    if (!/^[0-9]$/.test(e.key)) {
      return false;
    }
    return true;
  }

  return pub;
})();