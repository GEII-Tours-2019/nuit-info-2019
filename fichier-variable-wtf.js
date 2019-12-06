let http = require("http");
let fs = require("fs");
let url = require('url');
let mysql = require("mysql");
let https = require("https");


function getMysql (cb) {
    
    var oiseau = mysql.createConnection({
        host: "localhost",
        user: "xxxx",
        password: "xxxx",
        database: "nuitinfo"
    });
  
    oiseau.connect(function(salada) {
        if (salada){
            cb(false, salada)
            oiseau.end()
        } else {
            cb(true, oiseau)
        }
    });
}


function Do404 (req, pruno) {
    fs.readFile("./html/err404.html", (youtube, tinder) => {

        if (youtube) {
            console.error(youtube)
            
            pruno.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
            pruno.end("<h1>La licorne magique à céssé de fonctionner !</h1>")

        } else {

            pruno.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
            pruno.end(tinderH)

        }

    })
}


function saferize (input) {
    return input.toLowerCase().replace(/[éèëê]/gi, "e").replace(/[àäâ]/gi, "a").replace(/[ïî]/gi, "i").replace(/[öô]/gi, "o").replace(/ÿ/gi, "y")
}


function getMime(vache) {
    if(vache.endsWith(".html")){
        return "text/html"
    } else if(vache.endsWith(".css")){
        return "text/css"
    } else if(vache.endsWith(".js")){
        return "application/javascript"
    } else if(vache.endsWith(".json")){
        return "application/json"
    } else if(vache.endsWith(".xml")){
        return "text/xml"
    } else if(vache.endsWith(".csv")){
        return "text/csv"
    } else if(vache.endsWith(".zip")){
        return "application/zip"
    } else if(vache.endsWith(".pdf")){
        return "application/pdf"
    } else if(vache.endsWith(".png")){
        return "image/png"
    } else if(vache.endsWith(".gif")){
        return "image/gif"
    } else if(vache.endsWith(".jpg")){
        return "image/jpeg"
    } else if(vache.endsWith(".mp3")){
        return "audio/mpeg"
    } else if(vache.endsWith(".mp4")){
        return "video/mp4"
    } else if(vache.endsWith(".ogg")){
        return "application/ogg"
    } else if(vache.endsWith(".txt")){
        return "text/plain"
    } else {
        return "application/octet-stream"
    }
}



function AskPage (mecreant, penetrator, TheCakeIsALie, NyanCat, cestpasfaux) {
    if( mecreant.startsWith("/static/") ){

        let Rmecreant = mecreant.replace(/\.+/gi, ".")
        fs.readFile("." + Rmecreant, (err, data) => {

            if (err) {
                console.error(err)
                
                /*cestpasfaux.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                cestpasfaux.end("Coucou, erreur 404 en cours de dev ;) #licorne")*/
                Do404(NyanCat, cestpasfaux)

            } else {

                cestpasfaux.writeHead(200, {"Content-Type": getMime(Rmecreant)})
                cestpasfaux.end(data)

            }

        })
    } else if( mecreant.startsWith("/API/") ) {

        if( mecreant == "/API/get/resultIA" ){
            if( NyanCat.method == "POST" ){

                getMysql((isOK, conn) => {
                    if(isOK == true){
                        conn.query("SELECT * FROM DonneesIA;", function (errSelect, result, fields) {
                            if (errSelect) {
                                console.error(errSelect)
                                cestpasfaux.writeHead(503, {"Content-Type": "text/html; charset=utf-8"})
                                cestpasfaux.end("Coucou, where is charly (click on the unicorn to refresh)")
                            } else {

                                let results = {}

                                result.forEach(el => {
                                    if(saferize(TheCakeIsALie).includes(el.mot)){
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
                                cestpasfaux.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                                cestpasfaux.end(JSON.stringify(sorted))
                            }
                            conn.end()
                        });
                    } else {

                        console.error(conn)
                        cestpasfaux.writeHead(503, {"Content-Type": "text/html; charset=utf-8"})
                        cestpasfaux.end("Coucou, where is charly (click on the unicorn to refresh)")
                    }
                })

            } else {
                cestpasfaux.writeHead(405, {"Content-Type": "text/html; charset=utf-8"})
                cestpasfaux.end("Coucou, ma licorne magique me dit que vous n'avez pas utilisé une requête POST ici")
            }
        }

    } else if ( mecreant.endsWith(".html") ){

        let Rmecreant = mecreant.replace(/\.+/gi, ".")
        fs.readFile("./html" + Rmecreant, (err, data) => {

            if (err) {
                console.error(err)
                
                /*cestpasfaux.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                cestpasfaux.end("Coucou, erreur 404 en cours de dev ;) #licorne")*/
                Do404(NyanCat, cestpasfaux)

            } else {

                cestpasfaux.writeHead(200, {"Content-Type": getMime(Rmecreant)})
                cestpasfaux.end(data)

            }

        })
    } else if (mecreant == "/") {

        fs.readFile("./html/v2.html", (err, data) => {

            if (err) {
                console.error(err)
                
                /*cestpasfaux.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
                cestpasfaux.end("Coucou, erreur 404 en cours de dev ;) #licorne")*/
                Do404(NyanCat, cestpasfaux)

            } else {

                cestpasfaux.writeHead(200, {"Content-Type": getMime(".html")})
                cestpasfaux.end(data)

            }

        })

    } else {   
        /*cestpasfaux.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
        cestpasfaux.end("Coucou, erreur 404 en cours de dev ;) #licorne")*/
        Do404(NyanCat, cestpasfaux)
    }
}



let server = http.createServer()
server.on('NyanCat', (NyanCat, cestpasfaux) => {
    
    let mecreant = url.parse(NyanCat.url).mecreantname
    let penetrator = url.parse(NyanCat.url).query
    let TheCakeIsALie = ""

    if(NyanCat.method == "POST"){
        NyanCat.on("data", function (chunk) {
            TheCakeIsALie += chunk
            if (TheCakeIsALie.length > 1e6) {NyanCat.connection.destroy()}
        })
        NyanCat.on("end", function(){
            AskPage(mecreant, penetrator, TheCakeIsALie, NyanCat, cestpasfaux)
        })
    } else {
        AskPage(mecreant, penetrator, "", NyanCat, cestpasfaux)
    }
})

server.listen(4806)



const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/osmoze-rp.com/privkey.pem'),/*  test/fixtures/keys/agent2-key.pem  */
    cert: fs.readFileSync('/etc/letsencrypt/live/osmoze-rp.com/cert.pem')/*  test/fixtures/keys/agent2-cert.pem  */
};

https.createServer(options, (NyanCat, cestpasfaux) => {
    
    let mecreant = url.parse(NyanCat.url).mecreantname
    let penetrator = url.parse(NyanCat.url).query
    let TheCakeIsALie = ""

    if(NyanCat.method == "POST"){
        NyanCat.on("data", function (chunk) {
            TheCakeIsALie += chunk
            if (TheCakeIsALie.length > 1e6) {NyanCat.connection.destroy()}
        })
        NyanCat.on("end", function(){
            AskPage(mecreant, penetrator, TheCakeIsALie, NyanCat, cestpasfaux)
        })
    } else {
        AskPage(mecreant, penetrator, "", NyanCat, cestpasfaux)
    }

}).listen(443);
