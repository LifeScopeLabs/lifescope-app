const degToRad = THREE.Math.degToRad;
AFRAME.registerComponent("pitch-yaw-rotator", {
  schema: {
    minPitch: { default: -50 },
    maxPitch: { default: 50 }
  },

  init() {
    this.pitch = 0;
    this.yaw = 0;
    this.scene = AFRAME.scenes[0];
  },

  look(deltaPitch, deltaYaw) {
    //console.log(`deltaPitch: ${deltaPitch},\ndeltaYaw: ${deltaYaw}`);
    const { minPitch, maxPitch } = this.data;
    this.pitch += deltaPitch;
    this.pitch = Math.max(minPitch, Math.min(maxPitch, this.pitch));
    this.yaw += deltaYaw;
  },

  tick() {
    if (!this.scene.is('vr-mode')) {
      this.el.object3D.rotation.set(degToRad(this.pitch), degToRad(this.yaw), 0);
      this.el.object3D.rotation.order = "YXZ";
    }
  }
});
