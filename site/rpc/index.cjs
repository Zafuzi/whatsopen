
//	This is the back end script that handles messages from the front end.
//	The "input" object is exactly the same thing that was given to RPC()
//	on the front end.
//	Use okay() to return a normal response, or fail() to return an error.
//	These correspond to the same okay()/fail() functions given to RPC() on
//	the front end.


const chatHistory = [];

function broadcast( message ) {
    console.log( message );
}

module.exports = ( input, okay, fail, transport ) => {

    console.log( transport );
    console.log( input );

	const action = input.action;

	if( action == "hello" ) {
		return okay( "welcome" );
	}


	if( action == "message" ) {
        let message = input.message;
		chatHistory.push( message );
        broadcast( message );
		return okay( true );
	}

	if( action == "getChatHistory" ) {
		return okay( chatHistory );
	}

	fail( "Invalid action: "+action );

};

