import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { FirstPersonCamera } from './FirstPersonCamera.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { PickupObject } from './PickUpObject.js';
import { KEYS } from './keys.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';

export class FirstPersonCameraDemo {
    constructor() {
      this.initialize_();
      this.pickupObject_ = new PickupObject(this.scene_, this.camera_, this.physicsWorld);
    }
  
    initialize_() {
      this.initializeRenderer_();
      this.initializeLights_();
      this.initializePhysicsWorld_();
      this.initializeScene_();
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

      // Creating a Cannon.js body for the ground plane
      const groundShape = new CANNON.Plane();
      const groundBody = new CANNON.Body({
          mass: 0 // Setting mass to 0 makes it static
      });
      groundBody.addShape(groundShape);
      groundBody.position.y = 0; // Adjust this value if your plane is not at y = 0
      this.physicsWorld.addBody(groundBody);
  
      // Red cubes
      const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
      const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
      for (let i = 0; i < 10; i++) {
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(Math.random() * 50 - 25, 2, Math.random() * 50 - 25); // Ensure y position is above the ground

          // Creating a Cannon.js body and associating it with the Three.js mesh
          const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
          const cubeBody = new CANNON.Body({
              mass: 1,
              position: new CANNON.Vec3(cube.position.x, cube.position.y, cube.position.z)
          });
          cubeBody.addShape(cubeShape);
          this.physicsWorld.addBody(cubeBody);

          cube.cannonBody = cubeBody;
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
      this.updateObjects();
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
    updateObjects() {
    this.scene_.children.forEach((threeObject) => {
        if (threeObject.cannonBody) {
            threeObject.position.copy(threeObject.cannonBody.position);
            threeObject.quaternion.copy(threeObject.cannonBody.quaternion);
        }
    });
}
}
