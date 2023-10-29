import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FirstPersonCamera } from './FirstPersonCamera.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { PickupObject } from './PickUpObject.js';
import { SceneManager } from './SceneManager.js';
import { Renderer } from './Renderer.js';
import { CameraAndScene } from './CameraAndScene.js';

export class FirstPersonCameraDemo {
  constructor() {
      this.cameraAndScene = new CameraAndScene();
      this.renderer = new Renderer(this.cameraAndScene.camera);
      this.initialize_();
      this.pickupObject_ = new PickupObject(this.sceneManager.scene, this.cameraAndScene.camera, this.physicsWorld);
  }

  // Initialize various components of the demo
  initialize_() {
      this.initializePhysicsWorld_();
      this.sceneManager = new SceneManager(this.physicsWorld);
      this.initializePostFX_();
      this.initializeDemo_();
      this.previousRAF_ = null;
      this.raf_();
      this.onWindowResize_();
  }

  // Initialize the physics world
  initializePhysicsWorld_() {
      this.physicsWorld = new PhysicsWorld();
  }

  // Additional demo initialization
  initializeDemo_() {
      this.fpsCamera_ = new FirstPersonCamera(this.cameraAndScene.camera, this.sceneManager.scene.children);
  }

  // Placeholder for post-effects initialization
  initializePostFX_() {
      // Implementation here
  }

  // Handle window resize events
  onWindowResize_() {
      this.renderer.onWindowResize_(this.cameraAndScene.camera);
  }

  // Request animation frame loop for continuous rendering
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

  // Update logic for each frame
    step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.updateWorld(timeElapsedS);
    this.handlePickupLogic();
    }

    updateWorld(timeElapsedS) {
        this.physicsWorld.update(timeElapsedS);
        this.sceneManager.updateObjects();
        this.fpsCamera_.update(timeElapsedS);
    }

    handlePickupLogic() {
        if (this.fpsCamera_.input_.keyEPressed()) {
            this.pickUpObject();
        } else {
            this.releaseObject();
        }
    }

    pickUpObject() {
        if (!this.pickupObject_.selectedObject) {
            this.pickupObject_.selectedObject = this.pickupObject_.pick();
        }
        this.pickupObject_.updatePosition(this.pickupObject_.selectedObject);
    }

    releaseObject() {
        this.pickupObject_.throwObject();
    }
}