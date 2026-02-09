const fs = require('fs');
try {
    console.log('Requiring routes...');
    require('./routes/analytics');
    fs.writeFileSync('route_status.txt', 'Routes OK');
    console.log('Routes OK');
} catch (e) {
    console.error(e);
    fs.writeFileSync('route_status.txt', 'Routes Failed: ' + e.message + '\n' + e.stack);
}
