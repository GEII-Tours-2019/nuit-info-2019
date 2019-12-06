let http = require("http");
let fs = require("fs");
let url = require('url');
let mysql = require("mysql");
let https = require("https");


function getMysql (cb) {
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "loulou123546",
        password: "loulou123",
        database: "nuitinfo"
    });
  
    con.connect(function(err) {
        if (err){
            cb(false, err)
            con.end()
        } else {
            cb(true, con)
        }
    });
}


function saferize (input) {
    return input.toLowerCase().replace(/[éèëê]/gi, "e").replace(/[àäâ]/gi, "a").replace(/[ïî]/gi, "i").replace(/[öô]/gi, "o").replace(/ÿ/gi, "y")
}


function getMime(filename) {
    if(filename.endsWith(".html")){
        return "text/html"
    } else if(filename.endsWith(".css")){
        return "text/css"
    } else if(filename.endsWith(".js")){
        return "application/javascript"
    } else if(filename.endsWith(".json")){
        return "application/json"
    } else if(filename.endsWith(".xml")){
        return "text/xml"
    } else if(filename.endsWith(".csv")){
        return "text/csv"
    } else if(filename.endsWith(".zip")){
        return "application/zip"
    } else if(filename.endsWith(".pdf")){
        return "application/pdf"
    } else if(filename.endsWith(".png")){
        return "image/png"
    } else if(filename.endsWith(".gif")){
        return "image/gif"
    } else if(filename.endsWith(".jpg")){
        return "image/jpeg"
    } else if(filename.endsWith(".mp3")){
        return "audio/mpeg"
    } else if(filename.endsWith(".mp4")){
        return "video/mp4"
    } else if(filename.endsWith(".ogg")){
        return "application/ogg"
    } else if(filename.endsWith(".txt")){
        return "text/plain"
    } else {
        return "application/octet-stream"
    }
}



function AskPage (path, get_d, post_body, request, response) {
    if( path.startsWith("/static/") ){

        let Rpath = path.replace(/\.+/gi, ".")
        fs.readFile("." + Rpath, (err, data) => {

            if (err) {
                console.error(err)
                
                response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                response.end("Coucou, erreur 404 en cours de dev ;) #licorne")

            } else {

                response.writeHead(200, {"Content-Type": getMime(Rpath)})
                response.end(data)

            }

        })
    } else if( path.startsWith("/API/") ) {

        if( path == "/API/get/resultIA" ){
            if( request.method == "POST" ){

                getMysql((isOK, conn) => {
                    if(isOK == true){
                        conn.query("SELECT * FROM DonneesIA;", function (errSelect, result, fields) {
                            if (errSelect) {
                                console.error(errSelect)
                                response.writeHead(503, {"Content-Type": "text/html; charset=utf-8"})
                                response.end("Coucou, where is charly (click on the unicorn to refresh)")
                            } else {

                                let results = {}

                                result.forEach(el => {
                                    if(saferize(post_body).includes(el.mot)){
                                        if(results[el.redirection] != undefined){
                                            results[el.redirection].score += el.score
                                        } else {
                                            results[el.redirection] = {
                                                redirection : el.redirection,
                                                score : el.score,
                                                description : el.description
                                            }
                                        }
                                    }
                                });

                                let sorted = []
                                let tocontinue = true
                                let bestScore = -1
                                let bestValue = {}

                                while (tocontinue == true) {

                                    bestScore = -1
                                    bestValue = {}

                                    for (const k in results) {
                                        if (results.hasOwnProperty(k) && results[k] != undefined) {
                                            const el = results[k];
                                            
                                            if(el.score > bestScore){
                                                bestValue = el
                                                bestScore = el.score
                                            }

                                        }
                                    }

                                    if(bestScore == -1){
                                        tocontinue = false
                                    } else {
                                        sorted.push(bestValue)
                                        results[bestValue.redirection] = undefined
                                    }

                                }

                                

                                console.log(sorted);
                                response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                                response.end(JSON.stringify(sorted))
                            }
                            conn.end()
                        });
                    } else {

                        console.error(conn)
                        response.writeHead(503, {"Content-Type": "text/html; charset=utf-8"})
                        response.end("Coucou, where is charly (click on the unicorn to refresh)")
                    }
                })

            } else {
                response.writeHead(405, {"Content-Type": "text/html; charset=utf-8"})
                response.end("Coucou, ma licorne magique me dit que vous n'avez pas utilisé une requête POST ici")
            }
        }

    } else if ( path.endsWith(".html") ){

        let Rpath = path.replace(/\.+/gi, ".")
        fs.readFile("./html" + Rpath, (err, data) => {

            if (err) {
                console.error(err)
                
                response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                response.end("Coucou, erreur 404 en cours de dev ;) #licorne")

            } else {

                response.writeHead(200, {"Content-Type": getMime(Rpath)})
                response.end(data)

            }

        })
    } else if (path == "/") {

        fs.readFile("./html/v2.html", (err, data) => {

            if (err) {
                console.error(err)
                
                response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                response.end("Coucou, erreur 404 en cours de dev ;) #licorne")

            } else {

                response.writeHead(200, {"Content-Type": getMime(".html")})
                response.end(data)

            }

        })

    } else {   
        response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
        response.end("Coucou, erreur 404 en cours de dev ;) #licorne")
    }
}



let server = http.createServer()
server.on('request', (request, response) => {
    
    let path = url.parse(request.url).pathname
    let get_d = url.parse(request.url).query
    let post_body = ""

    if(request.method == "POST"){
        request.on("data", function (chunk) {
            post_body += chunk
            if (post_body.length > 1e6) {request.connection.destroy()}
        })
        request.on("end", function(){
            AskPage(path, get_d, post_body, request, response)
        })
    } else {
        AskPage(path, get_d, "", request, response)
    }
})

server.listen(4806)



const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/osmoze-rp.com/privkey.pem'),/*  test/fixtures/keys/agent2-key.pem  */
    cert: fs.readFileSync('/etc/letsencrypt/live/osmoze-rp.com/cert.pem')/*  test/fixtures/keys/agent2-cert.pem  */
};

https.createServer(options, (request, response) => {
    
    let path = url.parse(request.url).pathname
    let get_d = url.parse(request.url).query
    let post_body = ""

    if(request.method == "POST"){
        request.on("data", function (chunk) {
            post_body += chunk
            if (post_body.length > 1e6) {request.connection.destroy()}
        })
        request.on("end", function(){
            AskPage(path, get_d, post_body, request, response)
        })
    } else {
        AskPage(path, get_d, "", request, response)
    }

}).listen(443);
