export class CollisionHandler {
    constructor(physicsWorld, scene) {
        if (!scene) {
            throw new Error('Scene is not defined or invalid');
        }
    
        this.physicsWorld = physicsWorld;
        this.scene = scene; // Storing the scene reference
        this.bodiesToRemove = [];
        this.setupCollisionHandler();
    }

    setupCollisionHandler() {
        if (this.physicsWorld.world.bodies) {
            this.physicsWorld.world.bodies.forEach(body => {
                body.addEventListener('collide', this.handleCollision.bind(this));
            });
        }
    }

    handleCollision(event) {
        const contact = event.contact;
        if (!contact) {
            console.error('No contact in collision event:', event);
            return;
        }
    
        const { bi: bodyA, bj: bodyB } = contact;
    
        if (!bodyA || !bodyB) {
            console.error('Undefined body in collision event:', event);
            return;
        }
    
        console.log('Collision detected between:', bodyA.id, bodyB.id); // Debugging line
    
        // Additional logging to understand the properties of the colliding bodies
        console.log('Body A properties:', bodyA);
        console.log('Body B properties:', bodyB);
    
        if (bodyA.enemy && bodyB.box) {
            console.log('Removing enemy:', bodyA.id);
            this.bodiesToRemove.push(bodyA);
        } else if (bodyB.enemy && bodyA.box) {
            console.log('Removing enemy:', bodyB.id);
            this.bodiesToRemove.push(bodyB);
        }
    }

    update() {
        this.bodiesToRemove.forEach(body => {
            // Remove the body from the physics world
            this.physicsWorld.removeBody(body);
    
            // Get the mesh (enemy group) directly from the body's userData
            const meshToRemove = body.userData.mesh;
    
            if (meshToRemove) {
                console.log('Removing enemy group:', meshToRemove);
                this.scene.remove(meshToRemove);
            } else {
                console.error('Enemy group not found for body:', body);
            }
        });
    
        // Clear the bodiesToRemove array after processing all bodies
        this.bodiesToRemove = [];
    }
    
    
}
