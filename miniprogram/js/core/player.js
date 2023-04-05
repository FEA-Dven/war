import { getRandomEnergy, showToast, getEnemy } from './util.js'
import Unit from './unit.js'
import Building from './building.js';
import Tower from './tower.js';
import { getBuildingList, getUnitList } from '../race/index.js'
import Effect from './effect.js';
import { RACE_ENUM } from '../../constant/race.js';

const REDUCE_ENERFY_TYPE = {
  UNIT: 1,
  BUILDING: 2
}

export default class Player {
  constructor(raceId, userId) {
    this.raceId = raceId;
    this.userId = userId;
    this.energy = 0;
    this.units = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.buildings = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.towers = [null, null, null, null, null, null, null, null, null, null];
    this.isRoundEnd = true;
    this.hp = 60;
    // 本轮创建的单位
    this.hasCreateUnitIds = [];
  }

  // 回合初始化
  roundInit() {
    if (!this.isRoundEnd) return
    this.isRoundEnd = false
    this.hasCreateUnitIds = [];
    this.addEnergy();
    this.resetAllUnit()
    if (this.isAI && window.scene && window.scene.sceneType === 'game') {
      this.AIInit()
    }
  }

  // 回合结束
  roundEnd() {
    this.isRoundEnd = true;
  }

  // 增加能量
  addEnergy() {
    const randomEnergy = getRandomEnergy()
    const towersEnergy = (this.towers.filter(item => item)).length
    const add = randomEnergy + towersEnergy;
    this.energy = this.energy + add;
    this.roundEnd()
  }

  // 购买单位和购买建筑消耗能量
  reduceEnergy(raceId, id, type) {
    const searchList = type === REDUCE_ENERFY_TYPE.UNIT ? getUnitList(raceId) : getBuildingList(raceId);
    const searchKey = type === REDUCE_ENERFY_TYPE.UNIT ? 'unit_id' : 'building_id';
    const search = searchList.find(item => item[searchKey] === id)
    const {energy} = search;
    if (!energy) {
      const errTxt = '系统错误，单位和建筑无能量消耗';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    if (this.energy < energy) {
      const errTxt = '当前能量不足购买';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    this.energy = this.energy - energy;
  }

  // 创建单位 index-坑位索引
  createUnit(unit_id, index, x, y) {
    if (this.units[index] !== null) {
      const errTxt = '当前区域已有单位';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    this.reduceEnergy(this.raceId, unit_id, REDUCE_ENERFY_TYPE.UNIT)
    this.units[index] = new Unit(this.raceId, unit_id, this.userId, x, y);
  }

  // 创建单位 index-坑位索引
  createUnitForFree(unit_id, index, x, y) {
    this.units[index] = new Unit(this.raceId, unit_id, this.userId, x, y);
  }

  // 直接改变单位 例如魔导师效果
  changeUnit(raceId, unit_id, index, x, y) {
    this.units[index] = new Unit(raceId, unit_id, this.userId, x, y);
  }

  // 创建建筑 index-坑位索引
  createBuilding(building_id, index, x, y) {
    if (this.buildings[index] !== null) {
      const errTxt = '当前区域已有建筑';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    this.reduceEnergy(this.raceId, building_id, REDUCE_ENERFY_TYPE.BUILDING)
    this.buildings[index] = new Building(this.raceId, building_id, this.userId, x, y);
  }
  
  // 创建能源塔
  createTower(index, x, y) {
    const TOWER_ENERGY = 2;
    if (this.energy < TOWER_ENERGY) {
      const errTxt = '当前能量不足购买';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    if (this.towers[index] !== null) {
      const errTxt = '当前区域已有能源塔';
      showToast({ icon: 'none', title: errTxt});
      throw new Error(errTxt)
    }
    this.energy = this.energy - TOWER_ENERGY;
    this.towers[index] = new Tower(this.userId, x, y);
  }

  // 所有单位重置
  resetAllUnit() {
    this.units.forEach(unit => {
      if (unit) {
        unit.isWait = false
        unit.isUseEffect = false
        unit.af = unit.sourceAf
      }
    })
    const enemy = window.scene.players.find(player => player.userId !== this.userId)
    // 咒术师
    const charmList = enemy.units.filter(unit => unit && unit.raceId === RACE_ENUM.MAGIC && unit.unit_id === 7)
    if (charmList.length) {
      Effect.charm(charmList.length, this.userId)
    }
  }

  // 攻击动画
  attackAnimation(source, target) {
    const distanceX = Math.abs(target.x - source.x);
    const distanceY = Math.abs(target.y - source.y);
    const isPositiveDirectionX = target.x >= source.x;
    const isPositiveDirectionY = target.y >= source.y;
    const moveX = isPositiveDirectionX ? (distanceX / 100) : -(distanceX / 100)
    const moveY = isPositiveDirectionY ? (distanceY / 100) : -(distanceY / 100)
    if (isPositiveDirectionX) {
      if (source.x >= target.x) {
        source.x -= moveX
      } else {
        source.x += moveX
      }
    } else {
      if (source.x < target.x) {
        source.x -= moveX
      } else {
        source.x += moveX
      }
    }
    if (isPositiveDirectionY) {
      if (source.y >= target.y) {
        source.y -= moveY
      } else {
        source.y += moveY
      }
    } else {
      if (source.y < target.y) {
        source.y -= moveY
      } else {
        source.y += moveY
      }
    }
  }
}
