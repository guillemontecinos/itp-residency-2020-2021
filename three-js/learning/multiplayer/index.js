// ws implementetion based on Tom Igoe's web socket examples: https://tigoe.github.io/websocket-examples/

const express = require('express')
const path = require('path')

// Instantiate express app
const app = express()

const wsServer = require('express-ws')(app)

let users = []

app.use(express.static('public'))

// on get '/' send user
app.get('/', function (req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

function handleWs(ws, request){
    console.log('New user connected: ' + ws)
    ws.send(JSON.stringify({type: 'user-init', id: users.length}))
    users.push({socket: ws, id: users.length})

    function endUser() {
        let position = users.indexOf(ws);
        users.splice(position, 1);
        console.log("connection closed");
    }

    function messageReceived(m){ 
        const data = JSON.parse(m)
        // console.log(data)
        if(data.type == 'user-setup') {
            console.log('user setup message received')
            
            // broadcast user setup message called new-user to setup new user in all users except from the originary
            users.forEach((user) => {
                // Store user setup data
                if(user.socket == ws) {
                    user.color = data.color
                    user.matrix = data.matrix
                }
                else {
                    // Send to the new user the previous users data
                    ws.send(JSON.stringify({type: 'previous-user', id: user.id, color: user.color, matrix: user.matrix}))
                    // Send to other users the new user setup
                    data.type = 'new-user'
                    user.socket.send(JSON.stringify(data))
                }
            })
        }
        else if(data.type == 'user-update') {
            users.forEach((user) => {
                if(user.socket != ws) {
                    user.socket.send(JSON.stringify({type: 'user-move', matrix: data.matrix, id: data.id}))
                }
            })
        }
    }

    ws.on('message', messageReceived)
    ws.on('close', endUser)
}

// Server init
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log('Server listening on port ' + port)
})

// sockets init
app.ws('/', handleWs)