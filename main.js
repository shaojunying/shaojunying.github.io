var trigger = $('#trigger');
var card = $('#card');

trigger.on('click',
    function(){
        if (card.is(':visible')) {
            card.slideUp();
        }else {
            card.load('card.html');
            card.slideDown();
        }
    })
