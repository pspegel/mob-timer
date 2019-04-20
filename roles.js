module.exports = (function() {
  const pub = {};
  let drivers;
  let navigators;
  let driver;
  let navigator;
  let currentDriverIndex = -1;
  let currentNavigatorIndex = -1;
  let changeCallback;

  drivers = document.getElementById("drivers");
  navigators = document.getElementById("navigators");
  driver = document.getElementById("driver");
  navigator = document.getElementById("navigator");

  pub.init = function(callback) {
    function allCallbacks() {
      update();
      callback();
    }
    changeCallback = callback;
    drivers.onkeyup = allCallbacks;
    navigators.onkeyup = allCallbacks;
  };

  pub.next = function() {
    nextDriver();
    nextNavigator();
  };

  pub.nextDriver = function() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    let depth = 0;
    const max = getDrivers().length;
    do {
      nextDriver();
    } while (
      driverList[currentDriverIndex] === navigatorList[currentNavigatorIndex] &&
      depth++ < max
    );

    changeCallback();
  };

  pub.nextNavigator = function() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    let depth = 0;
    const max = getNavigators().length;
    do {
      nextNavigator();
    } while (
      driverList[currentDriverIndex] === navigatorList[currentNavigatorIndex] &&
      depth++ < max
    );

    changeCallback();
  };

  pub.reset = function() {
    currentDriverIndex = -1;
    currentNavigatorIndex = -1;
    pub.nextDriver();
    pub.nextNavigator();
  };

  pub.copyToNavigators = function() {
    navigators.value = drivers.value;
    update();
    changeCallback();
  };

  pub.isValid = function() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    return (
      driverList.length > 0 &&
      navigatorList.length > 0 &&
      driverList.length + navigatorList.length > 2 &&
      driverList[currentDriverIndex] &&
      navigatorList[currentNavigatorIndex] !== driverList[currentDriverIndex]
    );
  };

  function update() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();

    if (driverList.length === 0) {
      currentDriverIndex = -1;
    } else if (
      currentDriverIndex === -1 ||
      currentDriverIndex >= driverList.length ||
      (driverList[currentDriverIndex] &&
        driverList.length > 1 &&
        driverList[currentDriverIndex] === navigatorList[currentNavigatorIndex])
    ) {
      roles.nextDriver();
    }

    if (navigatorList.length === 0) {
      currentNavigatorIndex = -1;
    } else if (
      currentNavigatorIndex === -1 ||
      currentNavigatorIndex >= navigatorList.length ||
      navigatorList[currentNavigatorIndex] === driverList[currentDriverIndex]
    ) {
      roles.nextNavigator();
    }

    updateDisplay();
  }

  function nextDriver() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    currentDriverIndex = nextFromList(driverList, currentDriverIndex);

    if (
      navigatorList[currentNavigatorIndex] === driverList[currentDriverIndex]
    ) {
      currentNavigatorIndex++;
    }

    update();
  }

  function nextNavigator() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    currentNavigatorIndex = nextFromList(navigatorList, currentNavigatorIndex);

    if (
      driverList[currentDriverIndex] === navigatorList[currentNavigatorIndex]
    ) {
      currentDriverIndex++;
    }

    update();
  }

  function updateDisplay() {
    const driverList = getDrivers();
    const navigatorList = getNavigators();
    driver.innerHTML = driverList[currentDriverIndex] || "";
    navigator.innerHTML = navigatorList[currentNavigatorIndex] || "";
  }

  function getDrivers() {
    return getListFrom(drivers);
  }

  function getNavigators() {
    return getListFrom(navigators);
  }

  function nextFromList(list, currentIndex, skip) {
    if (currentIndex === -1 || currentIndex === list.length - 1) {
      return pickIndexOrFollowing(list, 0, skip);
    }
    return pickIndexOrFollowing(list, currentIndex + 1, skip);
  }

  function pickIndexOrFollowing(list, index, skip, depth = 0) {
    if (depth > list.length) {
      return -1;
    }
    if (list[index] && skip && list[index] === skip) {
      return pickIndexOrFollowing(list, index + 1, skip, depth + 1);
    }
    if (index >= list.length) {
      return pickIndexOrFollowing(list, 0, skip, depth + 1);
    }
    return index;
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
