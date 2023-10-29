import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class CameraAndScene {
    constructor() {
        this.initializeCamera_();
    }

    initializeCamera_() {
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 0.1;
        const far = 1000.0;
        this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera_.position.set(0, 2, 0);
    }


    get camera() {
        return this.camera_;
    }

}
