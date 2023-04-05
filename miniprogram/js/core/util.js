import Store from '../core/store.js'
import { getBuildingList, getUnitList } from '../race/index.js';

var timer = null;

// 获取骰子随机能量
export const getRandomEnergy = () => {
  return getRandomNum(6) + 1;
}

// 过滤玩家阵亡单位
export const destroyUnit = (player) => {
  const units = player.units.filters(unit => unit.isDestory);
  player.units = units;
  return player;
}

// 过滤玩家阵亡建筑
export const destroyBuilding = (player) => {
  const buildings = player.buildings.filters(unit => unit.isDestory);
  player.buildings = buildings;
  return player;
}

// 生成随机UUID
export const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
* 判断手指是否在指定对象上
* @param {Number} x: 手指的X轴坐标
* @param {Number} y: 手指的Y轴坐标
* @param {Object} obj: 指定对象
* @return {Boolean}: 用于标识手指是否在指定对象上的布尔值
*/
export const checkIsFingerOnObj = (x, y, obj) => {
  // 误差值
  const deviation = 2
  return !!(x >= obj.x - deviation
    && y >= obj.y - deviation
    && x <= obj.x + obj.width + deviation
    && y <= obj.y + obj.height + deviation)
}

// 异步获取图片
export const promiseGetImage = (imageSrc) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = imageSrc
    img.onload = () => {
      resolve(img)
    }
  })
}

// 获取当前玩家信息
export const getPlayer = (scene) => {
  return scene.players.find(player => player.userId === Store.userId)
}

// 获取对方玩家信息
export const getEnemy = (scene) => {
  return scene.players.find(player => player.userId !== Store.userId)
}

// 获取对方玩家信息根据id
export const getPlayerById = (userId) => {
  return window.scene.players.find(player => player.userId === userId)
}

// 根据raceId获取单位列表
export const getCanCreateUnits = (player) => {
  const arr = [];
  const raceId = player.raceId;
  const playerBuildings = player.buildings;
  const unitList = getUnitList(raceId);
  let openUnitIds = [];
  playerBuildings.forEach(build => {
    if (build && build.openUnitIds && build.openUnitIds.length) {
      openUnitIds = openUnitIds.concat(build.openUnitIds)
    }
  })
  openUnitIds.forEach(unitId => {
    const unit = unitList.find(item => item.unit_id === unitId)
    const resIndex = arr.findIndex(item => item.unit_id === unit.unit_id);
    if (unit) {
      if (resIndex > -1) {
        arr[resIndex].count++
      } else {
        arr.push({
          ...unit,
          count: 1
        })
      }
    }
  })
  arr.forEach(item => {
    const findHasCreateUnit = player.hasCreateUnitIds.find(hasCreateUnit => hasCreateUnit.unit_id === item.unit_id)
    if (findHasCreateUnit && findHasCreateUnit.count) {
      item.count = item.count - findHasCreateUnit.count
      if (item.count < 0) item.count = 0
    }
  })
  return arr;
}

// 根据raceId获取可创建建筑列表
export const getCanCreateBuildings = (player) => {
  const arr = [];
  const raceId = player.raceId;
  const playerBuildings = player.buildings;
  const buildingsList = getBuildingList(raceId);
  // 第一个一定可以创建
  arr.push(buildingsList[0])
  let openBuildingIds = [];
  playerBuildings.forEach(build => {
    if (build && build.openBuildingIds && build.openBuildingIds.length) {
      openBuildingIds = openBuildingIds.concat(build.openBuildingIds)
    }
  })
  openBuildingIds.forEach(buildingId => {
    const building = buildingsList.find(item => item.building_id === buildingId)
    if (building) {
      const resIndex = arr.findIndex(item => item.building_id === building.building_id);
      if (resIndex < 0) {
        arr.push(building)
      }
    }
  })
  return arr;
}

// 用户本回合创建的单位
export const handlePlayerHasCreateUnit = (player, choice_unit_id) => {
  const index = player.hasCreateUnitIds.findIndex(item => item.unit_id === choice_unit_id);
  if (index > - 1) {
    player.hasCreateUnitIds[index].count++
  } else {
    player.hasCreateUnitIds.push({
      unit_id: choice_unit_id,
      count: 1
    })
  }
}

// 判断是否当前用户回合
export const isMyTurn = () => {
  return window.scene.actionId === Store.userId
}

// 获取随机数字
export const getRandomNum = (len) => {
  return Math.floor(Math.random() * len);
}

// 获取建筑解锁建筑名称
export const getOpenBuildingName = (raceId, buildingId) => {
  let resText = '';
  const buildingList = getBuildingList(raceId);
  const findBuilding = buildingList.find(building => building && building.building_id === buildingId);
  const openBuildingIds = findBuilding.openBuildingIds;
  openBuildingIds.forEach(id => {
    const item = buildingList.find(building => building && building.building_id === id);
    resText += item.name + ';'
  })
  return resText || '无';
}

// 获取建筑解锁单位名称
export const getOpenUnitName = (raceId, buildingId) => {
  let resText = '';
  const buildingList = getBuildingList(raceId);
  const unitList = getUnitList(raceId);
  const findBuilding = buildingList.find(building => building && building.building_id === buildingId);
  const openUnitIds = findBuilding.openUnitIds;
  openUnitIds.forEach(id => {
    const item = unitList.find(unit => unit && unit.unit_id === id);
    resText += item.name + ';'
  })
  return resText || '无';
}

// 获取当前canvas
export const getCanvas = () => {
  if (canvas) return canvas;
  let canvas = document.getElementById('game');
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;
  return canvas
}

// 弹出提示
export const showToast = (obj) => {
  if (window.wx) {
    wx.showToast(obj)
    return
  }
  document.getElementById('toast').style.visibility="visible";
  document.getElementById('toast').innerText = obj.title;
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.getElementById('toast').style.visibility="hidden";
  }, 1500)
}