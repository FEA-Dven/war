import { getRandomNum } from './util.js'
import { RACE_ENUM } from '../../constant/race.js';
import { getUnitList } from '../race/index.js'
import { getUnitAreaList, getAIUnitAreaList } from '../core/render.js'
import Store from './store.js';

export default new class Effect {
  constructor() {

  }

  // 调用效果方法
  run(functionName, unit) {
    if (this[functionName]) {
      this[functionName](unit);
      if (unit.raceId === RACE_ENUM.MAGIC) {
        const player = this.getPlayer(unit.userId)
        const pharaohList = player.units.filter(unit => unit && unit.effectFunc && unit.unit_id === 8)
        if (pharaohList.length) {
          pharaohList.forEach(() => {
            this.pharaoh(unit)
          })
        }
      }
    }
  }

  // 随机摧毁一个建筑
  destroyBuilding(unit) {
    const enemy = this.getEnemy(unit.userId);
    const buildings = enemy.buildings;
    const index = this.getRandomIndexByList(buildings)
    if (index !== null) {
      buildings[index] = null;
    }
  }

  // 随机消灭一个单位
  destroyUnit(unit) {
    const enemy = this.getEnemy(unit.userId);
    const units = enemy.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null) {
      units[index] = null;
    }
  }

  // 龙医发动效果: 随机对一个单位hp+1
  dragonDoctor(unit) {
    const player = this.getPlayer(unit.userId);
    const units = player.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null && units[index]) {
      units[index].hp += 1
    }
  }

  // 暴食龙效果: 消灭一个单位攻击力+1 生命值+2
  bingeEating(unit) {
    unit.hp += 2;
    unit.atk += 1;
  }

  // 龙巫效果: 全场单位 攻击力+2 生命值+2
  dragonWizard(unit) {
    const player = this.getPlayer(unit.userId);
    const units = player.units;
    units.forEach(unit => {
      if (unit && !unit.isDestory) {
        unit.atk += 2;
        unit.hp += 2;
      }
    })
  }

  // 龙骑士效果: 生命值增加我方在场单位数
  dragonRider(unit) {
    const player = this.getPlayer(unit.userId);
    const units = player.units;
    const arr = units.filter(unit => !!unit);
    const addHp = arr.length;
    unit.hp += addHp;
  }

  // 帝王效果: 攻击力和生命值提升我方"龙蛋"数
  dragonEmperor(unit) {
    const dragonEggUnitId = 3;
    const player = this.getPlayer(unit.userId);
    const units = player.units;
    const arr = units.filter(unit => unit && unit.unit_id === dragonEggUnitId);
    const addNum = arr.length;
    unit.hp += addNum;
    unit.atk += addNum;
  }

  // 彩虹龙效果
  dragonRainbow(unit) {
    const enemy = this.getEnemy(unit.userId);
    const units = enemy.units;
    units.forEach(unit => {
      if (unit) {
        unit.hp = 1
      }
    })
  }

  // 随机获取列表的对象索引
  getRandomIndexByList = (list) => {
    let targetKey = null
    if (list && list.length) {
      const indexArr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          indexArr.push(i)
        }
      }
      if (indexArr.length) {
        const num = getRandomNum(indexArr.length);
        targetKey = indexArr[num];
        return targetKey;
      }
    }
    return targetKey;
  }

  // 魔法学童
  magicChild(unit) {
    const enemy = this.getEnemy(unit.userId);
    const units = enemy.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null) {
      units[index] = this.reduceHp(units[index], 1)
    }
  }

  // 魔法导师
  magicTeacher(unit) {
    const player = this.getPlayer(unit.userId);
    const units = player.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null) {
      units[index].atk += 1
    }
  }

  // 先知
  prophet(unit) {
    const enemy = this.getEnemy(unit.userId);
    const units = enemy.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null) {
      if (units[index].hp <= 3) {
        units[index] = null;
      } else {
        units[index].hp -= 3;
        units[index].effect = 'onShow';
        units[index].effect_des = '当前单位效果无效';
        units[index].effectFunc = false;
      }
    }
  }

  // 传教士
  missionary(unit_self_id, userId) {
    const enemy = this.getPlayer(userId)
    const units = enemy.units;
    const i = units.findIndex(item => item && item.id === unit_self_id);
    if (i === 0 || i > 0) {
      if (units[i + 1]) {
        units[i + 1] = this.reduceHp(units[i + 1], 5)
      }
    }
    if (i > 0) {
      if (units[i - 1]) {
        units[i - 1] = this.reduceHp(units[i - 1], 5)
      }
    }
  }

  // 咒术师
  charm(sleep_length, userId) {
    const player = this.getPlayer(userId)
    let unit_uuids = [];
    player.units.forEach(unit => {
      if (unit && unit.id) {
        unit_uuids.push(unit.id);
      }
    })
    const waitList = [];
    while (sleep_length) {
      if (unit_uuids.length > 0) {
        let num = getRandomNum(unit_uuids.length)
        waitList.push(unit_uuids[num])
        unit_uuids.splice(num, 1)
      }
      sleep_length--
    }
    player.units.forEach(unit => {
      if (unit && waitList.length && waitList.includes(unit.id)) {
        unit.isWait = true;
      }
    })
  }

  // 法老
  pharaoh(unit) {
    const enemy = this.getEnemy(unit.userId);
    for (let k = 0; k < enemy.units.length; k++) {
      if (enemy.units[k]) {
        enemy.units[k] = this.reduceHp(enemy.units[k], 1)
      }
    }
  }

  // 牧师
  priest(unit) {
    const player = this.getPlayer(unit.userId);
    player.hp += 4
  }

  // 心灵巫师
  magicWizard(unit) {
    const player = this.getPlayer(unit.userId);
    const enemy = this.getEnemy(unit.userId);
    const isAI = player.isAI;
    const units = enemy.units;
    const index = this.getRandomIndexByList(units)
    if (index !== null) {
      if (units[index]) {
        units[index] = null
      }
      const targetKey = player.units.findIndex(item => item === null)
      const canCreateUnitList = getUnitList(2).filter(unit => unit && unit.unit_id !== 12);
      const num = getRandomNum(canCreateUnitList.length)
      const unitAreaList = isAI ? getAIUnitAreaList() : getUnitAreaList();
      const unit_id = canCreateUnitList[num].unit_id;
      player.createUnitForFree(unit_id, targetKey, unitAreaList[targetKey].x, unitAreaList[targetKey].y)
    }
  }

  getEnemy = (userId) => {
    return window.scene.players.find(player => player.userId !== userId)
  }

  getPlayer = (userId) => {
    return window.scene.players.find(player => player.userId === userId)
  }

  // 减少血量
  reduceHp(unit, count) {
    if (unit.hp <= count) {
      return null
    }
    unit.hp -= count
    return unit;
  }
}