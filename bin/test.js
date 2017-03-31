#!/user/bin/env node

var cp = require('child_process');

var script = process.env.CI ? 'test-ci' : 'test-local';
var node = cp.spawn('npm', ['run', script], { stdio: 'inherit' });
node.on('close', function(code) {
  process.exit(code);
});
