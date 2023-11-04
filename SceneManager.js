import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { ObjectFactory } from './ObjectFactory.js';
import { createEnemies } from './EnemyFactory.js';
import { CollisionHandler } from './CollisionHandler.js'; // Adjust the path as necessary



export class SceneManager {
    constructor(physicsWorld, collisionHandler) {
        this.physicsWorld = physicsWorld;
        this.collisionHandler = collisionHandler;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x50505); // Blue sky
        this.objectFactory = new ObjectFactory(physicsWorld);
        
        if (this.collisionHandler) { // Check if collisionHandler is defined
            this.initializeObjects();
        }
        
        this.initializeLights();
    }

    // You can call this method after the SceneManager is constructed
    setCollisionHandler(collisionHandler) {
        this.collisionHandler = collisionHandler;
        
        if (this.collisionHandler) { // Check if collisionHandler is now defined
            this.initializeObjects();
        }
    }



    initializeObjects() {
        // Creating the ground
        const ground = this.objectFactory.createGround();
        this.scene.add(ground);

        // Creating cubes
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 50 - 25;
            const y = 2;
            const z = Math.random() * 50 - 25;
            const cube = this.objectFactory.createCube(x, y, z);
            this.scene.add(cube);
        }
        this.initializeEnemies();
    }

    initializeEnemies() {
        const groundY = 0; // adjust based on your actual ground position
        this.enemies = createEnemies(5, groundY, this.physicsWorld, this.collisionHandler.handleCollision.bind(this.collisionHandler));
        this.enemies.forEach(enemy => {
            this.scene.add(enemy);
        });
    }
    

    initializeLights() {
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(5, 10, 5).normalize();
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0x404040)); // Ambient light
    }

    updateObjects() {
        this.scene.children.forEach((threeObject) => {
            if (threeObject.cannonBody) {
                threeObject.position.copy(threeObject.cannonBody.position);
                threeObject.quaternion.copy(threeObject.cannonBody.quaternion);
            }
        });
    }
}
