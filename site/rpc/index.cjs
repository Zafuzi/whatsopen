
//	This is the back end script that handles messages from the front end.
//	The "input" object is exactly the same thing that was given to RPC()
//	on the front end.
//	Use okay() to return a normal response, or fail() to return an error.
//	These correspond to the same okay()/fail() functions given to RPC() on
//	the front end.

delete require.cache[ module.filename ];

let chatHistory = globalThis._ch;
if( ! chatHistory ) {
    chatHistory = [];
    globalThis._ch = chatHistory;
}

let chat_clients = globalThis._cc;
if( ! chat_clients ) {
    chat_clients = {};
    globalThis._cc = chat_clients;
}

function broadcast( message ) {
    for( let name in chat_clients ) {
        let client = chat_clients[ name ];
        if( client.socket.connected ) {
            client.send( { msg: message } );
        } else {
            delete chat_clients[ name ];
        }
    }
}

module.exports = ( input, okay, fail, transport ) => {

    let { type, connection } = transport;
    console.warn( type, connection.socket.connected );
    
    console.warn( input );

	const action = input.action;
    console.warn( "Action: ", action );

	if( action == "hello" ) {
        return okay( { history: chatHistory } );
    }

   if( transport.type == "WS" ) {

        if( input.nick ) {
            connection.nick = input.nick;
        }

        let { name, socket, nick } = connection;

        chat_clients[ name ] = connection;

        if( action == "text" ) {
            let text = input.text;

            let msg_out = { text, name, from: connection.nick };       

            chatHistory.push( msg_out );
            if( chatHistory.length > 100 ) {
                chatHistory.shift();
            }

            broadcast( msg_out );

            return okay( msg_out );
        }

    }

	fail( "Invalid action: "+action );

};

