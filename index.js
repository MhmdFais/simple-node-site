import http from 'http'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8080

const server = http.createServer((req, res) => {

    let filePath = path.join(
        __dirname,
        'public',
        req.url === '/' ? 'index.html' : req.url
    )

    let extension = path.extname(filePath)

    let contentType = 'text/html'

    switch(extension){
        case '.js':
            contentType = 'text/javascript'
            break
        case '.css':
            contentType = 'text/css'
            break
        case '.json':
            contentType = 'application/json'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.jpg':
            contentType = 'image/jpg'
            break
    }

    if (contentType == "text/html" && extension == "") filePath += ".html";

    fs.readFile(filePath, (error, content) => {
        if (error){
            if (error.code === 'ENOENT'){
                fs.readFile(path.join(__dirname, 'public', '404.html'),
                    (error, content) => {
                        if (error) throw error
                        res.writeHead('200', {'Content-Type': 'text/html'})
                        res.end(content, 'utf8')
                    }
                ) 
            }
            else{
                res.writeHead(500)
                res.end(`Server Error: ${error.code}`)
            }
        }
        else {
            res.writeHead(200, {'Content-Type': contentType})
            res.end(content, 'utf8')
        }
    })
})

server.listen(PORT, () => {
    console.log(`server running on port number: ${PORT}`)
})
