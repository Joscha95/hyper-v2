import { reactive } from 'vue'

const store = reactive({
  selectedObject:null,
  scene:null,
  isDragging:false,
  sceneList:[],
  focused:false,
  elementInCameraView:undefined,
  connectionCount:0,
  unsavedChanges:0,
  isOrbit:false
})

export default store