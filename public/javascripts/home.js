$(document).ready(function () {
    var to;
    var from;
    var users;

    $.ajax({
        async: false,
        url: '/home',
        type: 'post',
        data: {req: 'uname'},
        success: function (s) {
            from = s
        }
    })

    setInterval(function () {
        setStat("&nbsp");
    }, 5000)


    try {
        
        var socket = io.connect();
        // var socket=io.of('/my');

    } catch (e) {

    }


    if (socket != undefined) {

        socket.emit('newUser', from);
        socket.on('onlineUsers', function (data) {
            users = data;
            $('#onlineusers ul').html('');
            data.forEach(function (s) {
                if (s != from && s != null)
                    $('#onlineusers ul').append('<li><span class="online grn"></span>' + s + '<span class="badge"></span><input type="hidden" value="' + s + '"></li>')
            })

        });
        socket.on('allUsers', function (data) {

            $('#allusers ul').html('');
            data.forEach(function (s) {

                if (s.username != from) {
                    if ($.inArray(s.username, users) > -1)
                        $('#allusers ul').append('<li><span class="online grn"></span>' + s.username + '<span class="badge"></span><input type="hidden" value="' + s.username + '"></li>');
                    else
                        $('#allusers ul').append('<li><span class="online"></span>' + s.username + '<span class="badge"></span><input type="hidden" value="' + s.username + '"></li>');
                }
            })
            getcount(from);

        });
        /* $('#msg').click(function(){
         if ($('.tab-pane ul li').hasClass('selected')) {
         socket.emit('up',{from:from,to:to});

         }
         })*/


        $('#msg').keydown(function (e) {
            updateScroll();
            if (e.keyCode == 13 && e.shiftKey == false) {
                if ($('.tab-pane ul li').hasClass('selected')) {
                    var msg = $('#msg').val();

                    socket.emit('input', {from: from, to: to, msg: msg, read: false});
                } else {
                    setStat("Please select a user to send the message")
                }
                return false;

            }

        })

        $(document).on('click', '.tab-pane ul li', function () {

            $('.tab-pane ul li').removeClass('selected');
            $(this).addClass('selected');
            to = $(this).find('input').val();
            socket.emit('getChat', {from: from, to: to});
            getcount(from);

        })

        socket.on('chtLog', function (s) {

            $('#chatWindow').html('');
            s.forEach(function (data) {
                if (from == data.from)
                    $('#chatWindow').append('<div class="rght triangle-left" >' + data.msg + '<span class="luser">you</span></div>')
                if (from == data.to)
                    $('#chatWindow').append('<div class="lft triangle-right">' + data.msg + '<span class="ruser">' + data.to + '</span></div>')


            })
            updateScroll();
            getcount(from);


        })

        socket.on('status', function (s) {
            if (s.clear)
                $('#msg').val('');

        })

        socket.on('output', function (data) {

            if (from == data.from) {
                $('#chatWindow').append('<div class="rght triangle-left">' + data.msg + '<span class="luser">you</span></div>');
                setStat("Message sent");
            }
            if (from == data.to) {
                if ($('.tab-pane ul li').hasClass('selected') && to==data.to) {
                    $('#chatWindow').append('<div class="lft triangle-right">' + data.msg + '<span class="ruser">' + data.to + '</span></div>')
                }
            }
            updateScroll();
            getcount(from);
        })

        var getcount = function (from) {
            socket.emit('getCount', from);
        }


        socket.on('count', function (s, u) {
            console.log(u + " " + u.length);

            if (u.length > 0) {
                $('#onlineusers li,#allusers li').each(function () {

                    var x = $(this);
                    var v = $(this).find('input').val();
                    u.forEach(function (t) {

                        if (v == t) {
                            console.log(v + " " + t + " " + s[t]);
                            x.find('.badge').html(s[t]);
                        } else {
                            x.find('.badge').html("0");
                        }

                    })
                })
            } else {
                $('.panel-body .badge').html('0');
            }

        })
    }


})
function updateScroll() {
    var element = document.getElementById("chatWindow");
    element.scrollTop = element.scrollHeight;
}

function setStat(s) {
    $('#stat').html(s);
}



