export const UNIT_LIST = [
  {
    raceId: 1,
    unit_id: 1,
    atk: 2,
    hp: 2,
    af: 1,
    energy: 2,
    weight: 1,
    name: '精灵龙',
    effect: false,
    effect_des: '',
    effectFunc: '',
    img: 'dragon_unit_1',
  },
  {
    raceId: 1,
    unit_id: 2,
    atk: 1,
    hp: 4,
    af: 1,
    energy: 2,
    weight: 1,
    name: '暗黑龙',
    effect: false,
    effect_des: '',
    effectFunc: '',
    img: 'dragon_unit_2',
  },
  {
    raceId: 1,
    unit_id: 3,
    atk: 0,
    hp: 3,
    af: 1,
    energy: 1,
    weight: 1,
    name: '龙蛋',
    effect: false,
    effect_des: '',
    effectFunc: '',
    img: 'dragon_unit_3',
  },
  {
    raceId: 1,
    unit_id: 4,
    atk: 1,
    hp: 4,
    af: 1,
    energy: 2,
    weight: 2,
    name: '龙医',
    effect: 'onClick',
    effect_des: '随机对我方一个单位HP+1',
    effectFunc: 'dragonDoctor',
    img: 'dragon_unit_4',
  },
  {
    raceId: 1,
    unit_id: 5,
    atk: 3,
    hp: 6,
    af: 2,
    energy: 4,
    weight: 4,
    name: '暴食龙',
    effect: 'onShow',
    effect_des: '消灭地方单位后攻击+1生命+2',
    effectFunc: 'bingeEating',
    img: 'dragon_unit_5',
  },
  {
    raceId: 1,
    unit_id: 6,
    atk: 6,
    hp: 8,
    af: 2,
    energy: 5,
    weight: 4,
    name: '火君',
    effect: 'onClick',
    effect_des: '随机破坏敌方一个单位',
    effectFunc: 'destroyUnit',
    img: 'dragon_unit_6',
  },
  {
    raceId: 1,
    unit_id: 7,
    atk: 6,
    hp: 8,
    af: 2,
    energy: 5,
    weight: 4,
    name: '地狱魔龙',
    effect: 'onClick',
    effect_des: '随机破坏敌方一个建筑',
    effectFunc: 'destroyBuilding',
    img: 'dragon_unit_7',
  },
  {
    raceId: 1,
    unit_id: 8,
    atk: 4,
    hp: 5,
    af: 1,
    energy: 3,
    weight: 3,
    name: '守护者',
    effect: false,
    effect_des: '',
    effectFunc: '',
    img: 'dragon_unit_8',
  },
  {
    raceId: 1,
    unit_id: 9,
    atk: 3,
    hp: 4,
    af: 2,
    energy: 3,
    weight: 3,
    name: '幽灵龙',
    effect: false,
    effect_des: '',
    effectFunc: '',
    img: 'dragon_unit_9',
  },
  {
    raceId: 1,
    unit_id: 10,
    atk: 6,
    hp: 1,
    af: 1,
    energy: 3,
    weight: 4,
    name: '龙骑士',
    effect: 'onClick',
    effect_des: '生命值增加我方在场单位数',
    effectFunc: 'dragonRider',
    img: 'dragon_unit_10',
  },
  {
    raceId: 1,
    unit_id: 11,
    atk: 3,
    hp: 6,
    af: 1,
    energy: 4,
    weight: 3,
    name: '天空领主',
    effect: 'onShow',
    effect_des: '攻击期间不会被消灭',
    effectFunc: 'attackInvincible',
    img: 'dragon_unit_11',
  },
  {
    raceId: 1,
    unit_id: 12,
    atk: 2,
    hp: 4,
    af: 1,
    energy: 5,
    weight: 1,
    name: '龙巫',
    effect: 'onClick',
    effect_des: '我方场上单位生命值+2攻击力+2',
    effectFunc: 'dragonWizard',
    img: 'dragon_unit_12',
  },
  {
    raceId: 1,
    unit_id: 13,
    atk: 1,
    hp: 1,
    af: 4,
    energy: 7,
    weight: 5,
    name: '帝王',
    effect: 'onClick',
    effect_des: '攻击力和生命值提升我方"龙蛋"数',
    effectFunc: 'dragonEmperor',
    img: 'dragon_unit_13',
  },
  {
    raceId: 1,
    unit_id: 14,
    atk: 1,
    hp: 8,
    af: 3,
    energy: 7,
    weight: 6,
    name: '彩虹龙',
    effect: 'onClick',
    effect_des: '对方场上单位生命值全部为1',
    effectFunc: 'dragonRainbow',
    img: 'dragon_unit_14',
  },
]