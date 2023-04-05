import { getCanCreateBuildings, getCanCreateUnits, handlePlayerHasCreateUnit, getEnemy, getRandomNum } from "../util.js";
import Player from "../player.js"
import { GRID_WIDTH, GRID_HEIGHT, GRID_MARGGIN, screenWidth, screenHeight } from '../../../constant/area.js'
import { MAGIC_BUILDING_MODE, MAGIC_UNIT_MODE } from '../../race/magic/mode.js'
import { FIRE_MODE } from '../../race/index.js'
import Effect from "../effect.js";
const AI_FIRE_MODE = [{
  race_id: 2,
  mode: {
    NORMAL: 0,
    PHARAOH: 3,
  },
  // modeKey: ['PHARAOH'],
  modeKey: ['NORMAL', 'PHARAOH'],
}]
const ROUNDEND_TIMEOUT = 2000;
export default class AI extends Player {
  constructor(raceId, userId) {
    super(raceId, userId);
    this.isAI = true;
    this.roundEndTimeout = null;
    const modeItem = AI_FIRE_MODE.find(mode => mode.race_id === raceId)
    const fireModeNum = getRandomNum(modeItem.modeKey.length);
    const key = modeItem.modeKey[fireModeNum]
    this.fireMode = modeItem.mode[key]
  }

  // 电脑回合开始
  AIInit() {
    try {
      clearTimeout(this.roundEndTimeout);
      this.roundEndTimeout = null;
      this.AIRunLoop = true;
      this.AIBuildLoop = true;
      this.AIUnitsGridInit();
      this.magicAIOperation()
      // 心灵女巫发动效果，增加单位，再次发动
      let magicWizardLen = this.units.filter(unit => unit && unit.unit_id === 11);
      if (magicWizardLen.length === 0) {
        this.AIEffect();
      } else {
        this.magicAIEffect(magicWizardLen);
      }
      this.AIEffect();
      const max_af = this.getMaxAf();
      for (let i = 0; i < max_af; i++) {
        this.AIAttack();
      }
      this.AIRoundEnd();
    } catch (err) {
      console.error(err)
    }
  }

  magicAIEffect(len) {
    for (let i = 0; i < len + 1; i++) {
      this.AIEffect();
    }
    const newMagicWizard = this.units.filter(unit => unit && unit.unit_id === 11 && unit.isUseEffect === false);
    if (newMagicWizard.length) {
      this.magicAIEffect(newMagicWizard.length)
    }
  }

  // 魔法学院建筑处理
  magicAICreateBuildings() {
    // 普通模式，建筑一个建筑物，然后创造一个单位，然后建筑下一个建筑物
    if (this.fireMode === FIRE_MODE.PHARAOH) {
      const PHARAOH_TOWER_ID = 8;
      const TEACHING_BUILDING = 1;
      while (this.AIBuildLoop) {
        // 可以创建但是还没创建
        const canCreateBuildingsList = getCanCreateBuildings(this);
        const nowBuildingsIds = this.buildings.map(item => item && item.building_id)
        let sortCanCreateBuildingsList = canCreateBuildingsList.sort((a, b) => {
          return b.weight - a.weight
        })
        // 创建格子索引
        const createIndex = this.buildings.findIndex(item => item === null);
        // 法师塔
        const pharaohTower = canCreateBuildingsList.find(building => building.building_id === PHARAOH_TOWER_ID);
        // 教学楼
        const teachBuilding = canCreateBuildingsList.find(building => building.building_id === TEACHING_BUILDING);
        if (createIndex <= -1) {
          this.AIBuildLoop = false
          return;
        }
        // 如果存在法师塔，而教学楼没满
        if (pharaohTower && !this.buildingsIsLimit(TEACHING_BUILDING) && this.energy >= teachBuilding.energy) {
          this.createBuilding(teachBuilding.building_id, createIndex, -1, -1);
          continue
        }
        const canCreateButNotGetBuild = sortCanCreateBuildingsList.find(building => !nowBuildingsIds.includes(building.building_id));
        if (canCreateButNotGetBuild && this.energy >= canCreateButNotGetBuild.energy) {
          if (this.buildingsIsLimit(canCreateButNotGetBuild.building_id)) {
            this.AIBuildLoop = false
            return
          }
          this.createBuilding(canCreateButNotGetBuild.building_id, createIndex, -1, -1)
          continue
        } else {
          this.AIBuildLoop = false;
        }
      }
      return
    }
    if (this.fireMode === FIRE_MODE.NORMAL) {
      this.AICreateBuildings()
      return
    }
  }

  // 魔法学院创建单位
  magicAICreateUnit() {
    if (!this.isCanCreate()) return;
    if (this.fireMode === FIRE_MODE.PHARAOH) {
      const createMaxUnitList = MAGIC_UNIT_MODE[this.fireMode]
      canCreateUnits = canCreateUnits.filter(item => item.count > 0)
      canCreateUnits = canCreateUnits.sort((a, b) => {
        const bWeight = (createMaxUnitList.find(item => item.unit_id === b.unit_id)).weight;
        const aWeight = (createMaxUnitList.find(item => item.unit_id === a.unit_id)).weight;
        return bWeight - aWeight
      })
      if (canCreateUnits && canCreateUnits.length) {
        let shouldCloseLoop = true;
        for (let i = 0; i < canCreateUnits.length; i++) {
          const unit = canCreateUnits[i];
          const { createMax } = createMaxUnitList.find(item => item.unit_id === unit.unit_id)
          const createCount = (this.units.filter(item => item && item.unit_id === unit.unit_id)).length
          if (createCount >= createMax) {
            continue
          }
          if (this.energy >= unit.energy) {
            const createIndex = this.units.findIndex(item => item === null);
            if (createIndex > -1) {
              shouldCloseLoop = false;
              this.createUnit(unit.unit_id, createIndex, this.AIUnitAreaList[createIndex].x, this.AIUnitAreaList[createIndex].y)
              handlePlayerHasCreateUnit(this, unit.unit_id)
            } else {
              // 没格子结束循环
              shouldCloseLoop = true
            }
          } else {
            // 没能源值结束循环
            shouldCloseLoop = true
          }
        }
        if (shouldCloseLoop) {
          this.AIRunLoop = false;
        }
      }
    }
    if (this.fireMode === FIRE_MODE.NORMAL) {
      this.AICreateUnit()
      return
    }
  }

  // 魔法学院建筑和单位运营处理
  magicAICreate() {
    while (this.AIRunLoop) {
      this.magicAICreateBuildings()
      this.magicAICreateUnit()
    }
  }

  // 魔法学院运营
  magicAIOperation() {
    this.magicAItower();
    this.magicAICreate();
  }

  // 魔法学院能源塔运营
  magicAItower() {
    if (this.fireMode === FIRE_MODE.PHARAOH) {
      this.AItower(10)
      return
    }
    if (this.fireMode === FIRE_MODE.NORMAL) {
      this.AItower(10)
      return
    }
  }

  // AI对能源塔的处理
  AItower(TOWER_MIN_LIMIT = 5) {
    const TOWER_ENERGY = 2;
    let hasBuildTowerLen = (this.towers.filter(tower => !!tower)).length;
    // 如果AI能源塔一直都没有建完10个而且有能力购买能源塔
    for (let i = 0; i < this.towers.length; i++) {
      const towerGrid = this.towers[i];
      if (towerGrid === null && this.energy >= TOWER_ENERGY) {
        this.createTower(i, -1, -1);
        hasBuildTowerLen++
        if (hasBuildTowerLen > TOWER_MIN_LIMIT) {
          break;
        }
      }
    }
  }

  // AI单位发动效果
  AIEffect() {
    this.units.forEach(unit => {
      if (unit && unit.effect === 'onClick' && unit.isUseEffect === false) {
        unit.onEffect()
      }
    })
  }

  // AI定义单位格子初始化
  AIUnitsGridInit() {
    this.AIUnitAreaList = [];
    const x = 20
    const y = (screenHeight / 2 - 180);
    for (let i = 0; i < 18; i++) {
      let realY = y + 10
      let realX = (x + 20) + ((GRID_WIDTH + GRID_MARGGIN) * i)
      if (i > 5 && i < 12) {
        realY = y + 20 + GRID_WIDTH;
        realX = (x + 20) + ((GRID_WIDTH + GRID_MARGGIN) * (i - 6))
      } else if (i > 11) {
        realY = y + 10 + (10 + GRID_WIDTH) * 2;
        realX = (x + 20) + ((GRID_WIDTH + GRID_MARGGIN) * (i - 12))
      }
      let unitArea = {
        x: realX,
        y: realY,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      }
      this.AIUnitAreaList.push(unitArea)
    }
  }

  AICreateBuildings() {
    // 普通模式，建筑一个建筑物，然后创造一个单位，然后建筑下一个建筑物
    const canCreateBuildingsList = getCanCreateBuildings(this);
    const nowBuildingsIds = this.buildings.map(item => item && item.building_id)
    const sortCanCreateBuildingsList = canCreateBuildingsList.sort((a, b) => {
      return b.weight - a.weight
    })
    // 可以创建但是还没创建
    const canCreateButNotGetBuild = canCreateBuildingsList.find(building => !nowBuildingsIds.includes(building.building_id));
    if (canCreateButNotGetBuild && this.energy >= canCreateButNotGetBuild.energy) {
      const createIndex = this.buildings.findIndex(item => item === null);
      if (createIndex > -1 && !this.buildingsIsLimit(canCreateButNotGetBuild.building_id)) {
        this.createBuilding(canCreateButNotGetBuild.building_id, createIndex, -1, -1)
      }
    } else if (sortCanCreateBuildingsList.length) {
      for (let i = 0; i < sortCanCreateBuildingsList.length; i++) {
        const item = sortCanCreateBuildingsList[i];
        if (this.energy >= item.energy) {
          if (this.buildingsIsLimit(item.building_id)) continue
          const createIndex = this.buildings.findIndex(item => item === null)
          if (createIndex < 0) continue
          this.createBuilding(item.building_id, createIndex, -1, -1);
          break
        }
      }
    }
  }

  AICreateUnit() {
    let canCreateUnits = getCanCreateUnits(this);
    canCreateUnits = canCreateUnits.filter(item => item.count > 0)
    canCreateUnits = canCreateUnits.sort((a, b) => {
      return b.weight - a.weight
    })
    if (canCreateUnits && canCreateUnits.length) {
      const unit = canCreateUnits[0];
      if (this.energy >= unit.energy) {
        const createIndex = this.units.findIndex(item => item === null);
        if (createIndex > -1) {
          this.createUnit(unit.unit_id, createIndex, this.AIUnitAreaList[createIndex].x, this.AIUnitAreaList[createIndex].y)
          handlePlayerHasCreateUnit(this, unit.unit_id)
        } else {
          this.AIRunLoop = false
        }
      } else {
        this.AIRunLoop = false
      }
    } else {
      this.AIRunLoop = false
    }
  }

  // AI攻击玩家
  AIAttack() {
    const AIUnits = this.units;
    for (let i = 0; i < AIUnits.length; i++) {
      let aiUnit = AIUnits[i];
      if (!aiUnit) {
        continue
      }
      if (aiUnit.af <= 0) {
        continue
      }
      const enemy = this.getEnemy()
      const enemyUnits = enemy.units.filter(unit => !!unit && unit.isDestory === false);
      // 优先级1： 寻找权重比他低，并且能击杀，并且不被反杀的单位对象
      let enemyUnitTarget = enemyUnits.find(enemyUnit => enemyUnit && aiUnit.weight < enemyUnit.weight && aiUnit.atk >= enemyUnit.hp && aiUnit.hp > enemyUnit.atk);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      // 优先级2： 寻找权重比他低，并且能击杀的单位对象
      enemyUnitTarget = enemyUnits.find(enemyUnit => enemyUnit && aiUnit.weight < enemyUnit.weight && aiUnit.atk >= enemyUnit.hp);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      // 优先级3： 寻找能击杀，并且不被反杀的单位对象
      enemyUnitTarget = enemyUnits.find(enemyUnit => enemyUnit && aiUnit.atk >= enemyUnit.hp && aiUnit.hp > enemyUnit.atk);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      // 优先级4： 寻找能击杀的对象
      enemyUnitTarget = enemyUnits.find(enemyUnit => enemyUnit && aiUnit.atk >= enemyUnit.hp);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      // 优先级6： 寻找能攻击的对象
      enemyUnitTarget = enemyUnits.find(enemyUnit => !!enemyUnit);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      // 优先级5： 寻找权重比他低，并且不会被击杀的对象
      enemyUnitTarget = enemyUnits.find(enemyUnit => enemyUnit && aiUnit.weight < enemyUnit.weight && aiUnit.hp > enemyUnit.atk);
      if (enemyUnitTarget) {
        aiUnit.attack(enemyUnitTarget)
        continue
      }
      aiUnit.attackPlayer(enemy)
    }
  }

  // AI回合结束
  AIRoundEnd() {
    this.roundEndTimeout = setTimeout(() => {
      window.scene.playerRoundStart();
      clearTimeout(this.roundEndTimeout);
      this.roundEndTimeout = null;
    }, ROUNDEND_TIMEOUT)
  }

  // 获取对方玩家对象
  getEnemy() {
    return window.scene.players.find(player => player.userId !== this.userId)
  }

  // 获取当前最大可攻击次数
  getMaxAf() {
    let max_af = 0;
    this.units.forEach(unit => {
      if (unit && unit.af > max_af) {
        max_af = unit.af
      }
    })
    return max_af;
  }

  // 根据可创建次数判断是否可以创建单位
  isCanCreate() {
    let canCreateByCount = 0;
    let canCreateUnits = getCanCreateUnits(this);
    canCreateUnits.forEach(unit => {
      if (unit) {
        canCreateByCount += unit.count;
      }
    })
    if(canCreateByCount === 0) {
      this.AIRunLoop = false
      return false
    }
    return true
  }

  // 判断建筑是否已经超过创建最大值
  buildingsIsLimit(buildingId) {
    const list = this.buildings.filter(item => item && item.building_id === buildingId)
    const buildingCreateMaxList = MAGIC_BUILDING_MODE[this.fireMode]
    const { createMax } = (buildingCreateMaxList.find(building => building.building_id === buildingId))
    if (list.length >= createMax) {
      return true;
    }
    return false
  }
}