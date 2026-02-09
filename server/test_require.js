try {
    require('./controllers/analytics.controller');
    console.log('Require successful');
} catch (err) {
    console.error(err);
}
