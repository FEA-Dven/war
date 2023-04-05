import Sprite from '../base/sprite.js'
import { genUUID } from './util.js'

export default class Tower extends Sprite {
  // af 频率
  constructor(userId, x, y) {
    super()
    this.userId = userId;
    this.x = x;
    this.y = y;
    this.init();
  }

  init() {
    this.id = genUUID();
    this.isDestory = false;
  }

  destory() {
    this.isDestory = true
  }
}