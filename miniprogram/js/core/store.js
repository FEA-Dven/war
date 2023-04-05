export default new class Store {
  constructor() {
    this.CONSTANT_IMAGE = {}
    this.userId = 1
    this.raceId = 1
  }

  setImage(obj) {
    for (let key in obj) {
      this.CONSTANT_IMAGE[key] = obj[key]
    }
  }

  getImage(key) {
    return this.CONSTANT_IMAGE[key];
  }

  setRaceId(raceId) {
    this.raceId = raceId
  }
}