import { screenWidth, screenHeight, COLOR_ENUM } from '../../constant/area.js'
import { drawCenterText } from '../core/render'

export default new class Logger {
  constructor() {
    this.list = [];
  }
  
  setLogger(text) {
    this.list.unshift(text);
  }

  clear() {
    this.list = [];
  }

  render(ctx) {
    // 背景
    ctx.drawImage(
      Store.getImage('blackborad'),
      0,
      0,
      screenWidth,
      screenHeight
    )

    ctx.font = '24px 宋体';
    ctx.fillStyle = COLOR_ENUM.WHITE;
    drawCenterText(ctx, '日志信息', 20);

    for (let i = 0; i < this.list.length; i++) {
      const text = this.list[i];
      ctx.font = '12px 宋体';
      ctx.fillStyle = COLOR_ENUM.WHITE;
      drawCenterText(ctx, `${i}:${text}`, 60 + i * 20);
    }
  }
}