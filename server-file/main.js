let http = require("http");
let fs = require("fs");
let url = require('url');
let mysql = require("mysql");


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
        fs.readFile(Rpath, (err, data) => {

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

                                console.log(result);
                                response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                                response.end(JSON.stringify(result))
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
