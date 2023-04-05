/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(img = '', width = 0, height = 0, x = 0, y = 0) {
    this.img = img
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.isDestory = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.isDestory)
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
