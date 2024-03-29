import {PerspectiveCamera,Vector3,Group} from 'three'
import {Math as THREEMath}  from 'three'

class FirstPersonController {
  constructor(domElement,options={},scene) {
    this.enabled = true;
  	this.domElement = domElement;
  	this.camera = new PerspectiveCamera( 50, 0.5 * (window.innerWidth/window.innerHeight), 1, 100000);
    this.transformparent = new Group();
    this.transformparent.add(this.camera);
    this.camera.rotation.x=0;
    this.camera.rotation.y=Math.PI;
    this.camera.rotation.z=0;
    scene.add(this.transformparent)
    this.transformparent.position.set(0,300,-900);
    this.transformparent.lookAt(0,200,0);
  	this.rotateSpeed = options.rotateSpeed || 0.15;
  	this.zoomSpeed = options.zoomSpeed || 1;
  	this.moveSpeed = options.moveSpeed || 0.1;
  	this.active = false;
  	this.moveTarget = new Vector3(0,0,0);

  	this.domElement.addEventListener('wheel',(e)=> this.onMouseWheel(e),{ passive: true});
    this.domElement.addEventListener('mousedown',(e)=> this.onMouseDown(e));
    this.domElement.addEventListener('mouseup',(e)=> this.onMouseUp(e));
    this.domElement.addEventListener('mouseleave',(e)=> this.onMouseUp(e));
  	this.domElement.addEventListener( 'mousemove', (e)=> this.onMouseMove(e));
  	window.addEventListener( 'keydown', (e)=> this.handleKeyDown(e));
  	window.addEventListener( 'keyup', (e)=> this.handleKeyUp(e));



     this.evCache = [];
     this.prevDiff = -1;
     this.prevXY = {x:-1,y:-1};

     if (options.isTouch) {
      this.domElement.onpointerdown = (e) => {this.pointerdown_handler(e)};
      this.domElement.onpointermove = (e) => {this.pointermove_handler(e)};
      this.domElement.onpointerup = (e) => {this.pointerup_handler(e)};
      this.domElement.onpointercancel = (e) => {this.pointerup_handler(e)};
      this.domElement.onpointerout = (e) => {this.pointerup_handler(e)};
      this.domElement.onpointerleave = (e) => {this.pointerup_handler(e)};
     }
     console.log('is touch: ',options.isTouch);


    this.onmove=()=>{};
    this.onstart=()=>{};
    this.onchange=()=>{};
    this.onend=()=>{};
    this.onleaveLookout=()=>{};
    this.onenterLookout=()=>{};

    this.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 };
  	this.mousePressed = false
  	this.isDragging = false
    this.moveToTarget = false
    this.direction = new Vector3()
    this.quatTarg=null
    this.quatCam=null
    this.keyPressed = false
    this.enteredLookout = false
    this.context = false
    this.activeLookOut = null

    this.lookoutSync=false;

    this.orbit = false;
    this.cameraPos = new Vector3();
    this.camZtarg=0;

    this.cameraDir = new Vector3()
  }

  updateSize(aspect){
    this.camera.aspect=aspect;
    this.camera.updateProjectionMatrix();
  }

  update(){
    this.transformparent.translateOnAxis(this.direction,this.moveSpeed);

    if (this.activeLookOut) {
			const dist = this.transformparent.position.distanceTo(this.activeLookOut.position());
			if (dist<100 || this.lookoutSync) {
				if (!this.enteredLookout) {
					this.activeLookOut.activate();
					this.enteredLookout=true;
					this.onenterLookout(this.activeLookOut.h_id);
				}
        if (this.lookoutSync) {
          this.activeLookOut.setTransform(this.transformparent);
        }
			} else {
				this.activeLookOut.deactivate();
				if (this.enteredLookout) {
					this.activeLookOut = null;
					this.enteredLookout=false;
					this.onleaveLookout();
				}
			}
		}



		if (this.moveToTarget) {
			this.transformparent.position.lerp(this.moveTarget,0.1);
      if(this.orbit) this.camera.position.setZ(this.camera.position.z + (this.camZtarg - this.camera.position.z)*0.15)
			this.transformparent.quaternion.slerp(this.quatTarg, 0.06 );
			this.onmove();
			if (this.transformparent.position.distanceTo(this.moveTarget)<0.001
					&& this.transformparent.quaternion.angleTo(this.quatTarg)<0.01) {
						this.moveToTarget=false;
			}
		}

		this.direction.multiplyScalar(0.8);

		if (this.direction.length()>0.001) {
			this.onmove();
			this.onchange();

		} else if (this.isDragging) {
			this.onchange();
		}
  }

  toggleLookoutSync(){
    this.lookoutSync=!this.lookoutSync;
    if (this.lookoutSync) {
      this.moveToTarget=false;
      if(this.activeLookOut.toolbox) this.activeLookOut.toolbox.dispose();
      this.transformparent.position.set(this.activeLookOut.group.position.x,this.activeLookOut.group.position.y,this.activeLookOut.group.position.z)
    }else {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      //this.activeLookOut.updateToolboxOptions();
    }
  }

  moveTo(targetObj) {
    let targetPos = new Vector3();
    targetObj.dragObject.getWorldPosition(targetPos);
    let posOffset = 0;
    this.lookoutSync=false;
    // Rotation
    if (targetObj.h_type == "lookout") {
      this.quatTarg = targetObj.dragObject.quaternion.clone();
      targetObj.group.children[2].getWorldPosition(targetPos);
      if (this.activeLookOut) this.activeLookOut.deactivate();
      this.activeLookOut = targetObj;
      this.enteredLookout=false;
    } else {
      const clone = this.transformparent.clone();
      clone.lookAt(targetPos);
      this.quatTarg = clone.quaternion.clone();
      targetObj.dragObject.geometry.computeBoundingSphere()
      posOffset = -Math.max(this.calcOptimumDistToObj(targetObj.dragObject.geometry.boundingSphere.radius),80);
    }


    // Position
    let targ = targetPos.clone();
    var dir = new Vector3();
    dir.subVectors( targ, this.transformparent.position ).normalize();
    targ.addScaledVector(dir,posOffset);
    this.moveTarget.copy(targ);
    this.moveToTarget = true;
  }

  calcOptimumDistToObj(radius){
    let vFoV = this.camera.getEffectiveFOV();
    let hFoV = this.camera.fov * this.camera.aspect;

    let FoV = Math.min(vFoV, hFoV);
    let FoV2 = FoV / 2;

    // let bsWorld = boundingSphere.center.clone();
    let th = FoV2 * Math.PI / 180.0;
    return radius / Math.sin(th);
  }

  initOrbit(boundingSphere){

    let cameraDirOrbit = new Vector3();
    this.transformparent.getWorldDirection(cameraDirOrbit);

    this.moveTarget.copy(boundingSphere.center);
    this.camZtarg= - this.calcOptimumDistToObj(boundingSphere.radius);
    // const clone = this.transformparent.clone();
    // clone.lookAt(bsWorld);
    this.quatTarg = this.transformparent.quaternion.clone();
    this.moveToTarget = true;
    this.orbit=true;
  }

  quitOrbit(){
    this.moveToTarget=false;
    this.camZtarg=0;
    this.camera.getWorldPosition(this.cameraPos)
    this.transformparent.position.copy(this.cameraPos)
    this.camera.position.set(0,0,0);
    this.orbit=false;
  }

  onMouseDown(event) {
		if (!this.enabled) return;
		event.preventDefault();
		switch (event.which) {
			case 1:
				this.mousePressed=true;
				break;
			case 2:
				//middle
				break;
			case 3:
				this.context=true;
				break;
			default:

		}
	}

  onMouseUp(e) {
	  this.mousePressed=false;
	  this.isDragging=false;
		this.context=false;
		this.sendEndEvent();
	}

	onMouseMove( e ) {
		e.preventDefault();
		if (!this.enabled) return;
	  if (this.mousePressed) {
	    this.rotateCam(event);
	  } else if (this.context) {
	  	this.panCam(event);
	  }
	}

	sendStartEvent(){
		this.onstart();
    this.moveToTarget=false;
		this.active = true;
	}

	sendEndEvent(){
		this.onend();
		this.active = false;
	}

	handleKeyDown(event) {
		if (!this.enabled || (event.ctrlKey||event.metaKey)) return;
		switch ( event.keyCode ) {
			case this.keys.UP:
				this.keyPressed = true;
				this.direction.set(0,1*this.moveSpeed,0);
				break;

			case this.keys.BOTTOM:
				this.keyPressed = true;
				this.direction.set(0,-1*this.moveSpeed,0);
				break;

			case this.keys.LEFT:
				this.keyPressed = true;
				this.direction.set(-1*this.moveSpeed,0,0);
				break;

			case this.keys.RIGHT:
				this.keyPressed = true;
				this.direction.set(1*this.moveSpeed,0,0);
				break;
		}

	}

	handleKeyUp() {
		this.keyPressed = false;
	}

	onMouseWheel(event) {
	  let delta = 0;
    this.moveToTarget=false;
	  switch (event.deltaMode) {
	    case 0:
	      delta = event.deltaY*0.02;
	      break;
	    case 1:
	      delta = event.deltaY;
	      break;
	    default:
	      delta = event.deltaY;
	  }

    if (this.orbit) {
      this.camera.translateZ(delta*this.zoomSpeed);
      if(this.camera.position.z>-200) this.camera.position.setZ(-200);
    }else {
      this.transformparent.translateZ(-delta*this.zoomSpeed);
    }

		this.onmove();
	}

  pointerdown_handler(e){
    this.evCache.push(e);
  }

  pointermove_handler(e){
    // Find this event in the cache and update its record with this event
   for (var i = 0; i < this.evCache.length; i++) {
     if (e.pointerId == this.evCache[i].pointerId) {
        this.evCache[i] = e;
     break;
     }
   }
   // If two pointers are down, check for pinch gestures
   if (this.evCache.length == 2) {
     // Calculate the distance between the two pointers
     var curDiff = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);
     if (this.prevDiff > 0) {
       this.onMouseWheel({deltaY:(this.prevDiff-curDiff)*.1,deltaMode:1})
     }
     // Cache the distance for the next move event
     this.prevDiff = curDiff;
   } else if (this.evCache.length == 1) {
     if (this.prevXY.x > 0) {
       this.rotateCam({movementX:this.prevXY.x - e.clientX, movementY:this.prevXY.y - e.clientY})
     }
     this.prevXY.x=e.clientX;
     this.prevXY.y=e.clientY;
   }

  }

  pointerup_handler(e){
    for (var i = 0; i < this.evCache.length; i++) {
       if (this.evCache[i].pointerId == e.pointerId) {
         this.evCache.splice(i, 1);
         break;
       }
     }
    // If the number of pointers down is less than two then reset diff tracker
    if (this.evCache.length < 2) {
      this.prevDiff = -1;
    }

    this.prevXY = {x:-1,y:-1};
  }

  position(){
    if (this.orbit) {
      this.camera.getWorldPosition(this.cameraPos)
    }
    return this.orbit ? this.cameraPos : this.transformparent.position
  }

  quaternion(){
    return this.transformparent.quaternion
  }

  rotation(){
    return this.transformparent.rotation
  }

  isInView(position){
    this.camera.getWorldDirection(this.cameraDir)
    return ( position.clone().sub( this.position() ).angleTo( this.cameraDir ) ) < ( Math.PI / 2 )
  }

	rotateCam(event) {
	  var movementY = -(event.movementY * Math.PI * this.rotateSpeed) / 180;
	  var movementX = (event.movementX * Math.PI * this.rotateSpeed) / 180;
		if (!this.isDragging) {
			if (Math.abs(movementX)+Math.abs(movementY)>0.002) {
				this.isDragging = true;
				this.sendStartEvent();
			}
		}

    if(this.orbit) this.onmove();

	  this.transformparent.rotateOnWorldAxis(new Vector3(0, 1,0), THREEMath.degToRad(50*movementX));
	  this.transformparent.rotateX(movementY);
	}

	panCam(event) {
    if(this.orbit) return;
	  var movementY = event.movementY*0.8;
	  var movementX = event.movementX*0.8;
		if (!this.isDragging) {
			if (Math.abs(movementX)+Math.abs(movementY)>0.002) {
				this.isDragging = true;
				this.sendStartEvent();
			}
		}
	  this.direction.set(movementX,movementY,0);
	}


}

export default FirstPersonController