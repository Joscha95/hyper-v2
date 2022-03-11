import * as d3Force3d from 'd3-force-3d'
import {Vector3} from 'three'

class ForceSimulation {
  constructor(graphData) {
    this.simulation=d3Force3d.forceSimulation().stop();
    this.nodeMap=null;
    this.isHot=true;
    this.graphData=graphData;
    this.onDataChange=()=>{};
    this.minAlpha=0.01;
    this.alphaDecay=1 - Math.pow(this.minAlpha, 1 / 300)
    //this.init();
  }

  init(nodes){
    this.graphData.nodes=nodes;
    this.graphData.links=this.graphData.nodes.filter( n => n.h_type=='connection').map((n) => n.links).flat()
    this.simulation.numDimensions(3)
    this.simulation.alphaDecay(0.1)
    this.simulation.nodes(this.graphData.nodes)
    this.simulation.force('link', d3Force3d.forceLink(this.graphData.links)
                    .id((d) => { return d.h_id; })
                    .distance((l) => l.distance))
    .force('charge', d3Force3d.forceManyBody().theta(.1))
    //.force('center', d3Force3d.forceCenter())
    //.force('dagRadial', null);
    this.nodeMap=new Map(this.graphData.nodes.map((n)=> [n.h_id,n]))
    this.onDataChange(true)
  }

  updateLinks(){
    this.simulation.force('link',
      d3Force3d.forceLink(this.graphData.links)
      .id((l) => { return l.h_id; })
      .distance((l)=>l.distance))

    this.reheat();
    this.onDataChange()
  }

  updateGraph(){
    this.simulation.nodes(this.graphData.nodes);
    this.nodeMap=new Map(this.graphData.nodes.map((n)=> [n.h_id,n]))

    this.simulation.force('link',
      d3Force3d.forceLink(this.graphData.links)
      .id((l) => { return l.h_id; })
      .distance((l)=>l.distance))

    this.reheat();
    this.onDataChange()
  }

  addLink(center){
    this.addNode(center);
    this.updateLinks();
  }

  addNode(node){
    this.graphData.nodes.push(node);
    this.graphData.links=this.graphData.nodes.filter( n => n.h_type=='connection').map((n) => n.links).flat()
    this.updateGraph();
  }

  removeNode(h_id){
    this.graphData.nodes=this.graphData.nodes.filter( n => n.h_id!=h_id)
    this.graphData.links=this.graphData.nodes.filter( n => n.h_type=='connection').map((n) => n.links).flat()

    this.updateGraph();
  }

  reheat(a=1){
    this.simulation.alpha(a);
  }

  updateNodes(sceneListIds){
    this.graphData.nodes = this.graphData.nodes.filter( n => sceneListIds.some( id => n.h_id==id));
    this.updateGraph();
  }

  update(){
    this.isHot=this.simulation.alpha()>0.01
    if (!this.isHot) return;
    this.simulation.tick();
  }

  getNodeById(h_id){
    return this.nodeMap.get(h_id);
  }

  setNodeFixed(h_id){
    const node = this.nodeMap.get(h_id)
    node.fx=node.x
    node.fy=node.y
    node.fz=node.z
  }

  setLinkLength(h_id,length,fac){
    //calc new source position
    const node = this.getNodeById(h_id);
    const source = node.links[0].source;
    const target = node.links[1].target;
    // console.log(node);
    let oldPos = new Vector3(source.x,source.y,source.z)
    let newPos= new Vector3(node.x,node.y,node.z)
    newPos.addScaledVector(oldPos.sub(newPos),fac);
    source.x=newPos.x;
    source.y=newPos.y;
    source.z=newPos.z;

    //calc new target position
    oldPos = new Vector3(target.x,target.y,target.z)
    newPos= new Vector3(node.x,node.y,node.z)
    newPos.addScaledVector(oldPos.sub(newPos),fac);
    target.x=newPos.x;
    target.y=newPos.y;
    target.z=newPos.z;

    node.links.forEach((item) => item.distance=length/2);

    this.updateLinkDistances();
  }

  setNodeDynamic(h_id){
    const node = this.nodeMap.get(h_id)
    node.fx=node.fy=node.fz=null
  }

  updateLinkDistances(){
    this.simulation.nodes(this.graphData.nodes);
    this.reheat();
  }
}

export default ForceSimulation