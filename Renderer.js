import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class Renderer {
    constructor(camera) {
        this.camera = camera;
        this.initializeRenderer_();
    }

    initializeRenderer_() {
        this.threejs_ = new THREE.WebGLRenderer({
            antialias: false,
        });
        this.threejs_.setPixelRatio(window.devicePixelRatio);
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.threejs_.domElement);

        window.addEventListener('resize', () => {
            this.onWindowResize_(this.camera);
        }, false);
    }

    onWindowResize_(camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }
    

    render(scene, camera) {
        this.threejs_.render(scene, camera);
    }
}
