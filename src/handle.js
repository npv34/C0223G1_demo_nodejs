const fs = require("fs");
const qs = require("qs");

const handle = {};

handle.getHomePage = async (req, res) => {
    let data = await handle.readFileData('./views/index.html');
    res.writeHead(200);
    res.write(data);
    res.end()
}

handle.getLoginPage = async (req, res) => {
    let data = await handle.readFileData('./views/login.html');
    res.writeHead(200);
    res.write(data);
    res.end()
}

handle.login = async (req, res) => {
    let data = []

    req.on('data', chunk => {
         data.push(chunk)
    })
    req.on('end',async () => {
        let parsedBody = Buffer.concat(data).toString();
        data = qs.parse(parsedBody);
        // xu ly login
        let dataJSon = await handle.readFileData('./data.json');

        dataJSon = JSON.parse(dataJSon.toString());

        let {email, password} = data;

        let userLogin = dataJSon.filter(item => item.email === email && item.password === password)

        if (userLogin.length > 0) {
            // luu thong tin user login
            let nameFileSession = "user";
            await handle.writeFileData("./session/" + nameFileSession, JSON.stringify(userLogin[0]) )
            //
            res.writeHead(301, {location: '/admin'});
            res.end();
        }else {
            res.writeHead(301, {location: '/login'});
            res.end();
        }
    })
}

handle.readFileData = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8',(err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

handle.writeFileData = async (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err.message)
            }
            resolve()
        })
    })
}

handle.deleteFileData = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err.message)
            }
            resolve()
        })
    })
}


handle.getAdminPage = async (req, res) => {
    try {
        let userLogin = await handle.readFileData('./session/user')
        let data = await handle.readFileData('./views/admin.html');
        data = data.replace('{username}', JSON.parse(userLogin.toString()).email)
        res.writeHead(200);
        res.write(data);
        res.end()
    }catch (err) {
        res.writeHead(301, {location: '/login'});
        res.end();
    }

}

handle.logout = async (req, res) => {
    await handle.deleteFileData('./session/user');
    res.writeHead(301, {location: '/login'});
    res.end();
}

handle.getUserList = async (req, res) => {
    let userLogin = await handle.readFileData('./session/user')
    let data = await handle.readFileData('./views/users/userList.html');
    data = data.replace('{username}', JSON.parse(userLogin.toString()).email)

    let dataJSon = await handle.readFileData('./data.json');

    dataJSon = JSON.parse(dataJSon.toString());
    let html = "";
    dataJSon.forEach((item, index) => {
        html += "<tr>";
        html += `<td>${index+ 1}</td>`;
        html += `<td>${item.email}</td>`;
        html += `<td>${item.phone}</td>`;
        html += "</tr>";
    })

    data = data.replace('{list-user}', html)
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(data)
    res.end();
}

module.exports = handle;
