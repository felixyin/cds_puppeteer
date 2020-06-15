var redis = require("redis");

try{
    var client = redis.createClient(6379, "localhost");

    client.on(
        "error",
        function(err){
            console.log("err"+err);
        }

    );
    client.on('ready',
        function(){
            client.publish('testFirst',"hi! first!");
            client.publish('testSecond',"hi! second!");
            client.end();
        }
    );
}
catch(e){
    console.log("err:"+e);
}

