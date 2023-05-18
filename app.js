const http = require('http');
const fs = require('fs');
const url = require('url');
const handle = require('./src/handle');

const PORT = 8000

const server = http.createServer((req, res) => {
    let urlPath = url.parse(req.url).pathname;
    let methodRe = req.method;
    switch (urlPath) {
        case '/login':
            if (methodRe == 'GET') {
                handle.getLoginPage(req, res).catch(err => {
                    console.log(err.message);
                })
            } else {
                handle.login(req, res).catch(err => {
                    console.log(err.message);
                })
            }
            break;
        case '/':
            handle.getHomePage(req, res).catch(err => {
                console.log(err.message);
            })
            break;
        case '/admin':
            handle.getAdminPage(req, res).catch(err => {
                console.log(err.message);
            })
            break;
        case '/logout':
            handle.logout(req, res).catch(err => {
                console.log(err.message);
            })
            break;

        case '/users':
            handle.getUserList(req, res).catch(err => {
                console.log(err.message);
            })
            break;

        default:
            res.end()
    }


})

server.listen(PORT, 'localhost', () => {
    console.log('Server listening on port ' + PORT)
})
