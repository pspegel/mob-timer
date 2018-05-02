module.exports = (function() {
  const pub = {};
  let duration;

  pub.init = function() {
    duration = document.getElementById('duration');
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

  return pub;
})();