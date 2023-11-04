import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';


export class ObjectFactory {
    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
        this.objects = [];
        this.defaultPlaneMaterial = new THREE.MeshStandardMaterial({ color: 0x85CB33 });
        this.defaultCubeMaterial = new THREE.MeshStandardMaterial({ color: 0x9000B3 });
    }

    createGround(size = 100) {
        const planeGeometry = new THREE.PlaneGeometry(size, size, 10, 10);
        const plane = new THREE.Mesh(planeGeometry, this.defaultPlaneMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
    
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
    
        // Rotate the groundBody to align with the Three.js mesh
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    
        groundBody.addShape(groundShape);
        this.physicsWorld.addBody(groundBody);
    
        this.objects.push(plane);
        return plane;
    }

    createCube(x = 0, y = 0, z = 0, size = 2, color = this.defaultCubeMaterial.color.getHex()) {
        if (y < size / 2) y = size / 2; // Ensure the cube is above ground

        const cubeGeometry = new THREE.BoxGeometry(size, size, size);
        const cubeMaterial = new THREE.MeshStandardMaterial({ color });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, y, z);

        const halfSize = size / 2;
        const cubeShape = new CANNON.Box(new CANNON.Vec3(halfSize, halfSize, halfSize));
        const cubeBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(x, y, z)
        });
        cubeBody.addShape(cubeShape);
        this.physicsWorld.addBody(cubeBody);

        cube.cannonBody = cubeBody;
        cubeBody.box = true; // Tagging the box
        
        this.objects.push(cube);
        return cube;
    }

    getObjects() {
        return this.objects;
    }
}
