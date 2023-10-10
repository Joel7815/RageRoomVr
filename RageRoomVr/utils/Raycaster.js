import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class Raycaster {
    constructor(camera) {
        this.raycaster = new THREE.Raycaster();
        this.camera = camera;
    }

    getIntersectedObjects(objects) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        return this.raycaster.intersectObjects(objects);
    }
}