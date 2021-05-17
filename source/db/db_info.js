module.exports = (function () {
    return {
        local: {
            host: 'localhost',
            port: '13306',
            user: 'root',
            password: 'mysql',
            database: 'main'
        },
        real: {
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        },
        staging: {
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        },
        dev: {
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        }
    }
})();