import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FirstPersonCamera } from './FirstPersonCamera.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { PickupObject } from './PickUpObject.js';
import { SceneManager } from './SceneManager.js';
import { Renderer } from './Renderer.js';
import { CameraAndScene } from './CameraAndScene.js';

export class FirstPersonCameraDemo {
    constructor() {
      this.renderer = new Renderer();
      this.cameraAndScene = new CameraAndScene();
      this.initialize_();
      this.pickupObject_ = new PickupObject(this.sceneManager.scene, this.cameraAndScene.camera, this.physicsWorld);
    }
  
    initialize_() {
      this.initializePhysicsWorld_();
      this.sceneManager = new SceneManager(this.physicsWorld);
      this.initializePostFX_();
      this.initializeDemo_();
  
      this.previousRAF_ = null;
      this.raf_();
      this.onWindowResize_();
    }
  
    initializePhysicsWorld_() {
      this.physicsWorld = new PhysicsWorld();
    }

    initializeDemo_() {
      this.fpsCamera_ = new FirstPersonCamera(this.cameraAndScene.camera, this.sceneManager.scene.children);
      this.physicsWorld = new PhysicsWorld();
    }
  
  
  
    initializePostFX_() {
    }
  
    onWindowResize_() {
      this.renderer.onWindowResize_(this.cameraAndScene.camera);
    }
  
    raf_() {
      requestAnimationFrame((t) => {
        if (this.previousRAF_ === null) {
          this.previousRAF_ = t;
        }
  
        this.step_(t - this.previousRAF_);
        this.renderer.render(this.sceneManager.scene, this.cameraAndScene.camera);
        this.previousRAF_ = t;
        this.raf_();
      });
    }
  
    step_(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
      this.physicsWorld.update(timeElapsedS);
      this.sceneManager.updateObjects(); 
      this.fpsCamera_.update(timeElapsedS);
      // Pick up logic
      if (this.fpsCamera_.input_.keyEPressed()) {
        if (!this.pickupObject_.selectedObject) {
            this.pickupObject_.selectedObject = this.pickupObject_.pick();
        }
        this.pickupObject_.updatePosition(this.pickupObject_.selectedObject);
    } else {
        this.pickupObject_.throwObject();
    }
    }
}
