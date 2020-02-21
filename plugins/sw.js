if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function() {
            // Registration was successful

        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err); //eslint-disable-line no-console
        });
    });
}