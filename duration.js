module.exports = (function() {
  const pub = {};
  let duration;

  pub.init = function() {
    duration = document.getElementById('duration');
    duration.onkeypress = stopBadChars;
    document.getElementById('shorterDuration').onclick = shorterDurationClickHandler;
    document.getElementById('longerDuration').onclick = longerDurationClickHandler;
  };

  pub.getDuration = function() {
    return duration.value;
  };

  function shorterDurationClickHandler(e) {
    if (duration.value <= 1) {
      return;
    }
    duration.value--;
  }

  function longerDurationClickHandler(e) {
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