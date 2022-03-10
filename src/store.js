import { shallowReactive } from 'vue'

const store = shallowReactive({
  selectedObject:null,
  scene:null,
  isDragging:false,
  sceneList:[],
  thread:[],
  threadIds:[],
  focused:false,
  elementInCameraView:undefined,
  connectionCount:0,
  unsavedChanges:0,
  isOrbit:false,
  colors:{
    connection: '#4a4aba',
    thread: '#f85330',
    lookout: 'black'
  }
})

export default store