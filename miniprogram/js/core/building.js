import Sprite from '../base/sprite.js'
import { getBuildingList } from '../race/index.js'
import { genUUID, showToast } from './util.js'
import { GRID_WIDTH, GRID_HEIGHT } from '../../constant/area.js'

export default class Building extends Sprite {
  constructor(raceId, building_id, userId, x, y) {
    super()
    this.raceId = raceId;
    this.building_id = building_id;
    this.userId = userId;
    this.x = x;
    this.y = y;
    this.isDestory = false;
    this.init(building_id);
  }

  init(building_id) {
    const building = getBuildingList(this.raceId).find(item => item.building_id === building_id)
    if (!building) {
      const errTxt = '创建建筑物失败';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    this.id = genUUID();
    this.width = GRID_WIDTH;
    this.height = GRID_HEIGHT;
    this.img = building.img;
    this.weight = building.weight;
    this.name = building.name;
    this.openUnitIds = building.openUnitIds;
    this.openBuildingIds = building.openBuildingIds;
    this.energy = building.energy;
    this.isDestory = false
  }

  destory() {
    this.isDestory = true
  }
}
