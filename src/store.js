import { reactive } from 'vue'

const store = reactive({
  selectedObject:null,
  scene:null,
  isDragging:false,
  sceneList:[],
  focused:false,
  activeChainElement:undefined,
  connectionCount:0
})

export default store