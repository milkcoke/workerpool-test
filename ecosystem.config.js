module.exports = {
    apps: [{
        name   : "workerpool_test",
        script : "dist/app.js",
        exec_mode: 'cluster',
        // max_memory_restart: '4G',
        // max_old_space_size: '4096M',
        // node_args: '--expose-gc',
        // instances: 6,
        watch: ['dist'],
        // ignore_watch: ['**/logs/*', 'dist'],
        // out_file: 'logs/out.log',
        // error_file: 'logs/error.log',
    }]
}

// CLI
// pm2 start dist/test_node14.js --name "another_app" -i 2 --watch
// pm2 start dist/test_node16.js --name "node_test" -i 6 --watch
