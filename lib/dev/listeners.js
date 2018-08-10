

function debugListeners() {
  if (typeof document === 'undefined') {
    throw new Error('Attempted to add listeners before document was available.');
  }
  else {
    //console.log("adding debug listeners...");
  
// aframe events
document.body.addEventListener('hitend', function (evt) {
  console.log('hitend');
});
document.body.addEventListener('hit', function (evt) {
  console.log('hit');
});
document.body.addEventListener('grabend', function (evt) {
  console.log('grabend');
});
document.body.addEventListener('pulse', function (evt) {
  console.log('pulse');
});
document.body.addEventListener('model-loaded', function (evt) {
  console.log('model-loaded');
});
document.body.addEventListener('model-error', function (evt) {
  console.log('model-error');
});
document.body.addEventListener('sound-loaded', function (evt) {
  console.log('sound-loaded');
});
document.body.addEventListener('textfontset', function (evt) {
  console.log('textfontset');
});
document.body.addEventListener('animationend', function (evt) {
  console.log('animationend');
});
document.body.addEventListener('animationstart', function (evt) {
  console.log('animationstart');
});
document.body.addEventListener('animationstop', function (evt) {
  console.log('animationstop');
});
document.body.addEventListener('loaded', function (evt) {
  console.log('loaded');
});
document.body.addEventListener('timeout', function (evt) {
  console.log('timeout');
});
document.body.addEventListener('progress', function (evt) {
  console.log('progress');
});
document.body.addEventListener('error', function (evt) {
  console.log('error');
});
document.body.addEventListener('object3dset', function (evt) {
  console.log('object3dset');
});
document.body.addEventListener('object3dremove', function (evt) {
  console.log('object3dremove');
});
document.body.addEventListener('child-attached', function (evt) {
  console.log('child-attached');
});
document.body.addEventListener('child-detached', function (evt) {
  console.log('child-detached');
});
document.body.addEventListener('componentremoved', function (evt) {
  console.log('componentremoved');
});
document.body.addEventListener('play', function (evt) {
  //console.log('play');
});
document.body.addEventListener('pause', function (evt) {
  console.log('pause');
});
document.body.addEventListener('stateadded', function (evt) {
  console.log('stateadded');
});
document.body.addEventListener('stateremoved', function (evt) {
  console.log('stateremoved');
});
document.body.addEventListener('nodeready', function (evt) {
  console.log('nodeready');
});
document.body.addEventListener('componentchanged', function (evt) {
  console.log('componentchanged');
});
document.body.addEventListener('componentinitialized', function (evt) {
  console.log('componentinitialized');
});
document.body.addEventListener('schemachanged', function (evt) {
  console.log('schemachanged');
});
document.body.addEventListener('enter-vr', function (evt) {
  console.log('enter-vr');
});
document.body.addEventListener('exit-vr', function (evt) {
  console.log('exit-vr');
});
document.body.addEventListener('renderstart', function (evt) {
  console.log('renderstart');
});
document.body.addEventListener('render-target-loaded', function (evt) {
  console.log('render-target-loaded');
});
document.body.addEventListener('camera-ready', function (evt) {
  console.log('camera-ready');
});
document.body.addEventListener('camera-set-active', function (evt) {
  console.log('camera-set-active');
});
document.body.addEventListener('camera-set-spectator', function (evt) {
  console.log('camera-set-spectator');
});
document.body.addEventListener('controllersupdated', function (evt) {
  console.log('controllersupdated');
});
document.body.addEventListener('materialtextureloaded', function (evt) {
  console.log('materialtextureloaded');
});
document.body.addEventListener('materialvideoloadeddata', function (evt) {
  console.log('materialvideoloadeddata');
});
document.body.addEventListener('materialvideoended', function (evt) {
  console.log('materialvideoended');
});
document.body.addEventListener('controllerconnected', function (evt) {
  console.log('controllerconnected');
});
document.body.addEventListener('controllerdisconnected', function (evt) {
  console.log('controllerdisconnected');
});

// networked aframe hooks
document.body.addEventListener('clientConnected', function (evt) {
  console.log('clientConnected');
});
document.body.addEventListener('clientDisconnected', function (evt) {
  console.log('clientDisconnected');
});
document.body.addEventListener('entityCreated', function (evt) {
  console.log('entityCreated');
});
document.body.addEventListener('entityDeleted', function (evt) {
  console.log('entityDeleted');
});
document.body.addEventListener('ownership-gained', function (evt) {
  console.log('ownership-gained');
});
document.body.addEventListener('ownership-lost', function (evt) {
  console.log('ownership-lost');
});
document.body.addEventListener('ownership-changed', function (evt) {
  console.log('ownership-changed');
});

// aframe-gui events
document.body.addEventListener('click', function (evt) {
    console.log('click');
  });
document.body.addEventListener('hovergui', function (evt) {
  console.log('hovergui');
});
document.body.addEventListener('leavegui', function (evt) {
  console.log('leavegui');
});
document.body.addEventListener('start-fusing', function (evt) {
  console.log('start-fusing');
});
document.body.addEventListener('fadeOut', function (evt) {
  console.log('fadeOut');
});
document.body.addEventListener('radioAnimation', function (evt) {
  console.log('radioAnimation');
});
document.body.addEventListener('toggleAnimation', function (evt) {
  console.log('toggleAnimation');
});
  }
}

export default debugListeners