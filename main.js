var trigger = $('#trigger');
var card = $('#card');

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

$.ajax('http://api.github.com/users/shaojunying')
    .done(function(data) {
        console.log("data:",data);
    })
