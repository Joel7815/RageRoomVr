import * as THREE from 'https://cdn.skypack.dev/three@0.136';

export class PickupObject {
    constructor(scene, camera) {
        this.scene_ = scene;
        this.camera_ = camera;
        this.selectedObject = null;
    }

    pick() {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera_);
        
        const intersects = raycaster.intersectObjects(this.scene_.children);
        for (let intersect of intersects) {
            if (intersect.object.material.color.equals(new THREE.Color(0xFF0000))) {
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
        }
    }
}
