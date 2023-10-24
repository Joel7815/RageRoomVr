import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';

export class ObjectFactory {
    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
        this.objects = [];
    }

    createGround() {
        // Black plane
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;

        // Creating a Cannon.js body for the ground plane
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0 // Setting mass to 0 makes it static
        });
        groundBody.addShape(groundShape);
        groundBody.position.y = 0; // Adjust this value if your plane is not at y = 0
        this.physicsWorld.addBody(groundBody);

        this.objects.push(plane);
        return plane;
    }

    createCube(x, y, z) {
        // Red cubes
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, y, z); // Ensure y position is above the ground

        // Creating a Cannon.js body and associating it with the Three.js mesh
        const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        const cubeBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(x, y, z)
        });
        cubeBody.addShape(cubeShape);
        this.physicsWorld.addBody(cubeBody);

        cube.cannonBody = cubeBody;

        this.objects.push(cube); 
        return cube;
    }
    getObjects() {
        return this.objects; // Method to retrieve the objects array
    }
}
