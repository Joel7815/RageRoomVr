import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'

export class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);  // Gravity in the negative y direction.
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
    }

    update(deltaTime) {
        this.world.step(deltaTime);
    }

    addBody(body) {
        this.world.addBody(body);
    }

    removeBody(body) {
        this.world.removeBody(body);
    }
}