export default class textureLoaderHelper {
    constructor() {
        this.baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/';
        this.bronzeUrl = this.baseUrl + 'BronzeBare/bronze_';
        this.woodUrl = this.baseUrl + 'WoodenFloor/wood_';
        this.woodPanelUrl = this.baseUrl + 'WoodenFloor/wood-panel_';

        this.materialUrls = {
            'bronze': this.bronzeUrl,
            'wood': this.woodUrl,
            'wood-panel': this.woodPanelUrl
          };
    }

    loadTexture(material, type='base', ext='jpg', success) {
        const url = this.materialUrls[material] + type + '.' + ext;
        // console.log(`loadTexture: ${url}`);
        return new THREE.TextureLoader().load( url, success );
    }

    getOrLoadTexture(material, type='base', ext='jpg', success) {
        const url = this.materialUrls[material] + type + '.' + ext;
        
        var texture =  THREE.Cache.files[url];
        if (texture !== undefined) {
            success(texture);
        }
        return texture !== undefined ?
            texture : new THREE.TextureLoader().load( url, success );
    }
}

// wood texture author: Brandon Funk https://gumroad.com/l/wood_floor