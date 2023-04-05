import './js/libs/symbol.js'
import { promiseGetImage } from './js/core/util.js'
import { IMAGES, DRAGON_BUILDING_IMAGES, DRAGON_UNIT_IMAGES, MAGIC_BUILDING_IMAGES, MAGIC_UNIT_IMAGES } from './constant/image.js'

import Main from './js/main.js'

import Store from './js/core/store.js'

async function init() {
  for (let key in IMAGES) {
    const item = await promiseGetImage(IMAGES[key])
    Store.setImage({
      [`${key}`]: item,
    })
  }
  await initDragonImage()
  await initMagicImage()
  new Main()
}

async function initDragonImage() {
  for (let key in DRAGON_BUILDING_IMAGES) {
    const item = await promiseGetImage(DRAGON_BUILDING_IMAGES[key])
    Store.setImage({
      [`${key}`]: item,
    })
  }

  for (let key in DRAGON_UNIT_IMAGES) {
    const item = await promiseGetImage(DRAGON_UNIT_IMAGES[key])
    Store.setImage({
      [`${key}`]: item,
    })
  }
}

async function initMagicImage() {
  for (let key in MAGIC_BUILDING_IMAGES) {
    const item = await promiseGetImage(MAGIC_BUILDING_IMAGES[key])
    Store.setImage({
      [`${key}`]: item,
    })
  }

  for (let key in MAGIC_UNIT_IMAGES) {
    const item = await promiseGetImage(MAGIC_UNIT_IMAGES[key])
    Store.setImage({
      [`${key}`]: item,
    })
  }
}

init()
