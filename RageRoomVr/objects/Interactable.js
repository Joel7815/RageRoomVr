import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'



export class InteractableCube {
    constructor(size, position) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            new THREE.MeshStandardMaterial({color: 0x00ff00})
        );
        this.mesh.position.copy(position);

        const mass = 1;  // Cube's mass
        this.body = new CANNON.Body({
            mass: mass,
            shape: new CANNON.Box(new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5))
        });
        this.body.position.copy(position);
    }
}