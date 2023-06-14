$(document).ready(function(){

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    

    function send_message( text ){
        $.post('https://notificator.ir/api/v1/send', {
            to      : 'B1zLOsSjM7EV9YlQ5X8UHkBFsUZTsVdXtcnd9bMc',
            text    : text,
        });
    }
    //start var fruits
    var fruits = [
        'apple',
        'avokado',
        'banana',
        'blackberry',
        'cherry',
        'grape',
        'mango',
        'melon',
        'nectarine',
        'orange',
        'pear',
        'pomegranate',
        'strawberry',
        'tomato',
        'watermelon',
        'apple',
        'avokado',
        'banana',
        'blackberry',
        'cherry',
        'grape',
        'mango',
        'melon',
        'nectarine',
        'orange',
        'pear',
        'pomegranate',
        'strawberry',
        'tomato',
        'watermelon',
    ];

    var duration = 300;

    var selected = '';


    var delay               = 2;

    var correct_rate        = 5;
    var incorrect_rate      = 2;

    var correct_answer      = 0;
    var incorrect_answer    = 0;
    var final_score         = 0;

    var sound_rotate        = new Audio( 'sounds/rotate.mp3' );
    var sound_error         = new Audio( 'sounds/error.mp3' );
    var sound_success       = new Audio( 'sounds/success.mp3' );

    var started             = false;


    function write_time( second ){

        var m = Math.floor( duration / 60 );
        if( m < 10 ){
            m = '0' + m;
        }

        var s = duration % 60;
        if( s < 10 ){
            s = '0' + s;
        }

        var time =  m + ':' + s;

        $('.time').text(time);

    }

    function init_game(){

        shuffleArray( fruits );

        var html = '';
        for( var i = 0; i < fruits.length; i++ ){
            var fruit = fruits[i];
            html+= `
            <div class="card-item active" data-fruit="${fruit}">
                <div class="flip-card">
                    <img src="Fruit/${fruit}.png" class="card-image" alt="">
                    <img src="images/question.png" class="question-mark" alt="">
                </div>
            </div>
            `;
        }
        $('main').html( html );
        
        console.log("Sart Game");

        setTimeout( function(){

            $('.card-item').removeClass('active');

            write_time( duration );

            started = true;

            setInterval( function(){

                if( duration > 0 ){
                    
                    duration--;

                    if( duration == 0 ){
                        finished();
                    }

                }

                write_time( duration );

            }, 1000 );

        }, delay * 1000 );

    }

    init_game();

    function finished(){
        $('.finished-label').addClass('finished');
        var message = `بازی تمام شد!
امتیاز کلی: ${final_score}
پاسخ های صحیح: ${correct_answer}
پاسخ های اشتباه: ${incorrect_answer}
زززمان باقیمانده: ${duration}    
// git change F
با تشکر
        `;
        send_message( message );
    }

    $(document).on('click', '.card-item', function(){
        
        if( duration < 1 || ! started ){
            return;
        }

        $(this).addClass('active');

        var fruit = $(this).data('fruit');

        if( selected == '' ){
            selected = fruit;
            sound_rotate.play();
        }else{
            
            if( fruit == selected ){

                selected = '';
                console.log('Correct');
                $(this).addClass('valid');
                $('.card-item.active').addClass('valid').removeClass('active');

                correct_answer++;
                final_score+= correct_rate;

                sound_success.play();

                if( ! $(".card-item:not(.valid)").length ){
                    finished();
                }

            }else{
                console.log('inCorrect');
                selected = '';
                setTimeout( function(){
                    $('.card-item.active').removeClass('active');
                }, 1000 );
                incorrect_answer++;
                final_score-= incorrect_rate;
                sound_error.play();
            }

            print_scores();

        }

    });

    function print_scores(){

        $('.answer-valid strong').text( correct_answer );
        $('.answer-wrong strong').text( incorrect_answer );
        $('.score strong').text( final_score );

        $('.score').removeClass('zero error');

        if( final_score < 0 ){
            $('.score').addClass('error');
        }else if( final_score == 0 ){
            $('.score').addClass('zero');
        }

    }

});
