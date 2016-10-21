String.prototype.insertAt = function (index, string) {
  return this.substr(0, index) + string + this.substr(index);
};

Date.prototype.toSwedishDay = function () {
  switch (this.getDay()) {
    case 1:
      return 'måndag';
    case 2:
      return 'tisdag';
    case 3:
      return 'onsdag';
    case 4:
      return 'torsdag';
    case 5:
      return 'fredag';
    case 6:
      return 'lördag';
    case 7:
      return 'söndag';
    default:
      return '';
  }
};