import Player from './player.js'
import * as AI from './AI/index.js';
import GameInfo from '../runtime/gameinfo.js'
import IndexPage from '../runtime/indexPage.js'
import SelectRace from '../runtime/selectRace.js'
import { getRandomNum } from './util.js'
import Store from '../core/store.js'

export default class Scene {
  constructor() {
    this.sceneType = 'index';
    this.init()
  }

  init() {
    this.gameInfo = new GameInfo();
    this.indexPage = new IndexPage();
    this.selectRace = new SelectRace();
    this.players = []
    this.round = 1;
    this.gameOver = false;
    this.winner = null;
    this.actionId = null;
    window.scene = this;
  }

  reset() {
    this.init()
    this.initPlayer()
    const randomNum = getRandomNum(2);
    this.actionId = this.players[randomNum].userId;
    this.players[randomNum].roundInit()
  }

  initPlayer() {
    const player1 = new Player(Store.raceId, 1);
    const AItype = Math.random() > 0.5 ? 1 : 2;
    const player2 = AItype === 1 ? new AI.Dragon(AItype, 2) : new AI.Magic(AItype, 2);
    this.players.push(player1, player2)
  }

  playerRoundStart() {
    const player = this.players.find(player => player.userId !== this.actionId);
    this.actionId = player.userId;
    player.roundInit()
    this.round = this.round + 1
  }

  render(ctx) {
    if (this.sceneType === 'game') {
      if (this.players.length) {
        this.players.forEach(player => {
          for (let i = 0; i < player.units.length; i++) {
            const unit = player.units[i];
            if (unit && unit.isDestory) {
              player.units[i] = null
            }
          }
          for (let i = 0; i < player.buildings.length; i++) {
            const building = player.buildings[i];
            if (building && building.isDestory) {
              player.buildings[i] = null
            }
          }
        })
      }
      this.gameInfo.render(ctx, this)
    }
    if (this.sceneType === 'index') {
      this.indexPage.render(ctx, this)
    }
    if (this.sceneType === 'selectRace') {
      this.selectRace.render(ctx, this)
    }
  }

  update() {
    if (this.sceneType === 'game') {
      const [player1, player2] = this.players
      if (player1.hp <= 0) {
        this.gameOver = true
        this.winner = player2.userId;
      }
      if (player2.hp <= 0) {
        this.gameOver = true
        this.winner = player1.userId;
      }
    }
  }
}