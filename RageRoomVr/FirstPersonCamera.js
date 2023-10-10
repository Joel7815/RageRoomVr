import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { InputController } from './InputController.js';
import { Raycaster } from '../utils/Raycaster.js';

const KEYS = {
  'a': 65,
  's': 83,
  'w': 87,
  'd': 68,
  'e': 69,
};

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}

export class FirstPersonCamera {
    constructor(camera, objects) {
      this.camera_ = camera;
      this.input_ = new InputController();
      this.rotation_ = new THREE.Quaternion();
      this.translation_ = new THREE.Vector3(0, 2, 0);
      this.phi_ = 0;
      this.phiSpeed_ = 8;
      this.theta_ = 0;
      this.thetaSpeed_ = 5;
      this.objects_ = objects;
      console.log("Objects in the array:", this.objects_);
      this.raycaster = new Raycaster(camera);
      this.heldObject = null;
    }

    getIntersectedObjects(objects) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera_);
      return raycaster.intersectObjects(objects);
    }
  
    update(timeElapsedS) {
      this.updateRotation_(timeElapsedS);
      this.updateCamera_(timeElapsedS);
      this.updateTranslation_(timeElapsedS);
      this.input_.update(timeElapsedS);
      if (this.input_.key(KEYS.E) && !this.heldObject) {  // Assuming 'E' key for interaction
        const intersects = this.raycaster.getIntersectedObjects(this.objects_);
        if (intersects.length > 0) {
            this.heldObject = intersects[0].object;
            // Attach the object to the camera
            this.camera_.add(this.heldObject);
            this.heldObject.position.set(0, 0, -2);  // Position the object 2 units in front of the camera

        }
      } else if (this.input_.key(KEYS.E) && this.heldObject) {
        // Release the object and apply force
        this.camera_.remove(this.heldObject);
        const forceDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera_.quaternion).multiplyScalar(10); 
        this.heldObject = null;
      }
      const intersects = this.raycaster.getIntersectedObjects(this.objects_);
      console.log(intersects);
    }

    updateCamera_() {
      this.camera_.quaternion.copy(this.rotation_);
      this.camera_.position.copy(this.translation_);
    }
  
  
    updateTranslation_(timeElapsedS) {
      const forwardVelocity = (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
      const strafeVelocity = (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
  
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(qx);
      forward.multiplyScalar(forwardVelocity * timeElapsedS * 10);
  
      const left = new THREE.Vector3(-1, 0, 0);
      left.applyQuaternion(qx);
      left.multiplyScalar(strafeVelocity * timeElapsedS * 10);
  
      this.translation_.add(forward);
      this.translation_.add(left);
    }
  
    updateRotation_(timeElapsedS) {
      const xh = this.input_.current_.mouseXDelta / window.innerWidth;
      const yh = this.input_.current_.mouseYDelta / window.innerHeight;
  
      this.phi_ += -xh * this.phiSpeed_;
      this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);
  
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
      const qz = new THREE.Quaternion();
      qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);
  
      const q = new THREE.Quaternion();
      q.multiply(qx);
      q.multiply(qz);
  
      this.rotation_.copy(q);
    }
  }