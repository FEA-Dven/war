import { BUILDING_LIST as DRAGON_BUILDING_LIST } from "./dragon/building_list.js"
import { UNIT_LIST as DRAGON_UNIT_LIST } from "./dragon/unit_list.js"
import { BUILDING_LIST as MAGIC_BUILDING_LIST } from "./magic/building_list.js"
import { UNIT_LIST as MAGIC_UNIT_LIST } from "./magic/unit_list.js"
import { RACE_ENUM } from '../../constant/race.js'

// 1
const ALL_UNIT_LIST = {
  1: DRAGON_UNIT_LIST,
  2: MAGIC_UNIT_LIST,
}

const ALL_BUILDING_LIST = {
  1: DRAGON_BUILDING_LIST,
  2: MAGIC_BUILDING_LIST,
}

export const getBuildingList = (raceId) => {
  return ALL_BUILDING_LIST[raceId]
}

export const getUnitList = (raceId) => {
  return ALL_UNIT_LIST[raceId]
}

export const FIRE_MODE = {
  NORMAL: 0,
  DRAGON_EGGS: 1,
  FLAMING_MOUNTAIN: 2,
  PHARAOH: 3,
}