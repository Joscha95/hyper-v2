import { reactive,shallowReactive } from 'vue'
import ForceSimulation from '@/modules/3dForceSimulation.js'

const store = reactive({
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

const sceneElements = [];
const forceSimulation = new ForceSimulation({nodes:[],links:[]})

export {store as default, forceSimulation, sceneElements}