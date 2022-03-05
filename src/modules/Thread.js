import LineHelper from '@/modules/LineHelper.js'

class Thread {
  constructor(scene,nodes=[]) {
    this.scene=scene
    this.nodes=nodes
  }

  appendNode(node){
    this.nodes.push(node);
  }

  prependNode(node){
    this.nodes.unshift(node);
  }

  insertNode(node,index){
    this.nodes.splice(index,0,node);
  }

  startConnection(obj){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.lineHelper = new LineHelper(obj);
    this.scene.add(this.lineHelper.line);
    this.isConnecting=true;

    if (this.lineHelper) {
      this.lineHelper.endPosition = this.getWorldPosition(event.clientX,event.clientY,1.3);
      this.lineHelper.update();
    }
  }

  disposeConnection(){
    if(this.lineHelper) this.lineHelper.dispose(this.scene);
    this.isConnecting=false;
  }

  finishConnection(obj){
    
  }
}