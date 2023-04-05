import Sprite from '../base/sprite.js'
import Store from './store.js'
import { genUUID, showToast, getPlayerById } from './util.js'
import { getUnitList } from '../race/index.js'
import { GRID_WIDTH, GRID_HEIGHT } from '../../constant/area.js'
import Effect from './effect.js'
import { RACE_ENUM } from '../../constant/race.js'

export default class Unit extends Sprite {
  // af 频率
  constructor(raceId, unit_id, userId, x, y) {
    super()
    this.raceId = raceId;
    this.unit_id = unit_id;
    this.userId = userId;
    this.x = x;
    this.y = y;
    this.isDestory = false;
    this.init(unit_id);
  }

  init(unit_id) {
    const unit = getUnitList(this.raceId).find(item => item.unit_id === unit_id)
    if (!unit) {
      const errTxt = '创建单位失败';
      showToast({ icon: 'none', title: errTxt });
      throw new Error(errTxt)
    }
    this.id = genUUID();
    this.hp = unit.hp;
    this.name = unit.name;
    this.atk = unit.atk;
    this.initAf = unit.af;
    this.af = unit.af;
    this.sourceAf = unit.af;
    // 权重
    this.weight = unit.weight;
    this.effect = unit.effect;
    this.effect_des = unit.effect_des;
    this.effectFunc = unit.effectFunc;
    this.img = unit.img;
    this.width = GRID_WIDTH;
    this.height = GRID_HEIGHT;
    // 初始创建的单位需要等待
    this.isWait = true;
    this.isUseEffect = false;
  }

  // 攻击 underAttackUnit-受击单位
  attack(underAttackUnit) {
    // 等待单位无法攻击
    if (this.isWait) return;
    // 单位攻击次数为0无法攻击
    if (this.af === 0) return;
    this.af = this.af - 1;
    const atk = this.atk;
    this.hp -= underAttackUnit.atk;
    if (this.hp <= 0) {
      // 判断对方是否有结界师
      const hasBoundary = getPlayerById(this.userId).units.find(unit => unit && unit.raceId === RACE_ENUM.MAGIC && unit.unit_id === 10);
      // 攻击无敌效果，但是还是会扣血，天空领主，结界师
      if (this.effect && this.effectFunc === 'attackInvincible' || hasBoundary) {
        this.hp = 1;
      } else {
        this.destory()
      }
    }
    underAttackUnit.hp = underAttackUnit.hp - atk;
    if (underAttackUnit.hp <= 0) {
      // 被攻击无敌效果, 但是还是会扣血，堕落使徒
      if (underAttackUnit.effect && underAttackUnit.effectFunc === 'apostle') {
        underAttackUnit.hp = 1;
      } else {
        underAttackUnit.destory()
      }
      // 暴食龙效果
      if (this.effect && this.effectFunc === 'bingeEating' && this.hp > 0) {
        Effect.bingeEating(this)
      }
      // 传教士效果
      if (this.effect && this.effectFunc === 'missionary' && this.hp > 0) {
        Effect.missionary(underAttackUnit.id, underAttackUnit.userId)
      }
    }
    // 攻击后双方未破坏效果，魔导师
    if (this.hp > 0 && underAttackUnit.hp > 0) {
      if (this.effect && this.effectFunc === 'magicGuide') {
        const enemy = window.scene.players.find(player => player.userId === underAttackUnit.userId);
        for (let p = 0; p < enemy.units.length; p++) {
          const unit = enemy.units[p];
          if (unit && unit.id === underAttackUnit.id) {
            enemy.changeUnit(RACE_ENUM.MAGIC, 12, p, enemy.units[p].x, enemy.units[p].y)
            break;
          }
        }
      }
    }
  }

  // 直接攻击玩家
  attackPlayer(player) {
    // 等待单位无法攻击
    if (this.isWait) return;
    // 单位攻击次数为0无法攻击
    if (this.af === 0) return;
    player.hp = player.hp - this.atk;
    this.af = this.af - 1;
  }

  destory() {
    this.isDestory = true
  }

  // 发动效果
  onEffect() {
    if (this.effect === 'onClick') {
      this.isUseEffect = true;
      Effect.run(this.effectFunc, this)
    }
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if (!this.isDestory)
      return
    ctx.drawImage(
      Store.getImage(this.img),
      this.x,
      this.y,
      this.width,
      this.height
    )

    // 单位
    ctx.font = '12px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText(this.atk, this.x + 28, this.y + 10)

    ctx.font = '12px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText(this.hp, this.x + 28, this.y + 22)

    ctx.font = '12px 宋体';
    ctx.fillStyle = 'white';
    ctx.fillText(this.af, this.x + 28, this.y + 34)
  }
}