export default function({ app, store }) {
    app.router.beforeEach(async function(to, from, next) {
        await store.dispatch('resetState');

        next();
    });
}