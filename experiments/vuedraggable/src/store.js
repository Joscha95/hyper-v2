import { reactive } from 'vue'
import { SceneList } from './modules/SceneList.js'

export const store = reactive({
  selectedObject:null,
  scene:null,
  sceneList:[]
})