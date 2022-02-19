import { reactive } from 'vue'

const store = reactive({
  selectedObject:null,
  scene:null,
  isDragging:false,
  sceneList:[]
})

export default store