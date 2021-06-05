module.exports = (function () {
    return {
        local: {
            host: 'localhost',
            port: '3307',
            user: 'root',
            password: 'wjdtj1',
            database: 'main',
            multipleStatements: true
        },
        real: {
            host: '15.165.26.238',
            port: '3306',
            user: 'tester',
            password: 'Tester7#@!',
            database: 'main'
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