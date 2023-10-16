import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FirstPersonCamera } from './FirstPersonCamera.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { PickupObject } from './PickUpObject.js';
import { KEYS } from './keys.js'; 

export class FirstPersonCameraDemo {
    constructor() {
      this.initialize_();
      this.pickupObject_ = new PickupObject(this.scene_, this.camera_);
    }
  
    initialize_() {
      this.initializeRenderer_();
      this.initializeLights_();
      this.initializeScene_();
      this.initializePostFX_();
      this.initializeDemo_();
  
      this.previousRAF_ = null;
      this.raf_();
      this.onWindowResize_();
    }
  
    initializeDemo_() {
      this.fpsCamera_ = new FirstPersonCamera(this.camera_, this.objects_);
      this.physicsWorld = new PhysicsWorld();
    }
  
    initializeRenderer_() {
      this.threejs_ = new THREE.WebGLRenderer({
        antialias: false,
      });
      this.threejs_.setPixelRatio(window.devicePixelRatio);
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
  
      document.body.appendChild(this.threejs_.domElement);
  
      window.addEventListener('resize', () => {
        this.onWindowResize_();
      }, false);
  
      const fov = 60;
      const aspect = 1920 / 1080;
      const near = 0.1;
      const far = 1000.0;
      this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera_.position.set(0, 2, 0);
  
      this.scene_ = new THREE.Scene();
      this.scene_.background = new THREE.Color(0x0000FF); // Blue sky
    }
  
    initializeScene_() {
      // Black plane
      const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
      const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;
      this.scene_.add(plane);
  
      // Red cubes
      const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
      for (let i = 0; i < 10; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
        this.scene_.add(cube);
      }
  
      this.objects_ = [plane];
    }
  
    initializeLights_() {
      const light = new THREE.DirectionalLight(0xFFFFFF, 1);
      light.position.set(5, 10, 5).normalize();
      this.scene_.add(light);
      this.scene_.add(new THREE.AmbientLight(0x404040)); // Ambient light
    }
  
    initializePostFX_() {
    }
  
    onWindowResize_() {
      this.camera_.aspect = window.innerWidth / window.innerHeight;
      this.camera_.updateProjectionMatrix();
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }
  
    raf_() {
      requestAnimationFrame((t) => {
        if (this.previousRAF_ === null) {
          this.previousRAF_ = t;
        }
  
        this.step_(t - this.previousRAF_);
        this.threejs_.render(this.scene_, this.camera_);
        this.previousRAF_ = t;
        this.raf_();
      });
    }
  
    step_(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
      this.physicsWorld.update(timeElapsedS);
      this.fpsCamera_.update(timeElapsedS);
      // Pick up logic
      if (this.fpsCamera_.input_.keyEPressed()) {
        if (!this.pickupObject_.selectedObject) {
            this.pickupObject_.selectedObject = this.pickupObject_.pick();
        }
        this.pickupObject_.updatePosition(this.pickupObject_.selectedObject);
      } else {
        this.pickupObject_.selectedObject = null;
      }
    }
}
