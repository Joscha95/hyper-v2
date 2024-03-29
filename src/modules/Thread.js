import {BufferGeometry, BufferAttribute, Vector3, CatmullRomCurve3, Line, LineDashedMaterial} from 'three'

class Thread {
  constructor(scene,store,h_id) {
    this.scene=scene
    this.store=store
    this.empty=true;
    this.h_id=h_id;
    this.h_type='thread'

    this.ARC_SEGMENTS = 200;

    const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );

		const curve = new CatmullRomCurve3();
		curve.curveType = 'catmullrom';

    this.material=new LineDashedMaterial( {
      	color: store.colors.thread,
      	dashSize: 30,
      	gapSize: 3,
      } );

		curve.mesh = new Line( geometry, this.material );
		curve.mesh.castShadow = false;
		curve.mesh.name = 'thread';
		curve.mesh.refID = this.h_id;
		this.spline = curve;
    this.spline.mesh.computeLineDistances();
    this.spline.tension = .5;

    this.temppoint=new Vector3()

    this.domPlus=document.createElement('DIV');
    this.domPlus.id='thread_plus';
    this.domPlus.innerHTML='click to insert';
    this.domPlus.style.display='none';
    this.isHovered=false;

    this.isInserting=false;
    this.insertindex=null;

    this.val=0;
    this.valTarg=1;

    this.thread=[];
  }

  setup(nodes){

    this.store.threadIds.forEach((item, i) => {
      const node = nodes.find((n) => n.h_id==item);
      if(node) this.thread.push(node);
    });

    if(this.store.threadIds.length>=2) this.scene.add(this.spline.mesh)
    this.nodesChanged()
  }

  dispose(){
    this.thread.forEach((item, i) => {
      item.contentItem.from=undefined
      item.contentItem.to=undefined
      item.isThreatStart=false
      item.isThreatEnd=false
      item.isInThreat=false
    });
    this.thread=[];
    this.empty=true
    this.scene.remove(this.spline.mesh)
    this.spline.mesh.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) );
  }

  prepend(node){
    this.thread.unshift(node)
    this.nodesChanged()
  }

  append(node){
    this.thread.push(node)
    this.nodesChanged()
  }

  hover(x,y){
    this.domPlus.style.left=x+15+'px';
    this.domPlus.style.top=y+15+'px';
    if(!this.isHovered) {
      this.domPlus.style.display='block';
      document.body.classList.add('cursor_pointer');
      this.spline.mesh.material.dashSize=15;
      this.spline.mesh.computeLineDistances();

    }
    this.isHovered=true;
  }

  unHover(){
    if(this.isHovered) {
      this.domPlus.style.display='none';
      document.body.classList.remove('cursor_pointer');
      if(!this.isInserting) this.spline.mesh.material.dashSize=30;
    }
    this.isHovered=false;
  }

  startInsert(point){
    this.unHover();
    const divisions = this.thread.length*10
    const points = this.spline.getPoints(divisions);
    let dist = 100000;
    let ind = null;

    points.forEach((item, i) => {
      if (point.distanceTo(item)<dist) {
        ind=i;
        dist=point.distanceTo(item);
      }
    });

    ind = Math.floor(ind/(divisions/(this.thread.length-1)))
    this.spline.points.splice(ind+1,0,point)
    this.insertindex=ind+1;
    this.isInserting=true;
    this.spline.tension = 0.2;
    this.spline.mesh.material.dashSize=15;
  }

  onInsert(point){
    this.spline.points[this.insertindex]=point;
    this.updateSpline();
  }

  abortInsert(){
    this.spline.tension = .5;
    this.nodesChanged();
    this.spline.mesh.material.dashSize=30;
  }

  insert(obj){
    this.thread.splice(this.insertindex,0,obj);
    this.spline.tension = .5;
    this.spline.mesh.material = this.material;
    this.nodesChanged()
  }

  init(start,end){
    this.thread=[start,end]
    this.empty=false
    this.nodesChanged()
    this.scene.add(this.spline.mesh)
  }

  remove(node){
    const ind = this.thread.map((n)=>n.h_id).indexOf(node.h_id);
    node.contentItem.from=undefined
    node.contentItem.to=undefined
    node.isThreatStart=false
    node.isThreatEnd=false
    node.isInThreat=false

    this.thread.splice(ind,1);

    if (this.thread.length<2) {
      this.dispose()
    }

    this.nodesChanged()
  }

  newEntry(start,end){
    if (end.isInThreat) {
      console.warn('Weaving not possible, target is already in thread');
    }else {
      if (start.isThreatEnd) {
        this.append(end)
      }else if (start.isThreatStart) {
        this.prepend(end)
      } else {
        console.warn('weaving not possible');
      }
    }
  }

  updateLine(){

  }

  updateDamp(){
    //this.val=this.val + (this.valTarg-this.val)*.1;
  }

  nodesChanged(){
    this.isInserting=false;

    this.thread.forEach((item, i) => {
      item.isThreatStart=false
      item.isThreatEnd=false

      const from=this.thread[i-1];
      if(from) {
        item.contentItem.from=from.h_id
      }else {
        item.isThreatStart=true
      }

      const to=this.thread[i+1];
      if(to) {
        item.contentItem.to=to.h_id
      }else {
        item.isThreatEnd=true
      }

      item.isInThreat=true;
      item.threat=this;

    })

    this.spline.points=this.thread.map((n)=>n.position());

    this.updateSpline();
    this.spline.mesh.computeLineDistances();
    this.empty=this.thread.length==0;
    this.store.threadIds=this.thread.map((n)=> n.h_id)
  }



  updateSpline(){
    // this.temppoint=new Vector3();
    if (this.spline.points.length<2) return;
		const position = this.spline.mesh.geometry.attributes.position;

		for ( let i = 0; i < this.ARC_SEGMENTS; i ++ ) {

			const t = i / ( this.ARC_SEGMENTS - 1 );
			this.spline.getPoint( t, this.temppoint );
			position.setXYZ( i, this.temppoint.x, this.temppoint.y, this.temppoint.z );

		}

		position.needsUpdate = true;
    this.spline.mesh.geometry.computeBoundingSphere();
  }



}

export default Thread;