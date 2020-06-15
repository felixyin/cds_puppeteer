var sys = require("sys");
try{
    var client = require("redis").createClient(6379, "localhost");

    sys.puts("waiting for messages...");

    client.on(
        "error",
        function(err){
            console.log("err"+err);
        }
    );


    client.on('subscribe',
        function(channel,count){
            console.log("channel:" + channel + ", count:"+count);
        }
    );
    client.on('message',
        function(channel,message){
            console.log("channel:" + channel + ", msg:"+message);
        }
    );
    client.on('unsubscribe',
        function(channel,count){
            console.log("channel:" + channel + ", count:"+count);
        }
    );

    client.subscribe("testSecond");

} catch(e){
    console.log("err:"+e);
}

