export default class TextureLoaderHelper {
    constructor() {
        this.baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/';
        this.brassUrl = this.baseUrl + 'brass/';
        this.bronzeUrl = this.baseUrl + 'bronze/';
        this.woodUrl = this.baseUrl + 'wood/floor/';
        this.woodPanelUrl = this.baseUrl + 'wood/panel/';

        this.materialUrls = {
            'brass': this.brassUrl,
            'bronze': this.bronzeUrl,
            'wood': this.woodUrl,
            'wood-panel': this.woodPanelUrl
          };
    }

    loadTexture(material, type='base', quality='l', ext='jpg', onLoad, onProgress, onError) {
        const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
        return new THREE.TextureLoader().load( url, onLoad, onProgress, onError );
    }

    getOrLoadTexture(material, type='base', quality='l', ext='jpg', onLoad, onProgress, onError) {
        const url = this.materialUrls[material] + type + '-' + quality + '.' + ext;
        
        var texture =  THREE.Cache.files[url];
        if (texture !== undefined) {
            onLoad(texture);
        }
        return texture !== undefined ?
            texture : new THREE.TextureLoader().load( url, onLoad, onProgress, onError );
    }

    getVideoTexture(url, onLoad, onProgress, onError) {
        var id = this.videoIdFromUrl(url);
        var videoEl = document.querySelector('#' + id);
        if  (videoEl != undefined) {
            onLoad(new THREE.VideoTexture( videoEl ));
            return;
        }
        var assets = AFRAME.scenes[0].querySelector('a-assets');
        try {
            videoEl = document.createElement('video');
            videoEl.setAttribute('id', id);
            videoEl.setAttribute('crossorigin', 'anonymous');
            videoEl.setAttribute('src', url);
            videoEl.addEventListener('loadedmetadata', (event) => {
                onLoad(new THREE.VideoTexture( videoEl ));
            });
            assets.appendChild(videoEl);
        }
        catch (error) {
            console.log(`getVideoTexture(${url}) error`);
            console.log(error);
            onError(error);
        }
    }

    videoIdFromUrl(url) {
        return url.match(/\/*(\w+\.\w+)$/)[1];
    }
}

// wood texture author: Brandon Funk https://gumroad.com/l/wood_floor