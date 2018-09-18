var trigger = $('#trigger');
var card = $('#card');
var loaded = false;

trigger.on('mouseenter',
    function(){
        if (!loaded) {
            card.load('card.html');
            loaded = true;
        }
        card.slideDown(100);
    })
trigger.on('mouseleave',
function() {
        card.slideUp(100);
})

var form = $('search');
var input = $('input#username');
var result = $('#result');
var username;
form.on('submit',function(e){
    e.preventDefault();
    username= input.val();
    $.ajax('https://api.github.com/users/'+username)
    .done(function(data){
        var html =
        '<div>用户名：'+data.login +'</div>'+
        '<div>name' + data.name+'</div>'+
        '<div>介绍' + data.bio+'</div>'+
        '<div>地点' + data.location+'</div>'+
        '<div>博客' + data.blog+'</div>'
        result.html(html);
    });
})
