import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class EnemyMovement {
    constructor(enemies, physicsWorld) {
        this.enemies = enemies; // Array of enemies
        this.physicsWorld = physicsWorld; // Reference to the physics world
    }

    // Call this method in your game's update loop
    update(timeElapsed) {
        const hoverAmplitude = 5; // Vertical amplitude for hovering
        const hoverFrequency = 0.5; // Speed of the up and down oscillation
        const circleRadius = 30; // Radius of the circle for horizontal movement
        const rotationSpeed = 30; // Speed of rotation
        const gravityCompensation = 9.82; // Compensation for gravity

        this.enemies.forEach((enemy, index) => {
            // Offset each enemy's starting angle to distribute them around the circle
            const angleOffset = (Math.PI * 2 / this.enemies.length) * index;
            const angle = timeElapsed * rotationSpeed + angleOffset;

            // Calculate the new position for circular motion
            const desiredX = Math.cos(angle) * circleRadius;
            const desiredZ = Math.sin(angle) * circleRadius;

            // Calculate the force needed to move the enemy towards the new position
            const currentPos = enemy.cannonBody.position;
            const forceX = desiredX - currentPos.x;
            const forceZ = desiredZ - currentPos.z;

            // Calculate an upward force that oscillates with time and add gravity compensation
            const verticalOscillation = hoverAmplitude * Math.sin(timeElapsed * hoverFrequency);
            const verticalForce = verticalOscillation - currentPos.y + gravityCompensation;

            // Calculate a force vector
            const force = new CANNON.Vec3(forceX, verticalForce, forceZ);

            // Apply the force to the enemy
            enemy.cannonBody.applyForce(force, currentPos);

            // Update the arrow helper to represent the force
            const forceVector = new THREE.Vector3(forceX, verticalForce, forceZ);
            enemy.forceArrow.setDirection(forceVector.normalize());
            enemy.forceArrow.setLength(forceVector.length(), 0.5, 0.3);
        });
    }
}
