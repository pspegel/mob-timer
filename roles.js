module.exports = (function() {
  const pub = {};
  let drivers;
  let navigators;
  let driver;
  let navigator;
  let currentDriver = null;
  let currentNavigator = null;
  let changeCallback;

  drivers = document.getElementById('drivers');
  navigators = document.getElementById('navigators');
  driver = document.getElementById('driver');
  navigator = document.getElementById('navigator');

  pub.init = function(callback) {
    changeCallback = callback;
    drivers.onkeyup = changeCallback;
    navigators.onkeyup = changeCallback;
  }

  pub.initOnce = function() {
    roles.nextDriver();
    roles.nextNavigator();
  }

  pub.next = function() {
    nextDriver();
    nextNavigator();
  }

  pub.nextDriver = function() {
    let depth = 0;
    const max = getDrivers().length;
    do {
      nextDriver();
    } while (currentDriver === currentNavigator && depth++ < max);
  };

  pub.nextNavigator = function() {
    let depth = 0;
    const max = getNavigators().length;
    do {
      nextNavigator();
    } while (currentDriver === currentNavigator && depth++ < max);
  };

  pub.reset = function() {
    currentDriver = null;
    currentNavigator = null;
    pub.nextDriver();
    pub.nextNavigator();
  };

  pub.copyToNavigators = function() {
    navigators.value = drivers.value;
    changeCallback();
  }

  pub.isValid = function() {
    return drivers.value.length > 0 && navigators.value.length > 0;
  }

  function nextDriver() {
    const next = nextFromList(getDrivers(), currentDriver);
    currentDriver = next || currentDriver;
    update();
  }

  function nextNavigator() {
    const next = nextFromList(getNavigators(), currentNavigator, currentDriver);
    currentNavigator = next || currentNavigator;
    update();
  };

  function update() {
    driver.innerHTML = currentDriver;
    navigator.innerHTML = currentNavigator;
  }

  function getDrivers() {
    return getListFrom(drivers);
  };

  function getNavigators() {
    return getListFrom(navigators);
  };

  function nextFromList(list, current, skip) {
    if (!current) {
      return pickIndexOrFollowing(list, 0, skip);
    }
    const index = list.indexOf(current);
    return pickIndexOrFollowing(list, index + 1, skip);
  }

  function pickIndexOrFollowing(list, index, skip, depth = 0) {
    if (depth > list.length) {
      return null;
    }
    if (skip && list[index] === skip) {
      return pickIndexOrFollowing(list, index + 1, skip, depth++);
    }
    if (index >= list.length) {
      return pickIndexOrFollowing(list, 0, skip, depth++);
    }
    return list[index];
  }

  function getListFrom(textarea) {
    if (!textarea.value) {
      return [];
    }
    const dirtyList = textarea.value.split("\n");
    let cleanList = [];
    for (let i = 0; i < dirtyList.length; i++) {
      const name = dirtyList[i].trim();
      if (name) {
        cleanList.push(name);
      }
    }
    return cleanList;
  }

  return pub;
})();