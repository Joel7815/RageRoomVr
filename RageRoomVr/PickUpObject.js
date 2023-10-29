import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';

export class PickupObject {
    constructor(scene, camera, physicsWorld) {
        this.scene_ = scene;
        this.camera_ = camera;
        this.physicsWorld = physicsWorld;
        this.selectedObject = null;
        this.selectedBody = null; // To keep track of the physics body
    }

    pick() {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera_);
        
        const intersects = raycaster.intersectObjects(this.scene_.children);
        for (let intersect of intersects) {
            if (intersect.object.material.color.equals(new THREE.Color(0xFF0000))) {
                this.selectedObject = intersect.object;
                this.selectedBody = intersect.object.cannonBody; // Accessing the Cannon.js body
                
                // Resetting velocities and forces when an object is picked
                this.selectedBody.velocity.setZero();
                this.selectedBody.angularVelocity.setZero();
                this.selectedBody.force.setZero();
                this.selectedBody.torque.setZero();
                
                // Applying damping to reduce spinning when thrown
                this.selectedBody.linearDamping = 0.5;
                this.selectedBody.angularDamping = 0.5;
                
                return intersect.object;
            }
        }
        return null;
    }

    updatePosition(object) {
        if (object) {
            const offset = new THREE.Vector3(0, 0, -5); // Adjust this offset as needed
            offset.applyQuaternion(this.camera_.quaternion);
            object.position.copy(this.camera_.position).add(offset);
            
            // Update the Cannon.js body position as well
            object.cannonBody.position.copy(object.position);
        }
    }

    throwObject() {
        if (this.selectedObject && this.selectedBody) {
            // Get the direction from the camera to the object
            const forceDirection = new THREE.Vector3();
            this.camera_.getWorldDirection(forceDirection);
            
            // Normalize and scale the direction to apply a strong force (like shooting a bullet)
            forceDirection.normalize().multiplyScalar(3000); // Increase the scalar value to apply more force
            
            // Apply the force at the center of mass of the object
            this.selectedBody.applyLocalForce(forceDirection, new CANNON.Vec3());
            
            // Reset to dynamic and clear damping
            this.selectedBody.type = CANNON.Body.DYNAMIC;
            this.selectedBody.linearDamping = 0;
            this.selectedBody.angularDamping = 0;
            
            // Ensure the body is added back to the physics world
            if (!this.physicsWorld.world.bodies.includes(this.selectedBody)) {
                this.physicsWorld.addBody(this.selectedBody);
            }
            
            this.selectedObject = null;
            this.selectedBody = null;
        }
    }
    
       
}
