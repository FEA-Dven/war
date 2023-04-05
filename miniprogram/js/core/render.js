import { screenWidth, screenHeight, GRID_WIDTH, GRID_HEIGHT, GRID_MARGGIN, COLOR_ENUM } from '../../constant/area.js'
import Store from '../core/store.js'

// 画结算界面
export const drawGameEndModal = (ctx, isWin, gameInfo) => {
  ctx.drawImage(
    Store.getImage('blackborad'),
    0,
    screenHeight / 2 - 80,
    screenWidth,
    160
  )
  const backIndexBtnWidth = screenWidth - 200;
  gameInfo.backIndexBtn = {
    x: (screenWidth - backIndexBtnWidth) / 2,
    y: screenHeight / 2 - 10,
    width: backIndexBtnWidth,
    height: backIndexBtnWidth / 2,
  }
  ctx.drawImage(
    Store.getImage('normal_btn'),
    gameInfo.backIndexBtn.x,
    gameInfo.backIndexBtn.y,
    gameInfo.backIndexBtn.width,
    gameInfo.backIndexBtn.height
  )
  ctx.font = '36px 宋体';
  ctx.fillStyle = COLOR_ENUM.WHITE;
  drawCenterTextOnObj(ctx, isWin ? '你赢了' : '你输了', screenHeight / 2 - 20, {
    x: 0,
    width: screenWidth
  })
  ctx.font = '18px 宋体';
  ctx.fillStyle = COLOR_ENUM.WHITE;
  drawAlignCenterTextOnObj(ctx, '返回首页', {
    x: gameInfo.backIndexBtn.x,
    y: gameInfo.backIndexBtn.y,
    width: gameInfo.backIndexBtn.width,
    height: gameInfo.backIndexBtn.height
  })
}

// 绘制图片
export const drawToCanvas = (ctx, obj) => {
  if (!obj) return;
  if (obj && obj.isDestory) return;
  ctx.drawImage(
    Store.getImage(obj.img),
    obj.x,
    obj.y,
    obj.width,
    obj.height
  )
}

// 绘制图片
export const drawUnitToCanvas = (ctx, obj) => {
  if (!obj) return;
  if (obj && obj.isDestory) return;
  ctx.drawImage(
    Store.getImage(obj.img),
    obj.x,
    obj.y,
    obj.width,
    obj.height
  )

  if (obj.isWait) {
    ctx.font = '12px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    ctx.fillText('Z', obj.x + 20, obj.y + 20)
    ctx.font = '14px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    ctx.fillText('Z', obj.x + 30, obj.y + 10)
  }
  ctx.font = '12px 宋体';
  ctx.fillStyle = COLOR_ENUM.WHITE;
  ctx.fillText(obj.atk, obj.x - 6, obj.y + 10)
  ctx.fillStyle = COLOR_ENUM.RED;
  ctx.fillText(obj.hp, obj.x - 6, obj.y + 22)
  ctx.fillStyle = COLOR_ENUM.BLUE;
  ctx.fillText(obj.af, obj.x - 6, obj.y + 34)
}

// 绘制居中文字
export const drawCenterText = (ctx, text, y) => {
  const titleWidth = ctx.measureText(text).width
  const renderTitleX = (screenWidth / 2) - (titleWidth / 2)
  ctx.fillText(text, renderTitleX, y)
}

// 绘制居中文字
export const drawCenterTextOnObj = (ctx, text, y, obj) => {
  const titleWidth = ctx.measureText(text).width
  const renderTitleX = (obj.x + (obj.width / 2)) - (titleWidth / 2)
  ctx.fillText(text, renderTitleX, y)
}

// 绘制垂直居中文字
export const drawAlignCenterTextOnObj = (ctx, text, obj) => {
  const textMetrics = ctx.measureText(text);
  const titleWidth = textMetrics.width
  const titleHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent; // 计算文本高度
  const renderTitleX = (obj.x + (obj.width / 2)) - (titleWidth / 2)
  const renderTitleY = obj.y + ((obj.height - titleHeight) / 2) + 12
  ctx.fillText(text, renderTitleX, renderTitleY)
}

// 画带圆角长方形
export const drawRadiusRect = (ctx, left, top, width, height, r) => {
  const pi = Math.PI;
  ctx.beginPath();
  ctx.arc(left + r, top + r, r, - pi, -pi / 2);
  ctx.arc(left + width - r, top + r, r, -pi / 2, 0);
  ctx.arc(left + width - r, top + height - r, r, 0, pi / 2);
  ctx.arc(left + r, top + height - r, r, pi / 2, pi);
  ctx.closePath();
}

// 获取当前单位区域数组
export const getUnitAreaList = () => {
  const arr = [];
  const x = 20
  const y = (screenHeight / 2 + 30);
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
    arr.push(unitArea)
  }
  return arr;
}

export const getAIUnitAreaList = () => {
  const x = 20
  const y = (screenHeight / 2 - 180);
  const enemyUnitAreaList = []
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
    enemyUnitAreaList.push(unitArea)
  }
  return enemyUnitAreaList;
}