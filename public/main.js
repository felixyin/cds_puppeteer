function tmpl(id, data) {
    var html = document.getElementById(id).innerHTML;
    var result = "var p=[];with(obj){p.push('"
        + html.replace(/[\r\n\t]/g, " ")
            .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
            .replace(/<%/g, "');")
            .replace(/%>/g, "p.push('")
        + "');}return p.join('');";
    var fn = new Function("obj", result);
    return fn(data);
}


var socket = io();

socket.on('queryResult', (data) => {
    var resultHtml = tmpl("user_tmpl", users);
    $('#resultBody').html(resultHtml);
});

socket.on('disconnect', () => {
    console.log('you have been disconnected');
});

socket.on('reconnect', () => {
    console.log('you have been reconnected');
});

socket.on('reconnect_error', () => {
    console.log('attempt to reconnect has failed');
});
//
// setTimeout(function () {
//     socket.emit('query', 'furniture');
// }, 1000);

var users = [
    {"name": "Byron", "url": "http://localhost"},
    {"name": "Casper", "url": "http://localhost"},
    {"name": "Frank", "url": "http://localhost"}
];


$('#queryBtn').click(function () {
    var queryStr = $('#query').val();
    console.log(queryStr);

    socket.emit('query', queryStr);
});
