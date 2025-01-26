
//	This is the back end script that handles messages from the front end.
//	The "input" object is exactly the same thing that was given to RPC()
//	on the front end.
//	Use okay() to return a normal response, or fail() to return an error.
//	These correspond to the same okay()/fail() functions given to RPC() on
//	the front end.

//delete require.cache[ module.filename ];

const chatHistory = [];

const chat_clients = {};

function broadcast( message ) {
    console.log( "Broadcasting: # clients = ", Object.keys( chat_clients ).length );
    console.log( "Message: ", message );
    for( let name in chat_clients ) {
        let client = chat_clients[ name ];
        if( client.socket.connected ) {
            console.log( "Sending to ", name );
            client.send( { msg: message } );
        } else {
            console.log( "Dropping ", name );
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
		return okay( "welcome" );
	}
 
   if( transport.type == "WS" ) {

        let { name, socket } = connection;

        chat_clients[ name ] = connection;

        if( action == "text" ) {
            let text = input.text;
            chatHistory.push( text );   
            broadcast( { text, name } );
            return okay( "You sent: "+text );
        }

    }

	fail( "Invalid action: "+action );

};

