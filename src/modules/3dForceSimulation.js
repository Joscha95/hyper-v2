import * as d3Force3d from 'd3-force-3d'

class ForceSimulation {
  constructor(graphData) {
    this.simulation=d3Force3d.forceSimulation().stop();
    this.nodeMap=null;
    this.isHot=true;
    this.graphData=graphData;
    this.onDataChange=()=>{};
    this.minAlpha=0.01;
    this.alphaDecay=1 - Math.pow(this.minAlpha, 1 / 300)
    this.init();
  }

  init(){
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
  }

  updateNodes(){
    this.simulation.nodes(this.graphData.nodes);
    this.reheat();
    this.onDataChange()
    this.nodeMap=new Map(this.graphData.nodes.map((n)=> [n.h_id,n]))
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

  // addLink(link){
  //   this.graphData.links.push(link)
  //   this.simulation.force('link',
  //     d3Force3d.forceLink(this.graphData.links)
  //     .id((l) => { return l.h_id; })
  //     .distance((l)=>l.distance))
  //
  //   this.reheat();
  //   this.onDataChange()
  // }

  reheat(a=1){
    this.simulation.alpha(a);
  }

  update(){
    this.isHot=this.simulation.alpha()>0.01
    if (!this.isHot) return;
    this.simulation.tick();
  }

  getNodeById(h_id){
    return this.nodeMap.get(h_id);
  }

  updateLinkDistances(){
    this.simulation.nodes(this.graphData.nodes);
    this.reheat();
  }
}

export default ForceSimulation