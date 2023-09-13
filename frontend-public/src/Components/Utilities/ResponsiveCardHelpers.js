const responsiveCardHelpers = {
  getMinWidth: function (mediumScreenSize) {
    if (mediumScreenSize) {
      return 500;
    } else {
      return 300;
    }
  },
  getHeight: function (mediumScreenSize) {
    if (mediumScreenSize) {
      return 600;
    } else {
      return 450;
    }
  },
};

export default responsiveCardHelpers;
