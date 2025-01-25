import {createServer} from 'http';
import staticHandler from 'serve-handler';
import ws, {WebSocketServer} from 'ws';


const chatHistory = [];

//serve static folder
const server = createServer((req, res) => {   // (1)
	return staticHandler(req, res, {public: 'src'})
});

const wss = new WebSocketServer({server}) // (2)

wss.on('connection', (client) => {
	console.log('Client connected !', chatHistory.toString())
	for(let i = 0; i < chatHistory.length; i++) {
		client.send(chatHistory[i]);
	}
	client.on('message', (msg) => {    // (3)
		console.log(`Message:${msg}`);
		broadcast(msg)
	})
})

function broadcast(msg) {       // (4)
	if(msg.toString() === " ")
	{
		msg = "&nbsp;";
	}
	chatHistory.push(msg.toString());

	for (const client of wss.clients) {
		if (client.readyState === ws.OPEN) {
			client.send(msg.toString())
		}
	}
}

server.listen(process.argv[2] || 8080, () => {
	console.log(`server listening...`);
})