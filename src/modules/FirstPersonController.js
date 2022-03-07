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

  	this.domElement.addEventListener('wheel',(e)=> this.onMouseWheel(e));
    this.domElement.addEventListener('mousedown',(e)=> this.onMouseDown(e));
    this.domElement.addEventListener('mouseup',(e)=> this.onMouseUp(e));
    this.domElement.addEventListener('mouseleave',(e)=> this.onMouseUp(e));
  	this.domElement.addEventListener( 'mousemove', (e)=> this.onMouseMove(e));
  	window.addEventListener( 'keydown', (e)=> this.handleKeyDown(e));
  	window.addEventListener( 'keyup', (e)=> this.handleKeyUp(e));

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
  }

  updateSize(aspect){
    this.camera.aspect=aspect;
    this.camera.updateProjectionMatrix();
  }

  update(){
    this.transformparent.translateOnAxis(this.direction,this.moveSpeed);

    if (this.activeLookOut) {
			const dist = this.transformparent.position.distanceTo(this.activeLookOut.position());
			if (dist<100) {
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
          this.lookoutSync=false;
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
      this.transformparent.position.set(this.activeLookOut.group.position.x,this.activeLookOut.group.position.y,this.activeLookOut.group.position.z)
    }else {
      window.dispatchEvent(new HashChangeEvent("hashchange"))
    }
  }

  moveTo(targetObj) {
    let targetPos = new Vector3();
    targetObj.dragObject.getWorldPosition(targetPos);
    let posOffset = 0;
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
      posOffset = -500;
    }


    // Position
    let targ = targetPos.clone();
    var dir = new Vector3();
    dir.subVectors( targ, this.transformparent.position ).normalize();
    targ.addScaledVector(dir,posOffset);
    this.moveTarget.copy(targ);
    this.moveToTarget = true;
  }

  initOrbit(boundingSphere){
    let vFoV = this.camera.getEffectiveFOV();
    let hFoV = this.camera.fov * this.camera.aspect;

    let FoV = Math.min(vFoV, hFoV);
    let FoV2 = FoV / 2;

    let bsWorld = boundingSphere.center.clone();
    let th = FoV2 * Math.PI / 180.0;
    let sina = Math.sin(th);
    let R = boundingSphere.radius;
    let FL = R / sina;

    let cameraDir = new Vector3();
    this.transformparent.getWorldDirection(cameraDir);

    this.moveTarget.copy(boundingSphere.center);
    this.camZtarg=-FL;
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