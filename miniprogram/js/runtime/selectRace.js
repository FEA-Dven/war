import { checkIsFingerOnObj } from '../core/util.js'
import { drawAlignCenterTextOnObj } from '../core/render.js'
import { screenWidth, screenHeight, COLOR_ENUM, BUTTON_HEIGHT, BUTTON_WIDTH } from '../../constant/area.js'
import Store from '../core/store.js'

// 种族渲染
export default class SelectRace {
  constructor() {
    this.hasEventBind = false;
  }

  // 首页场景画布点击区域代码
  touchEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    // 开始按钮
    if (this.selectDragonBtn && checkIsFingerOnObj(x, y, this.selectDragonBtn)) {
      Store.raceId = 1;
      this.scene.sceneType = 'game';
      this.scene.reset()
      this.removeCanvasIndexListener()
      this.hasEventBind = false
      return
    }

    // 开始按钮
    if (this.selectMagicBtn && checkIsFingerOnObj(x, y, this.selectMagicBtn)) {
      Store.raceId = 2;
      this.scene.sceneType = 'game';
      this.scene.reset()
      this.removeCanvasIndexListener()
      this.hasEventBind = false
      return
    }
  }

  removeCanvasIndexListener() {
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
  }

  // 渲染选择龙族按钮
  renderDragonBtn(ctx) {
    this.selectDragonBtn = {
      x: 60,
      y: (screenHeight - BUTTON_HEIGHT) / 2 - 100,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    ctx.drawImage(
      Store.getImage('normal_btn'),
      this.selectDragonBtn.x,
      this.selectDragonBtn.y,
      this.selectDragonBtn.width,
      this.selectDragonBtn.height
    )
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '龙族', {
      x: this.selectDragonBtn.x,
      y: this.selectDragonBtn.y,
      height: this.selectDragonBtn.height,
      width: this.selectDragonBtn.width
    })
  }

  // 渲染选择魔法学院按钮
  renderMagicBtn(ctx) {
    this.selectMagicBtn = {
      x: 60,
      y: this.selectDragonBtn.y + 160,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    ctx.drawImage(
      Store.getImage('normal_btn'),
      this.selectMagicBtn.x,
      this.selectMagicBtn.y,
      this.selectMagicBtn.width,
      this.selectMagicBtn.height
    )
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '魔法学院', {
      x: this.selectMagicBtn.x,
      y: this.selectMagicBtn.y,
      height: this.selectMagicBtn.height,
      width: this.selectMagicBtn.width
    })
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

  // 渲染种族选择页
  render(ctx, scene) {
    this.scene = scene;
    this.renderBackground(ctx);
    this.renderDragonBtn(ctx);
    this.renderMagicBtn(ctx);
    if (!this.hasEventBind) {
      this.hasEventBind = true
      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
    }
  }
}