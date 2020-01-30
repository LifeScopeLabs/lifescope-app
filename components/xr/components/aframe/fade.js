AFRAME.registerComponent('fade', {

    schema: {
        id: { type: 'string', default: '' },
        eventname: { type: 'string', default: 'cellclicked' },
        dur: { type: 'number', default: 1 }
    },

    gatherMeshes(object3D) {
        var self = this;
        var meshes = [];
        if (object3D.type == 'Mesh') { return object3D; }
    
        if (!!object3D.children) {
            object3D.children.forEach( (obj) => {
                var result = self.gatherMeshes(obj);
                if (!!result) {
                    if (result instanceof Array) {
                        result.forEach( (mesh) => meshes.push(mesh));
                    }
                    else {
                        meshes.push(result);
                    }
                }
            });
        }
        return meshes;
    },

    createOpacityMap(meshes) {
        var map = new Map();
        meshes.forEach(mesh => {
            var opacity = mesh.material.opacity;
            var transparency = mesh.material.transparent
            map.set(mesh, { opacity: opacity, transparency: transparency });
        });
        this.map = map;
    },

    async animateHideCellPromise() {
        var self = this;
        var el = this.el;

        if (this.hideCellPromise) {
            await this.hideCellPromise;
        }
        if (this.revealCellPromise) {
            await this.revealCellPromise;
        }

        var result = self.gatherMeshes(el.object3D);
        self.meshes = result;
        self.createOpacityMap(self.meshes);

        var promise = new Promise((resolve, reject) => {
            try {
                result.forEach((mesh) => {
                    AFRAME.ANIME({
                        targets: mesh.material,
                        easing: 'linear',
                        opacity: 0,
                        duration: self.data.dur*1000,
                        begin: function(anim) {
                            mesh.material.transparent = true;
                            // el.classList.remove('clickable');
                        },
                        complete: function(anim) {
                            mesh.visible = false;
                            mesh.updateMatrix();
                            mesh.updateMatrixWorld();
                            resolve();
                        }
                    });
                });
                AFRAME.ANIME({
                    targets: el,
                    easing: 'linear',
                    duration: self.data.dur*1000,
                    begin: function(anim) {
                        el.classList.remove('clickable');
                    },
                    complete: function(anim) {
                        resolve();
                    }
                });
            }
            catch (error) {
                console.error('animateHideCellPromise error');
                console.log(error);
                reject(error);
            }
        });

        this.hideCellPromise = promise;

        return promise;
    },

    async animateRevealCellPromise() {
        var self = this;
        var el = self.el;

        if (this.revealCellPromise) {
            await this.revealCellPromise;
        }
        if (this.hideCellPromise) {
            await this.hideCellPromise;
        }

        var result = self.gatherMeshes(el.object3D);
        
        var promise = new Promise((resolve, reject) => {
            try {
                result.forEach((mesh) => {

                    AFRAME.ANIME({
                        targets: mesh.material,
                        easing: 'linear',
                        opacity: !!self.map && self.map.has(mesh) ? self.map.get(mesh)['opacity'] : 1,
                        duration: self.data.dur*1000,
                        begin: function(anim) {
                            mesh.visible = true;
                        },
                        complete: function(anim) {
                            mesh.material.transparent = !!self.map && self.map.has(mesh) ?
                                self.map.get(mesh)['transparency']  : false;
                            // el.classList.add('clickable');
                            resolve();
                        }
                    });
                });
                AFRAME.ANIME({
                    targets: el,
                    easing: 'linear',
                    duration: self.data.dur*1000,
                    complete: function(anim) {
                        el.classList.add('clickable');
                        resolve();
                    }
                });

            }
            catch (error) {
                console.error('animateRevealCellPromise error');
                console.log(error);
                reject(error);
            }
        });

        this.revealCellPromise = promise;

        return promise;
    },


});