import { checkIsFingerOnObj } from '../core/util.js'
import { drawAlignCenterTextOnObj } from '../core/render.js'
import { screenWidth, screenHeight, COLOR_ENUM, BUTTON_HEIGHT, BUTTON_WIDTH } from '../../constant/area.js'
import Store from '../core/store.js'

// 首页渲染
export default class IndexPage {
  constructor() {
    this.hasEventBind = false;
  }

  // 首页场景画布点击区域代码
  touchEventIndexHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    // 开始按钮
    if (this.indexStartBtn && checkIsFingerOnObj(x, y, this.indexStartBtn)) {
      this.scene.sceneType = 'selectRace';
      this.removeCanvasIndexListener()
      this.hasEventBind = false
      return
    }

    if (window.wx && this.indexTeachBtn && checkIsFingerOnObj(x, y, this.indexTeachBtn)) {
      wx.previewImage({
        urls: [
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/01.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/02.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/03.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/04.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/05.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/06.png',
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/07.png',
        ],
        current: 'https://lastudio.oss-cn-beijing.aliyuncs.com/game/01.png'
      })
      this.removeCanvasIndexListener()
      this.hasEventBind = false
      return
    }

    if (window.wx && this.indexRaceBtn && checkIsFingerOnObj(x, y, this.indexRaceBtn)) {
      wx.previewImage({
        urls: [
          'https://lastudio.oss-cn-beijing.aliyuncs.com/game/race/dragon.png',
        ],
        current: 'https://lastudio.oss-cn-beijing.aliyuncs.com/game/race/dragon.png'
      })
      this.removeCanvasIndexListener()
      this.hasEventBind = false
      return
    }
  }

  removeCanvasIndexListener() {
    canvas.removeEventListener(
      'touchstart',
      this.touchIndexHandler
    )
  }

  // 渲染首页开始按钮
  renderIndexStartBtn(ctx) {
    this.indexStartBtn = {
      x: 60,
      y: screenHeight / 2 - 240,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    ctx.drawImage(
      Store.getImage('normal_btn'),
      this.indexStartBtn.x,
      this.indexStartBtn.y,
      this.indexStartBtn.width,
      this.indexStartBtn.height
    )
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '开始游戏', {
      x: this.indexStartBtn.x,
      y: this.indexStartBtn.y,
      height: this.indexStartBtn.height,
      width: this.indexStartBtn.width
    })
  }

  renderIndexTeachBtn(ctx) {
    this.indexTeachBtn = {
      x: 60,
      y: this.indexStartBtn.y + this.indexStartBtn.height + 60,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    ctx.drawImage(
      Store.getImage('normal_btn'),
      this.indexTeachBtn.x,
      this.indexTeachBtn.y,
      this.indexTeachBtn.width,
      this.indexTeachBtn.height
    )
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '查看教程', {
      x: this.indexTeachBtn.x,
      y: this.indexTeachBtn.y,
      height: this.indexTeachBtn.height,
      width: this.indexTeachBtn.width
    })
  }

  renderRaceBtn(ctx) {
    this.indexRaceBtn = {
      x: 60,
      y: this.indexTeachBtn.y + this.indexTeachBtn.height + 60,
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
    }
    ctx.drawImage(
      Store.getImage('normal_btn'),
      this.indexRaceBtn.x,
      this.indexRaceBtn.y,
      this.indexRaceBtn.width,
      this.indexRaceBtn.height
    )
    ctx.font = '16px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawAlignCenterTextOnObj(ctx, '种族介绍', {
      x: this.indexRaceBtn.x,
      y: this.indexRaceBtn.y,
      height: this.indexRaceBtn.height,
      width: this.indexRaceBtn.width
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

  // 渲染首页
  render(ctx, scene) {
    this.scene = scene;
    this.renderBackground(ctx);
    this.renderIndexStartBtn(ctx);
    this.renderIndexTeachBtn(ctx);
    this.renderRaceBtn(ctx);
    if (!this.hasEventBind) {
      this.hasEventBind = true
      this.touchIndexHandler = this.touchEventIndexHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchIndexHandler)
    }
  }
}