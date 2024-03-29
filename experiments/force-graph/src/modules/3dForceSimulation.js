import * as d3Force3d from 'd3-force-3d'

class ForceSimulation {
  constructor(graphData) {
    this.simulation=d3Force3d.forceSimulation().stop();
    this.nodeMap=null;
    this.isHot=true;
    this.graphData=graphData;
    this.onDataChange=()=>{};
    this.init();
  }

  init(){
    this.simulation.numDimensions(3)
    this.simulation.nodes(this.graphData.nodes)
    this.simulation.force('link', d3Force3d.forceLink(this.graphData.links).id((d) => { return d.hyperID; }))
    .force('charge', d3Force3d.forceManyBody())
    //.force('center', d3Force3d.forceCenter())
    //.force('dagRadial', null);
    this.nodeMap=new Map(this.graphData.nodes.map((n)=> [n.hyperID,n]))
  }

  setNodes(nodes){
    this.simulation.nodes(this.graphData.nodes);
    this.reheat();
    this.onDataChange()
    this.nodeMap=new Map(this.graphData.nodes.map((n)=> [n.hyperID,n]))
  }

  setLinks(links){
    this.simulation.links(this.graphData.links);
    this.reheat();
    this.onDataChange()
  }

  reheat(){
    this.simulation.alpha(1);
  }

  update(){
    this.isHot=this.simulation.alpha()>0.001
    if (!this.isHot) return;
    this.simulation.tick();
  }

  getNodeById(hyperID){
    return this.nodeMap.get(hyperID);
  }
}

export default ForceSimulation