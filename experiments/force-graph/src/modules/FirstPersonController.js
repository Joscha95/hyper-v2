import * as THREE from 'three'

class FirstPersonController {
  constructor(domElement,options={}) {
    this.enabled = true;
  	this.domElement = domElement;
  	this.camera = new THREE.PerspectiveCamera( 50, 0.5 * (window.innerWidth/window.innerHeight), 1, 50000);
    this.camera.position.set(300,300,300);
    this.camera.lookAt(0,0,0);
  	this.rotateSpeed = options.rotateSpeed || 0.15;
  	this.zoomSpeed = options.zoomSpeed || 1;
  	this.moveSpeed = options.moveSpeed || 0.1;
  	this.active = false;
  	this.moveTarget = new THREE.Vector3(0,0,0);

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
    this.direction = new THREE.Vector3()
    this.quatTarg=null
    this.quatCam=null
    this.keyPressed = false
    this.enteredLookout = false
    this.context = false
    this.activeLookOut = null
  }

  updateSize(aspect){
    this.camera.aspect=aspect;
    this.camera.updateProjectionMatrix();
  }

  update(){
    this.camera.translateOnAxis(this.direction,this.moveSpeed);
			if (this.activeLookOut) {
				const dist = this.camera.position.distanceTo(this.activeLookOut.position);
				if (dist<100) {
					if (!this.enteredLookout) {
						this.activeLookOut.children[2].visible=false;
						this.enteredLookout=true;
						this.onenterLookout();
					}
				} else {
					this.activeLookOut.children[2].visible=true;
					if (this.enteredLookout) {
						this.activeLookOut = null;
						this.enteredLookout=false;
						this.onleaveLookout();
					}
				}
			}


			if (this.moveToTarget) {
				this.camera.position.lerp(this.moveTarget,0.1);
				this.camera.quaternion.slerp(this.quatTarg, 0.05 );
				this.onmove();
				if (this.camera.position.distanceTo(this.moveTarget)<0.001
						&& this.camera.quaternion.angleTo(this.quatTarg)<0.01) {
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

  moveTo(targetObj) {
    let targetPos = new THREE.Vector3();
    targetObj.getWorldPosition(targetPos);
    let posOffset = 0;

    // Rotation
    if (targetObj.type == "LOOKOUT") {
      this.quatTarg = targetObj.quaternion.clone();
      if (this.activeLookOut) {
        this.activeLookOut.children[2].visible=true;
      }
      this.activeLookOut = targetObj;
      this.enteredLookout=false;
    } else {
      const clone = this.camera.clone();
      clone.lookAt(targetPos);
      this.quatTarg = clone.quaternion.clone();
      posOffset = -500;
    }


    // Position
    let targ = targetPos.clone();
    var dir = new THREE.Vector3();
    dir.subVectors( targ, this.camera.position ).normalize();
    targ.addScaledVector(dir,posOffset);
    this.moveTarget.copy(targ);
    this.moveToTarget = true;
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

	  this.camera.translateZ(delta*this.zoomSpeed);
		this.onmove();
	}

	rotateCam(event) {
	  var movementY = (event.movementY * Math.PI * this.rotateSpeed) / 180;
	  var movementX = (event.movementX * Math.PI * this.rotateSpeed) / 180;
		if (!this.isDragging) {
			if (Math.abs(movementX)+Math.abs(movementY)>0.002) {
				this.isDragging = true;
				this.sendStartEvent();
			}
		}
	  this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1,0), THREE.Math.degToRad(50*movementX));
	  this.camera.rotateX(movementY);
	}

	panCam(event) {
	  var movementY = event.movementY*0.8;
	  var movementX = -event.movementX*0.8;
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