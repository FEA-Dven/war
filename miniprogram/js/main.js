import Scene from './core/scene.js'
import Store from './core/store.js';
import { drawGameEndModal } from './core/render.js'

let ctx = canvas.getContext('2d')
export default class Main {
  constructor() {
    this.aniId = 0;
    this.restart();
  }

  restart() {
    this.scene = new Scene();

    this.bindLoop = this.loop.bind(this);
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    setInterval(() => {
      // console.log(window.scene.players.find(item => item.isAI))
      // this._test()
    }, 1000)
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.scene.render(ctx)
  }

  update() {
    this.scene.update()
  }

  _test() {
    try {
      this.update()
      this.render()
    } catch (err) {
      console.error(err)
    }
  }

  loop() {
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    try {
      this.update()
      this.render()
    } catch (err) {
      console.error(err)
    }
    // 游戏结束
    if (this.scene.gameOver) {
      const winnerInfo = this.scene.players.find(player => player.userId === this.scene.winner);
      const isWin = winnerInfo.userId === Store.userId;
      drawGameEndModal(ctx, isWin, this.scene.gameInfo);
    }
  }
}