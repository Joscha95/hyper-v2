import { reactive,shallowReactive } from 'vue'
import ForceSimulation from '@/modules/3dForceSimulation.js'

const store = reactive({
  selectedObject:null,
  scene:null,
  isDragging:false,
  sceneList:[],
  threadIds:[],
  focused:false,
  elementInCameraView:undefined,
  connectionCount:0,
  unsavedChanges:0,
  isOrbit:false,
  loggedIn:false,
  isTouch:(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
  colors:{
    connection: '#4a4aba',
    thread: '#f85330',
    lookout: 'black'
  },
  sceneSettings:{showCircles:false,backgroundColor:{bottom:'#f0f0f0',top:'#c8c8c8'}},
  sceneSettingsDefault:{showCircles:true,backgroundColor:{bottom:'#f0f0f0',top:'#c8c8c8'}}
})

const sceneElements = [];
const forceSimulation = new ForceSimulation({nodes:[],links:[]})

export {store as default, forceSimulation, sceneElements}