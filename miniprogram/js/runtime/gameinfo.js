import { checkIsFingerOnObj, getPlayer, getCanCreateUnits, getCanCreateBuildings, getEnemy, handlePlayerHasCreateUnit, isMyTurn, getOpenBuildingName, getOpenUnitName, showToast } from '../core/util.js'
import { drawRadiusRect, drawToCanvas, drawCenterText, drawAlignCenterTextOnObj, drawCenterTextOnObj, drawUnitToCanvas, getUnitAreaList } from '../core/render.js'
import { GRID_WIDTH, GRID_HEIGHT, GRID_MARGGIN, screenWidth, screenHeight, COLOR_ENUM, BUTTON_HEIGHT, BUTTON_WIDTH } from '../../constant/area.js'
import Store from '../core/store.js'

const RENDER_UNIT_TYPE = {
  MYSELF: 1,
  ENEMY: 2,
  OTHER: 3,
}

const CHOICE_KEY_LIST = [
  'choiceCreateBuild',
  'choiceCreateUnit',
  'choiceMyUnit',
]

export default class GameInfo {
  constructor() {
    this.showBuildArea = false;
    this.showTowerArea = false;
    this.hasEventBind = false;
    this.showCreateUnit = false;
    this.choiceCreateBuild = null;
    this.choiceCreateUnit = null;
    this.choiceMyUnit = null;
    this.choiceMyBuilding = null;
  }

  // 渲染我方单位格子
  renderMySelfUnitGrid(ctx) {
    // 单位区域
    const x = 20
    const y = (screenHeight / 2 + 30);
    const width = (screenWidth - 40);
    const height = 160;
    this.renderBorad(ctx, x, y, width, height)
    this.unitAreaList = getUnitAreaList()
    for (let i = 0; i < this.unitAreaList.length; i++) {
      this.renderCircle(ctx, this.unitAreaList[i].x, this.unitAreaList[i].y, GRID_WIDTH, GRID_HEIGHT)
    }
  }

  // 渲染敌方单位区域
  renderEnemyUnit(ctx) {
    const x = 20
    const y = (screenHeight / 2 - 180);
    const width = (screenWidth - 40);
    const height = 160;
    this.renderBorad(ctx, x, y, width, height)
    const enemy = getEnemy(this.scene)
    this.enemyUnitAreaList = []
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
      this.enemyUnitAreaList.push(unitArea)
      this.renderCircle(ctx, realX, realY, GRID_WIDTH, GRID_HEIGHT)

      // 渲染敌方单位
      if (enemy.units && enemy.units.length) {
        const enemyUnit = enemy.units[i]
        if (enemyUnit) {
          drawUnitToCanvas(ctx, enemyUnit)
        }
      }
    }
  }

  // 渲染我方建筑格子
  renderMySelfBuildingGrid(ctx) {
    // 建筑区域
    const x = 0
    const y = screenHeight - 270
    this.renderBorad(ctx, x, y, screenWidth, 270)
    this.renderBuildingAreaCancel(ctx)
    this.buildingAreaList = [];
    for (let i = 0; i < 28; i++) {
      let realY = y
      let realX = x + ((GRID_WIDTH + GRID_MARGGIN) * i)
      if (i > 6 && i < 14) {
        realY = y + 10 + GRID_WIDTH;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 7))
      } else if (i > 13 && i < 21) {
        realY = y + 20 + GRID_WIDTH * 2;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 14))
      } else if (i > 20) {
        realY = y + 30 + GRID_WIDTH * 3;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 21))
      }
      this.renderCircle(ctx, (realX + 10), (realY + 50), GRID_WIDTH, GRID_HEIGHT)
      let buildingsObj = {
        x: (realX + 10),
        y: (realY + 50),
        width: GRID_WIDTH,
        height: GRID_HEIGHT
      }
      this.buildingAreaList.push(buildingsObj)
    }
    ctx.font = '20px 宋体';
    ctx.fillStyle = 'white';
    drawCenterText(ctx, '请选择一个格子放置选择的建筑', y + 30)
  }

  // 渲染我方能源塔格子
  renderMySelfTowerGrid(ctx) {
    // 建筑区域
    const x = 0
    const y = screenHeight - 150
    this.renderBorad(ctx, x, y, screenWidth, 150)
    this.renderTowerAreaCancel(ctx)
    this.towerAreaList = [];
    for (let i = 0; i < 10; i++) {
      let realY = y - 30
      let realX = x + ((GRID_WIDTH + GRID_MARGGIN) * i)
      if (i > 4) {
        realY = y - 20 + GRID_WIDTH;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 5))
      }
      const renderX = (realX + 60)
      const renderY = (realY + 60)
      this.renderCircle(ctx, renderX, renderY, GRID_WIDTH, GRID_HEIGHT)
      this.towerAreaList.push({
        x: renderX,
        y: renderY,
        width: GRID_WIDTH,
        height: GRID_HEIGHT
      })
    }

    const player = getPlayer(this.scene)
    player.towers.forEach(tower => {
      if (tower) {
        ctx.drawImage(
          Store.getImage('tower_icon'),
          tower.x,
          tower.y,
          GRID_WIDTH,
          GRID_HEIGHT
        )
      }
    })
  }

  // 渲染建筑区域删除按钮
  renderBuildingAreaCancel(ctx) {
    this.buildingAreaCancelBtn = {
      x: screenWidth - 40,
      y: screenHeight - 260,
      width: 20,
      height: 20
    }
    ctx.drawImage(
      Store.getImage('cancel_img'),
      this.buildingAreaCancelBtn.x,
      this.buildingAreaCancelBtn.y,
      this.buildingAreaCancelBtn.width,
      this.buildingAreaCancelBtn.height
    )
  }

  // 渲染建筑区域删除按钮
  renderTowerAreaCancel(ctx) {
    this.towerAreaCancelBtn = {
      x: screenWidth - 40,
      y: screenHeight - 140,
      width: 20,
      height: 20
    }
    ctx.drawImage(
      Store.getImage('cancel_img'),
      this.towerAreaCancelBtn.x,
      this.towerAreaCancelBtn.y,
      this.towerAreaCancelBtn.width,
      this.towerAreaCancelBtn.height
    )
  }

  renderCreateUnitAreaCancel(ctx) {
    this.createUnitAreaCancelBtn = {
      x: 20,
      y: 36,
      width: 20,
      height: 20
    }
    ctx.drawImage(
      Store.getImage('cancel_img'),
      this.createUnitAreaCancelBtn.x,
      this.createUnitAreaCancelBtn.y,
      this.createUnitAreaCancelBtn.width,
      this.createUnitAreaCancelBtn.height
    )
  }

  // 游戏场景画布点击区域代码
  touchEventGameHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    let player = getPlayer(this.scene)
    let enemy = getEnemy(this.scene);
    if (this.scene.gameOver) {
      if (this.backIndexBtn && checkIsFingerOnObj(x, y, this.backIndexBtn)) {
        this.scene.sceneType = 'index';
        this.scene.gameOver = false;
      }
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return
    }
    if (this.isUnShowUnitModal() && !this.showCreateUnit && !this.showBuildArea && checkIsFingerOnObj(x, y, this.surrenderBtn)) {
      this.scene.winner = enemy.userId;
      this.scene.gameOver = true;
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return
    }

    // 查看敌方单位
    if (!this.showCreateUnit && !this.choiceMyUnit && !this.showTowerArea && !this.showBuildArea) {
      for (let i = 0; i < this.enemyUnitAreaList.length; i++) {
        const enemyUnit = this.enemyUnitAreaList[i]
        if (enemyUnit && checkIsFingerOnObj(x, y, enemyUnit)) {
          if (enemy.units[i]) {
            this.choiceEnemyUnit = enemy.units[i];
            this.removeCanvasGameListener()
            this.hasEventBind = false
            return
          }
        }
      }
    }

    // 关闭选择单位弹窗
    if ((this.choiceMyUnit || this.choiceEnemyUnit || this.choiceCreateUnit) && this.unitInfoCancelBtnArea && checkIsFingerOnObj(x, y, this.unitInfoCancelBtnArea)) {
      this.choiceEnemyUnit = null;
      this.choiceMyUnit = null;
      this.choiceCreateUnit = null;
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return
    }

    // 对方回合所有点击效果失效
    if (!isMyTurn()) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return;
    }

    // 发动效果
    if (this.effectBtnArea && this.choiceMyUnit && checkIsFingerOnObj(x, y, this.effectBtnArea)) {
      const unit = player.units.find(item => item && item.id === this.choiceMyUnit.id);
      if (unit && !unit.isUseEffect) {
        unit.onEffect()
        this.choiceMyUnit.isUseEffect = true
      }
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return
    }

    if (this.choiceMyUnit) {
      const unit = player.units.find(item => item && item.id === this.choiceMyUnit.id);
      if (unit) {
        if (this.showEnemyHpBtnArea && checkIsFingerOnObj(x, y, this.showEnemyHpBtnArea)) {
          unit.attackPlayer(enemy)
          this.removeCanvasGameListener()
          this.hasEventBind = false
          this.choiceMyUnit = null
          return
        }
        for (let i = 0; i < this.enemyUnitAreaList.length; i++) {
          const enemyUnit = this.enemyUnitAreaList[i]
          if (enemyUnit && checkIsFingerOnObj(x, y, enemyUnit)) {
            const enemyUnit = enemy.units[i];
            if (enemyUnit) {
              unit.attack(enemyUnit)
              this.choiceMyUnit = null
              this.removeCanvasGameListener()
              this.hasEventBind = false
              return
            }
          }
        }
      }
    }

    // 关闭能源塔弹窗
    if (this.towerAreaCancelBtn && checkIsFingerOnObj(x, y, this.towerAreaCancelBtn)) {
      this.showTowerArea = false
      this.removeCanvasGameListener()
      this.hasEventBind = false
      return
    }

    // 关闭建筑区域弹窗
    if (!this.showTowerArea && this.buildingAreaCancelBtn && checkIsFingerOnObj(x, y, this.buildingAreaCancelBtn)) {
      this.showBuildArea = false
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.choiceCreateBuild = null;
      this.choiceMyBuilding = null;
      return
    }

    // 回合结束按钮
    if (!this.showCreateUnit && !this.showBuildArea && !this.showTowerArea && this.roundEndBtnArea && checkIsFingerOnObj(x, y, this.roundEndBtnArea)) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.scene.playerRoundStart()
      return
    }

    // 展示建筑物弹窗
    if (this.isUnShowUnitModal() && !this.showBuildArea && !this.showTowerArea && this.showBuildingAreaBtn && checkIsFingerOnObj(x, y, this.showBuildingAreaBtn)) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.showBuildArea = true
      this.showCreateUnit = false
      this.showTowerArea = false
      this.choiceEnemyUnit = null;
      this.choiceCreateUnit = null;
      this.choiceMyUnit = null;
      return
    }

    // 展示能源塔弹窗弹窗
    if (this.isUnShowUnitModal() && !this.showBuildArea && !this.showTowerArea && this.showTowerAreaBtn && checkIsFingerOnObj(x, y, this.showTowerAreaBtn)) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.showTowerArea = true
      this.showCreateUnit = false
      this.showBuildArea = false
      return
    }

    // 展示单位弹窗
    if (this.isUnShowUnitModal() && !this.showBuildArea && !this.showTowerArea && this.showUnitAreaBtn && checkIsFingerOnObj(x, y, this.showUnitAreaBtn)) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.showCreateUnit = true
      this.showTowerArea = false
      this.showBuildArea = false
      return
    }

    // 关闭单位弹窗
    if (!this.showTowerArea && this.createUnitAreaCancelBtn && checkIsFingerOnObj(x, y, this.createUnitAreaCancelBtn)) {
      this.removeCanvasGameListener()
      this.hasEventBind = false
      this.showCreateUnit = false
      this.choiceCreateUnit = null;
      return
    }

    // 选择建筑物体
    if (this.showBuildArea) {
      for (let i = 0; i < this.canCreateBuildsList.length; i++) {
        const canCreateBuild = this.canCreateBuildsList[i]
        if (canCreateBuild && checkIsFingerOnObj(x, y, canCreateBuild)) {
          this.removeCanvasGameListener()
          this.hasEventBind = false
          this.choiceCreateBuild = canCreateBuild;
          this.choiceMyBuilding = canCreateBuild;
          return
        }
      }
    }

    // 创建建筑
    if (this.showBuildArea) {
      for (let j = 0; j < this.buildingAreaList.length; j++) {
        const buildingGrid = this.buildingAreaList[j]
        if (buildingGrid && checkIsFingerOnObj(x, y, buildingGrid)) {
          // 选择要创建的建筑
          if (this.choiceCreateBuild) {
            const buildingId = this.choiceCreateBuild.building_id;
            const gridHasBuilding = player.buildings.find(building => building && building.x === buildingGrid.x && building.y === buildingGrid.y)
            if (gridHasBuilding) {
              this.choiceMyBuilding = gridHasBuilding;
            } else {
              player.createBuilding(buildingId, j, buildingGrid.x, buildingGrid.y)
            }
            this.removeCanvasGameListener()
            this.hasEventBind = false
            return
          } else {
            const gridHasBuilding = player.buildings.find(building => building && building.x === buildingGrid.x && building.y === buildingGrid.y)
            if (gridHasBuilding) {
              this.choiceMyBuilding = gridHasBuilding;
            }
            this.removeCanvasGameListener()
            this.hasEventBind = false
            return
          }
        }
      }
    }

    // 选择单位
    if (this.showCreateUnit && !this.showTowerArea) {
      for (let i = 0; i < this.canCreateUnitsArea.length; i++) {
        if (this.canCreateUnitsArea[i] && this.canCreateUnitsArea[i].img && checkIsFingerOnObj(x, y, this.canCreateUnitsArea[i])) {
          this.removeCanvasGameListener()
          this.hasEventBind = false
          this.choiceCreateUnit = this.canCreateUnitsArea[i]
          return
        }
      }
    }

    // 创建单位
    if (!this.showTowerArea && !this.showBuildArea) {
      for (let k = 0; k < this.unitAreaList.length; k++) {
        const unitArea = this.unitAreaList[k]
        if (checkIsFingerOnObj(x, y, unitArea)) {
          this.removeCanvasGameListener()
          this.hasEventBind = false
          if (this.choiceCreateUnit) {
            const unitId = this.choiceCreateUnit.unit_id;
            const target = this.canCreateUnitsArea.find(item => item.unit_id === unitId)
            if (target.count <= 0) {
              const errTxt = '当前单位超出创建次数';
              showToast({ icon: 'none', title: errTxt });
              throw new Error(errTxt)
            }
            player.createUnit(unitId, k, unitArea.x, unitArea.y)
            if (this.choiceCreateUnit.count > 0) {
              this.choiceCreateUnit.count -= 1
            }
            handlePlayerHasCreateUnit(player, unitId)
          }
          if (!this.choiceCreateUnit) {
            if (player.units[k] && player.units[k].unit_id) {
              this.choiceMyUnit = {
                width: unitArea.width,
                height: unitArea.height,
                ...player.units[k],
              }
            } else {
              this.choiceMyUnit = null;
            }
          }
          return
        }
      }
    }

    // 创建能源塔
    if (this.showTowerArea) {
      for (let i = 0; i < this.towerAreaList.length; i++) {
        const towerArea = this.towerAreaList[i]
        if (checkIsFingerOnObj(x, y, towerArea)) {
          player.createTower(i, towerArea.x, towerArea.y)
          this.removeCanvasGameListener()
          this.hasEventBind = false
        }
      }
    }
  }

  removeCanvasGameListener() {
    canvas.removeEventListener(
      'touchstart',
      this.touchGameHandler
    )
  }

  renderCreateUnitArea(ctx) {
    // 可现实单位
    const x = 0
    const y = 20
    this.renderBorad(ctx, x, y, screenWidth, 270)
    this.renderCreateUnitAreaCancel(ctx)
    const player = getPlayer(this.scene);
    this.canCreateUnitsArea = getCanCreateUnits(player);
    for (let i = 0; i < 28; i++) {
      let realY = y
      let realX = x + ((GRID_WIDTH + GRID_MARGGIN) * i)
      if (i > 6 && i < 14) {
        realY = y + 10 + GRID_WIDTH;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 7))
      } else if (i > 13 && i < 21) {
        realY = y + 20 + GRID_WIDTH * 2;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 14))
      } else if (i > 20) {
        realY = y + 30 + GRID_WIDTH * 3;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 21))
      }
      let renderX = (realX + 10);
      let renderY = (realY + 50)
      this.renderCircle(ctx, renderX, renderY, GRID_WIDTH, GRID_HEIGHT)
      if (this.canCreateUnitsArea[i]) {
        this.canCreateUnitsArea[i].x = renderX;
        this.canCreateUnitsArea[i].y = renderY;
        this.canCreateUnitsArea[i].width = GRID_WIDTH;
        this.canCreateUnitsArea[i].height = GRID_HEIGHT;
        if (this.canCreateUnitsArea[i].img) {
          drawToCanvas(ctx, this.canCreateUnitsArea[i])
        }
      }
    }

    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText('选择单位放置下方战斗区域', x + 70, y + 30)
  }

  renderCreateBuildingArea(ctx) {
    // 可现实单位
    const x = 0
    const y = 20
    this.renderBorad(ctx, x, y, screenWidth, 270)
    const player = getPlayer(this.scene);
    this.canCreateBuildsList = getCanCreateBuildings(player);

    for (let i = 0; i < 28; i++) {
      let realY = y
      let realX = x + ((GRID_WIDTH + GRID_MARGGIN) * i)
      if (i > 6 && i < 14) {
        realY = y + 10 + GRID_WIDTH;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 7))
      } else if (i > 13 && i < 21) {
        realY = y + 20 + GRID_WIDTH * 2;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 14))
      } else if (i > 20) {
        realY = y + 30 + GRID_WIDTH * 3;
        realX = x + ((GRID_WIDTH + GRID_MARGGIN) * (i - 21))
      }
      this.renderCircle(ctx, (realX + 10), (realY + 50), GRID_WIDTH, GRID_HEIGHT)
      if (this.canCreateBuildsList[i]) {
        this.canCreateBuildsList[i].x = (realX + 10);
        this.canCreateBuildsList[i].y = (realY + 50);
        this.canCreateBuildsList[i].width = GRID_WIDTH;
        this.canCreateBuildsList[i].height = GRID_HEIGHT;
      }
    }
    ctx.font = '20px 宋体';
    ctx.fillStyle = 'white';
    drawCenterText(ctx, '请选择一个需要创建的建筑', y + 30)
  }

  renderRonudEndBtn(ctx) {
    const x = screenWidth - 100;
    const y = 100;
    const width = 80;
    const height = 26;
    this.roundEndBtnArea = {
      x,
      y,
      width,
      height,
    }
    drawRadiusRect(ctx, x, y, width, height, 10)
    ctx.fillStyle = '#993300'
    ctx.fill();
    ctx.font = '14px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText('结束回合', x + 10, y + 17)
  }

  renderSurrender(ctx) {
    const x = 20;
    const y = 60;
    const width = 80;
    const height = 26;
    this.surrenderBtn = {
      x,
      y,
      width,
      height,
    }
    drawRadiusRect(ctx, x, y, width, height, 10)
    ctx.fillStyle = 'red'
    ctx.fill();
    ctx.font = '14px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '投降', {
      x,
      y,
      width,
      height,
    })
  }

  renderUnits(ctx) {
    const player = getPlayer(this.scene)
    player.units.forEach(unit => {
      if (unit) {
        drawUnitToCanvas(ctx, unit);
      }
    })
  }

  rendersBuildings(ctx) {
    const player = getPlayer(this.scene)
    player.buildings.forEach(building => {
      if (building) {
        drawToCanvas(ctx, building);
      }
    })
  }

  renderCanCreateBuildings(ctx) {
    this.canCreateBuildsList.forEach(building => {
      if (building) {
        drawToCanvas(ctx, building);
      }
    })
  }

  renderBuildingAreaBtn(ctx) {
    this.showBuildingAreaBtn = {
      x: 20,
      y: screenHeight - 80,
      width: 64,
      height: 64,
    }
    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, '建筑', this.showBuildingAreaBtn.y - 10, {
      x: this.showBuildingAreaBtn.x,
      width: this.showBuildingAreaBtn.width,
    })
    ctx.drawImage(
      Store.getImage('building_icon'),
      this.showBuildingAreaBtn.x,
      this.showBuildingAreaBtn.y,
      this.showBuildingAreaBtn.width,
      this.showBuildingAreaBtn.height
    )
  }

  renderTowerAreaBtn(ctx) {
    this.showTowerAreaBtn = {
      x: 90,
      y: screenHeight - 80,
      width: 64,
      height: 64,
    }
    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, '能源塔', this.showTowerAreaBtn.y - 10, {
      x: this.showTowerAreaBtn.x,
      width: this.showTowerAreaBtn.width,
    })
    ctx.drawImage(
      Store.getImage('tower_icon'),
      this.showTowerAreaBtn.x,
      this.showTowerAreaBtn.y,
      this.showTowerAreaBtn.width,
      this.showTowerAreaBtn.height
    )
  }

  renderUnitAreaBtn(ctx) {
    this.showUnitAreaBtn = {
      x: 160,
      y: screenHeight - 80,
      width: 64,
      height: 64,
    }
    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, '单位', this.showUnitAreaBtn.y - 10, {
      x: this.showUnitAreaBtn.x,
      width: this.showUnitAreaBtn.width,
    })
    ctx.drawImage(
      Store.getImage('unit_icon'),
      this.showUnitAreaBtn.x,
      this.showUnitAreaBtn.y,
      this.showUnitAreaBtn.width,
      this.showUnitAreaBtn.height
    )
  }

  renderEnergyIcon(ctx) {
    const x = 230;
    const y = screenHeight - 80;
    this.showEnergyIconBtn = {
      x,
      y,
      width: 64,
      height: 64,
    }
    ctx.drawImage(
      Store.getImage('energy_icon'),
      this.showEnergyIconBtn.x,
      this.showEnergyIconBtn.y,
      this.showEnergyIconBtn.width,
      this.showEnergyIconBtn.height
    )

    const player = getPlayer(this.scene)
    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, '能源值', y - 10, {
      x: this.showEnergyIconBtn.x,
      width: this.showEnergyIconBtn.width,
    })

    ctx.font = '32px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, player.energy, y + 40, {
      x: this.showEnergyIconBtn.x,
      width: this.showEnergyIconBtn.width,
    })
  }

  renderHpIcon(ctx) {
    const x = 300;
    const y = screenHeight - 80;
    this.showHpIconBtn = {
      x,
      y,
      width: 64,
      height: 64,
    }
    ctx.drawImage(
      Store.getImage('hp_icon'),
      this.showHpIconBtn.x,
      this.showHpIconBtn.y,
      this.showHpIconBtn.width,
      this.showHpIconBtn.height
    )

    const player = getPlayer(this.scene)

    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, '生命值', y - 10, {
      x: this.showHpIconBtn.x,
      width: this.showHpIconBtn.width,
    })
    ctx.font = '24px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, player.hp, y + 40, {
      x: this.showHpIconBtn.x,
      width: this.showHpIconBtn.width,
    })
  }

  renderEnemyHp(ctx) {
    const x = screenWidth / 2 - 32;
    const y = 60;
    this.showEnemyHpBtnArea = {
      x,
      y,
      width: 64,
      height: 64,
    }

    ctx.drawImage(
      Store.getImage('hp_icon'),
      x,
      y,
      64,
      64
    )
    const player = getEnemy(this.scene)
    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText('敌人生命值', x - 7, y - 10)
    ctx.font = '24px 宋体';
    ctx.fillStyle = 'white';
    drawCenterTextOnObj(ctx, player.hp, y + 40, {
      x: this.showEnemyHpBtnArea.x,
      width: this.showEnemyHpBtnArea.width,
    })
  }

  // 渲染选择单位详情
  renderChoiceUnitInfo(ctx) {
    this.renderUnitInfo(ctx, this.choiceCreateUnit, RENDER_UNIT_TYPE.OTHER)
  }

  // 渲染我方单位详情
  renderMyUnitInfo(ctx) {
    this.renderUnitInfo(ctx, this.choiceMyUnit, RENDER_UNIT_TYPE.MYSELF)
  }

  // 渲染敌方单位详情
  renderEnemyInfo(ctx) {
    this.renderUnitInfo(ctx, this.choiceEnemyUnit, RENDER_UNIT_TYPE.ENEMY)
  }

  renderUnitInfo(ctx, renderUnit, type) {
    const player = getPlayer(this.scene);
    const x = 0
    const y = screenHeight - 120;
    const width = screenWidth;
    const height = 120;
    ctx.drawImage(
      Store.getImage('blackborad'),
      x,
      y,
      width,
      height
    )
    drawRadiusRect(ctx, x, y, width, height)
    ctx.fillStyle = 'black';
    ctx.fill()

    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    const title = type === RENDER_UNIT_TYPE.MYSELF ? '选择对方单位或基地攻击' : (type === RENDER_UNIT_TYPE.ENEMY ? '敌方单位详情' : '创建单位详情')
    drawCenterText(ctx, title, y + 24)
    drawToCanvas(ctx, { ...renderUnit, width: 60, height: 60, x: 0, y: y + 20 })

    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    ctx.fillText(`${renderUnit.name}`, x + 70, y + 56)
    ctx.fillText(`攻击力:${renderUnit.atk}`, x + 70, y + 76)
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.RED;
    ctx.fillText(`生命值:${renderUnit.hp}`, x + 150, y + 56)
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.RED;
    ctx.fillText(`攻击次数:${renderUnit.af}`, x + 150, y + 76)

    if (type === RENDER_UNIT_TYPE.OTHER) {
      ctx.fillStyle = COLOR_ENUM.GREEN;
      ctx.fillText(`可创建次数:${renderUnit.count}次`, x + 240, y + 56)
      ctx.fillStyle = COLOR_ENUM.WHITE;
      ctx.fillText('花费:', x + 240, y + 76)
      const energyWidth = ctx.measureText('花费:').width
      ctx.fillStyle = player.energy >= renderUnit.energy ? COLOR_ENUM.GREEN : COLOR_ENUM.RED;
      ctx.fillText(`${renderUnit.energy}`, x + energyWidth + 240, y + 76)
    } else {
      ctx.fillStyle = COLOR_ENUM.GREEN;
      ctx.fillText(`状态:${renderUnit.isWait ? '沉睡' : '可行动'}`, x + 240, y + 56)
    }

    if (type === RENDER_UNIT_TYPE.MYSELF && renderUnit.effect === 'onClick') {
      this.effectBtnArea = {
        x: x,
        y: y + 90,
        width: 60,
        height: 20,
      }
      drawRadiusRect(ctx, this.effectBtnArea.x, this.effectBtnArea.y, this.effectBtnArea.width, this.effectBtnArea.height, 10)
      ctx.fillStyle = renderUnit.isUseEffect ? 'grey' : 'skyblue';
      ctx.fill();

      ctx.font = '12px 宋体';
      ctx.fillStyle = 'white';
      ctx.fillText('发动效果', this.effectBtnArea.x + 6, this.effectBtnArea.y + 14)
      ctx.font = '12px 宋体';
      ctx.fillStyle = 'white';
      ctx.fillText(`${renderUnit.effect_des}`, this.effectBtnArea.x + 70, this.effectBtnArea.y + 14)
    }
    if (renderUnit.effect === 'onShow' || type === RENDER_UNIT_TYPE.ENEMY && renderUnit.effect) {
      ctx.font = '12px 宋体';
      ctx.fillStyle = 'white';
      const text = `效果:${renderUnit.effect_des}`;
      drawCenterTextOnObj(ctx, text, y + 104, {
        x: 0,
        width: screenWidth
      })
    }

    this.unitInfoCancelBtnArea = {
      x: screenWidth - 40,
      y: y + 10,
      width: 24,
      height: 24,
    }
    ctx.drawImage(
      Store.getImage('cancel_img'),
      this.unitInfoCancelBtnArea.x,
      this.unitInfoCancelBtnArea.y,
      this.unitInfoCancelBtnArea.width,
      this.unitInfoCancelBtnArea.height
    )
  }

  renderRoundTips(ctx) {
    const x = 20;
    const y = 100;
    const width = 80;
    const height = 26;
    drawRadiusRect(ctx, x, y, width, height, 10)
    ctx.fillStyle = '#993300'
    ctx.fill();
    ctx.font = '14px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText(isMyTurn() ? '我的回合' : '对方回合', x + 10, y + 17)
  }

  // 渲染背景
  renderBackground(ctx) {
    const x = 0;
    const y = 0;
    ctx.drawImage(
      Store.getImage('bg'),
      x,
      y,
      screenWidth,
      screenHeight
    )
  }

  renderCircle(ctx, x, y, width, height) {
    ctx.drawImage(
      Store.getImage('circle'),
      x,
      y,
      width,
      height
    )
  }

  renderBorad(ctx, x, y, width, height) {
    ctx.drawImage(
      Store.getImage('blackborad'),
      x,
      y,
      width,
      height
    )
  }

  renderBuildingInfo(ctx) {
    const player = getPlayer(this.scene)
    const x = 0
    const y = screenHeight / 2 - 60;
    const width = screenWidth;
    const height = 100;
    drawRadiusRect(ctx, x, y, width, height)
    ctx.fillStyle = 'black';
    ctx.fill();
    drawToCanvas(ctx, {
      img: this.choiceMyBuilding.img,
      x: 20,
      y: y + 20,
      width: 80,
      height: 80
    })

    ctx.font = '16px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText(`名称:${this.choiceMyBuilding.name}`, x + 105, y + 40)
    ctx.fillText('花费:', x + 105, y + 60)
    const energyWidth = ctx.measureText('花费:').width
    ctx.fillStyle = player.energy >= this.choiceMyBuilding.energy ? COLOR_ENUM.GREEN : COLOR_ENUM.RED;
    ctx.fillText(`${this.choiceMyBuilding.energy}`, x + energyWidth + 105, y + 60)
    ctx.fillStyle = COLOR_ENUM.WHITE;
    ctx.fillText(`解锁建筑:${getOpenBuildingName(this.choiceMyBuilding.raceId, this.choiceMyBuilding.building_id)}`, x + 105, y + 80)
    ctx.fillText(`解锁单位:${getOpenUnitName(this.choiceMyBuilding.raceId, this.choiceMyBuilding.building_id)}`, x + 105, y + 100)
  }

  render(ctx, scene) {
    this.scene = scene;
    // 背景
    if (!this.showBuildArea) {
      this.renderBackground(ctx);
      this.renderSurrender(ctx);
    }
    // 渲染敌方基地
    if (!this.showBuildArea && !this.showCreateUnit) {
      this.renderEnemyHp(ctx);
      this.renderRoundTips(ctx);
    }
    if (!this.showBuildArea && !this.showTowerArea) {
      this.renderMySelfUnitGrid(ctx);
      // 我方单位
      this.renderUnits(ctx)
      // 渲染地方单位
      if (!this.showCreateUnit) {
        this.renderEnemyUnit(ctx)
      }
    }
    // 回合结束
    this.renderRonudEndBtn(ctx)
    // 展示建筑ICON
    this.renderBuildingAreaBtn(ctx)
    // 能源塔Icon
    this.renderTowerAreaBtn(ctx)
    // 展示创建单位icon
    this.renderUnitAreaBtn(ctx)
    // 展示能源icon
    this.renderEnergyIcon(ctx)
    // 展示生命值icon
    this.renderHpIcon(ctx)
    // 建筑物位置
    if (this.showBuildArea) {
      this.renderMySelfBuildingGrid(ctx);
    }
    // 能源塔位置
    if (this.showTowerArea) {
      this.renderMySelfTowerGrid(ctx);
    }
    // 创建单位区域
    if (this.showCreateUnit) {
      this.renderCreateUnitArea(ctx)
    }
    // 创建建筑区域
    if (this.showBuildArea) {
      this.renderCreateBuildingArea(ctx)
      this.renderCanCreateBuildings(ctx)
      // 我方建筑
      this.rendersBuildings(ctx)
    }
    // 渲染选择的icon
    for (let key in CHOICE_KEY_LIST) {
      const val = CHOICE_KEY_LIST[key];
      if (this[val]) {
        ctx.drawImage(
          Store.getImage('select_icon'),
          this[val].x,
          this[val].y,
          this[val].width,
          this[val].height
        )
      }
    }
    if (this.choiceMyUnit) {
      this.renderMyUnitInfo(ctx);
    }
    if (this.choiceCreateUnit) {
      this.renderChoiceUnitInfo(ctx);
    }
    if (this.choiceEnemyUnit) {
      this.renderEnemyInfo(ctx);
    }
    if (this.choiceMyBuilding) {
      this.renderBuildingInfo(ctx);
    }
    if (!this.hasEventBind) {
      this.hasEventBind = true
      this.touchGameHandler = this.touchEventGameHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchGameHandler)
    }
  }

  isUnShowUnitModal() {
    return !this.choiceCreateUnit && !this.choiceEnemyUnit && !this.choiceMyUnit
  }
}