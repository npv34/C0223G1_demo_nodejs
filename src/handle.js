const fs = require("fs");
const qs = require("qs");

const handle = {};

handle.getHomePage = async (req, res) => {
    let data = await handle.readFileHTML('./views/index.html');
    res.writeHead(200);
    res.write(data);
    res.end()
}

handle.getLoginPage = async (req, res) => {
    let data = await handle.readFileHTML('./views/login.html');
    res.writeHead(200);
    res.write(data);
    res.end()
}

handle.login = async (req, res) => {
    let data = []

    req.on('data', chunk => {
         data.push(chunk)
    })
    req.on('end', () => {
        let parsedBody = Buffer.concat(data).toString();
        data = qs.parse(parsedBody);
        // // xu ly login

        if (data.email == 'admin@gmail.com' && data.password == '1234') {
            res.writeHead(301, {location: '/admin'});
            res.end();
        }
    })
}

handle.readFileHTML = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8',(err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

handle.getAdminPage = async (req, res) => {
    let data = await handle.readFileHTML('./views/admin.html');
    res.writeHead(200);
    res.write(data);
    res.end()
}

module.exports = handle;
