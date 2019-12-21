import WebFont from 'webfontloader';

LoadWebFonts();

document.addEventListener('font-awesome-system-initialized', (evt) => {
    var scene = evt.detail.scene;
    var behavior = {
      el: scene,
      get tick() {
        return function() {
          scene.systems['font-awesome'].setVersion("'Font Awesome 5 Pro'");
          LoadWebFonts();
          scene.removeBehavior(this);
        }
      }
    }
    scene.addBehavior(behavior);
})

function LoadWebFonts() {
  var WebFontConfig = {
    custom: {
      families: ['FontAwesome', '"Font Awesome 5 Pro"',
      '"Font Awesome 5 Free"', '"Font Awesome 5 Brands"']
    },
  };
  WebFont.load(WebFontConfig);
}
