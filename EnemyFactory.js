import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';
import { CollisionHandler } from './CollisionHandler.js'; // Adjust the path as necessary


function createHead() {
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({color: 0xF2542D}); // Black color
    return new THREE.Mesh(headGeometry, headMaterial);
}

function createEyePart(parent, color, size, zPosition) {
    const geometry = new THREE.CircleGeometry(size, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const part = new THREE.Mesh(geometry, material);
    part.position.z = zPosition;
    parent.add(part);
}

function createEye(x, y, z) {
    const eyeMaterial = new THREE.MeshBasicMaterial({color: 0x058ED9}); // White color0x058ED9
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), eyeMaterial);
    eye.position.set(x, y, z);
    
    createEyePart(eye, 0x092140C, 0.05, 0.25); // Black pupil
    createEyePart(eye, 0x50505, 0.1, 0.25); // Blue iris
    
    return eye;
}

function createTooth(x, y, z) {
    const toothGeometry = new THREE.ConeGeometry(0.2, 1, 32); // Cone shapes for teeth
    const toothMaterial = new THREE.MeshBasicMaterial({color: 0xFCF7FF}); // White color
    const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
    tooth.position.set(x, y, z);
    tooth.rotation.x = Math.PI; // Rotate 180 degrees around the x-axis to flip the teeth
    return tooth;
}

function createEnemy(x, y, z, physicsWorld, handleCollision) {
    const enemy = new THREE.Group();

    const head = createHead();
    enemy.add(head);

    const leftEye = createEye(-0.5, 0.5, 1);
    head.add(leftEye);

    const rightEye = createEye(0.5, 0.5, 1);
    head.add(rightEye);

    // Positioning teeth around the mouth
    const teethPositions = [
        [0, -0.3, 1],
        [0.2, -0.4, 1],
        [-0.2, -0.4, 1],
        [0.4, -0.6, 1],
        [-0.4, -0.6, 1]
    ];

    teethPositions.forEach(pos => {
        const tooth = createTooth(...pos);
        head.add(tooth);
    });

    enemy.position.set(x, y, z);

    const enemyBody = new CANNON.Body({
        mass: 1, // Adjust the mass as needed
        position: new CANNON.Vec3(x, y, z)
    });
    const enemyShape = new CANNON.Sphere(1); // Radius of the sphere, adjust as needed
    enemyBody.addShape(enemyShape);
    physicsWorld.addBody(enemyBody);

    enemy.cannonBody = enemyBody; // Storing the reference to the physics body
    enemyBody.enemy = true; // Tagging the body as an enemy for collision detection
    enemyBody.userData = { mesh: enemy };
    enemyBody.addEventListener('collide', handleCollision);

    // Associate each mesh in the enemy group with the Cannon.js body

    enemy.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.userData.body = enemyBody;
        }
    });


    
    return enemy;
}

export function createEnemies(numEnemies, groundY, physicsWorld, handleCollision) {
    const enemies = [];
    for (let i = 0; i < numEnemies; i++) {
        const x = Math.random() * 20 - 10; // Random x position between -10 and 10
        const y = groundY + Math.random() * 5 + 2; // Random y position above the ground
        const z = Math.random() * 20 - 10; // Random z position between -10 and 10
        
        const enemy = createEnemy(x, y, z, physicsWorld, handleCollision);
        enemies.push(enemy);
    }
    return enemies;
}
