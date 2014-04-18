(function(){
    var noteChanges = false,
        calcResult = true,
        container = $('.container'),
        icons = $('.desktop .icons'),
        drag, dialogWindow, textArea;

    //  Старт Windows
    setTimeout(function(){
        container.removeClass('start-windows');
    }, 2000);
    setTimeout(function(){
        $('.start-menu').show();
        $('.play-start-windows')[0].play();
    }, 3000);
    setTimeout(function(){
        for(i=0; i<icons.length; i+=2) {
            (function(i) {
                setTimeout(function(){
                    $(icons[i]).show();
                    $(icons[i+1]).show();
                }, i*70);
            })(i);
        }
    }, 4000);

    //  Удаление(перетаскивание) в корзину
    $('.icons').draggable({
        containment: 'parent',
        drag: function(){
            drag = $(this);
        }
    });
    $('.icons.recycle').droppable({
        drop: function() {
            $(this).removeClass('empty').addClass('full');
            drag.appendTo('.win-recycle .wrap')
                .css({'top': '0px', 'left': '0px'})
        }
    });
    //  Очистка корзины
    $('.clear-recycle').click(function(){
        $('.win-recycle .wrap').html('');
        $('.icons.recycle').removeClass('full').addClass('empty');
        $('.play-recycle-clean')[0].play();
    });

    //  Мой компьютер
    $('.win-my-comp').dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        minWidth: 250,
        position: 'center',
        closeOnEscape: false,
        resizable: true,
        title: 'Мой компьютер',
        dialogClass: 'my-comp',
        close: function() {
            $('.task-my-comp').remove();
            $(this).parents('.ui-dialog').find('.ui-dialog-titlebar-resize').data('resize', 'false');
        }
    });

    //  Корзина
    $('.win-recycle').dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        minWidth: 250,
        position: 'center',
        closeOnEscape: false,
        resizable: true,
        title: 'Корзина',
        dialogClass: 'recycle',
        close: function() {
            $('.task-recycle').remove();
            $(this).parents('.ui-dialog').find('.ui-dialog-titlebar-resize').data('resize', 'false');
        }
    });

    //  Калькулятор
    $('.win-calculator').dialog({
        autoOpen: false,
        height: 'auto',
        width: 184,
        position: 'center',
        closeOnEscape: false,
        resizable: false,
        draggable: true,
        title: 'Калькулятор',
        dialogClass: 'calculator',
        close: function() {
            $('.task-calculator').remove();
            $('.screen').html('');
        }
    });

    //  Блокнот
    $('.win-notepad').dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        minWidth: 250,
        position: 'center',
        closeOnEscape: false,
        resizable: true,
        draggable: true,
        title: 'Блокнот',
        dialogClass: 'notepad',
        close: function() {
            $('.task-notepad').remove();
            $(this).parents('.ui-dialog').find('.ui-dialog-titlebar-resize').data('resize', 'false');
        }
    });
    textArea = $('.notepad textarea');
    textArea.change(function(){
        noteChanges = true;
    });
    //  Окно при закрытии блокнота
    $('.notepad .ui-dialog-titlebar-close').unbind('click').click(noteClose);
    function noteClose(){
        if(noteChanges){
            $('.quit-message-wrap').show();
        } else {
            $('.win-notepad').dialog('close');
        }
    }
    //  Нажатия на кнопки в окне закрытия блокнота
    $('.message-button').click(function(){
        if($(this).val() === 'yes') {
            localStorage.setItem('notepad', textArea.val());
            $('.win-notepad').dialog('close');
            $('.quit-message-wrap').hide();
            noteChanges = false;
        } else if($(this).val() === 'no') {
            textArea.val(localStorage.getItem('notepad', textArea.val()));
            $('.win-notepad').dialog('close');
            $('.quit-message-wrap').hide();
            noteChanges = false;
        } else {
            $('.quit-message-wrap').hide();
        }
    });

    //  Сапер
    $('.win-mineweeper').dialog({
        autoOpen: false,
        height: 'auto',
        width: 'auto',
        position: 'center',
        closeOnEscape: false,
        resizable: false,
        draggable: true,
        title: 'Сапер',
        dialogClass: 'mineweeper',
        close: function() {
            $('.task-mineweeper').remove();
        }
    });

    //  Winamp
    $('.win-winamp').dialog({
        autoOpen: false,
        height: 'auto',
        width: 'auto',
        position: 'center',
        closeOnEscape: false,
        resizable: false,
        draggable: true,
        dialogClass: 'winamp',
        close: function() {
            $('.task-winamp').remove();
        }
    });

    //  Запуск программ Windows
    $('.icon.desk').dblclick(function(){
        var that = $(this).data('window'),
            name = $(this).next().html();
        if($('.task-' + that).html()) {
            return
        } else if(that === 'shri') {
            window.location = 'gallery.html'
        } else if(that === 'winamp') {
            $('.b-player').appendTo('.win-winamp').show();
        }
        $('.win-' + that).dialog('open');
        $('.task.active').removeClass('active');
        $('.taskbar').append('<div class="task task-' +that+' active" data-window="'+that+'" data-mini="false"><span class="task-icon"></span><span class="task-text"> '+ name +' </span></div>');
    });

    //  Завершение работы
    $('.win-shutdown').dialog({
        autoOpen: false,
        height: 'auto',
        width: 'auto',
        minHeight: 0,
        position: 'center',
        resizable: false,
        draggable: false,
        title: 'Завершение работы с Windows',
        dialogClass: 'shutdown',
        modal: true
    });
    $('.but-shutdown').click(function(){
        $('.win-shutdown').dialog('open');
    });
    //  Завершение работы, нажатия на кнопки
    $('.sd-but').click(function(){
        var windows = [$('.win-my-comp'), $('.win-recycle'), $('.win-calculator'), $('.win-mineweeper'), $('.win-winamp')];

        if($(this).val() === 'yes') {
            $('.win-shutdown').dialog('close');
            noteClose();

            var confirmClose = setInterval(function(){
                if(!noteChanges) {
                    shutdown();
                    clearInterval(confirmClose)
                }
            }, 1000);

            function shutdown(){
                for(i=0; i<windows.length; i++) {
                    (function(i) {
                        setTimeout(function(){
                            windows[i].dialog('close');
                        }, i*500);
                    })(i);
                }
                for(i=0; i<icons.length; i+=2) {
                    (function(i) {
                        setTimeout(function(){
                            $(icons[i]).html('');
                            $(icons[i+1]).html('');
                        }, i*70);
                    })(i);
                }
                $('.start-menu').hide();
                setTimeout(function(){
                    $('.play-shutdown')[0].play();
                }, 700);
                setTimeout(function(){
                    container.addClass('shutdown');
                }, 1400);
                if($('#yes').prop("checked")) {
                    setTimeout(function(){
                        container.removeClass('shutdown').addClass('poweroff');
                        container.html('');
                    }, 4000);
                } else {
                    setTimeout(function() {
                        location.reload()
                    }, 4000)
                }
            }
        }else if($(this).val() === 'no'){
            $('.win-shutdown').dialog('close');
        } else {
            return;
        }
    });

    //  Активация таска при нажатии на окно
    dialogWindow = $('.ui-dialog');
    dialogWindow.mousedown(function(){
        $('.task.active').removeClass('active');
        $('.task-' + $(this).find('.ui-dialog-content').data('window')).addClass('active');
    });
    dialogWindow.resize(function(){
        $('.ui-dialog-content').css({'width': 100 + '%', height: 'calc(100% - 19px)'});
    });

    //  Переключение окон по нажатию на таскбар
    $(document).on('click', '.task', function() {
        var dialogWindow = $('.ui-dialog.' + $(this).data('window')),
            thisDialog = $('.win-' + $(this).data('window')),
            thisTask = $('.task-' + $(this).data('window'));
        $('.task.active').removeClass('active');
        $(this).addClass('active');
        if(thisTask.data('mini')) {
            dialogWindow.animate({
                'top': (($(window).height() / 2) - (dialogWindow.height() / 2)) + 'px',
                'left': (($(window).width() / 2) - (dialogWindow.width() / 2)) + 'px'
            }, 30);
            thisDialog.dialog('moveToTop');
            thisTask.data('mini', false)
        } else {
            thisDialog.dialog('moveToTop');
        }
    });

    //  Размер окон. Кнопка Resize
    $('.ui-dialog-titlebar-resize').click(function(){
        var parent = $(this).parents('.ui-dialog');
        if(parent.hasClass('calculator') || parent.hasClass('mineweeper')) {
            return;
        } else {
            if($(this).data('resize')) {
               $(this).parents('.ui-dialog')
                   .css({'width': 'calc(100% - 2px)',
                       'height': 'calc(100% - 27px)',
                       'left': '0',
                       'top': '0' });
               $(this).parents('.ui-dialog').find('.ui-dialog-content')
                   .css({'width': '100%',
                       'height': 'calc(100% - 19px)'
                       });
               $(this).data('resize', false);
            } else {
               $(this).parents('.ui-dialog')
                   .css({'width': '600px',
                       'height': '400px',
                       'left': 'calc(50% - 300px)',
                       'top': 'calc(50% - 200px)' });
               $(this).parents('.ui-dialog').find('.ui-dialog-content')
                   .css({'width': '100%',
                         'height': 'calc(100% - 19px)'
                   });
               $(this).data('resize', true);
           }
       }
    });

    //  Свернуть
    $('.ui-dialog-titlebar-mini').click(function(){
        var that = $(this).parents('.ui-dialog');
        that.animate({'top': '120%','left': '0%'}, 65);
       $('.task-' + $(this).parents('.ui-dialog').find('.ui-dialog-content').data('window')).data('mini', true);
    });

    //  Часы
    function digitalWatch() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        $('.time').html(hours + ":" + minutes);
        setTimeout(digitalWatch, 1000);
    }
    digitalWatch();

    //  Калькулятор
    $('.calc-but').click(function() {
        var operators = ['+', '-', 'x', '÷'],
            decimalAdded = false,
            input = document.querySelector('.screen'),
            inputVal = input.innerHTML,
            btnVal = this.innerHTML,
            lastChar, equation;
        if(btnVal == 'C') {
            input.innerHTML = '';
            decimalAdded = false;
        } else if(btnVal == '=') {
            calcResult = false;
            equation = inputVal;
            lastChar = equation[equation.length - 1];
            equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
            if(operators.indexOf(lastChar) > -1 || lastChar == '.') {
                equation = equation.replace(/.$/, '');
            }
            if(equation) {
                input.innerHTML = eval(equation);
            }
            decimalAdded = false;
        } else if(operators.indexOf(btnVal) > -1) {
            lastChar = inputVal[inputVal.length - 1];
            calcResult = true;
            if(inputVal != '' && operators.indexOf(lastChar) == -1) {
                input.innerHTML += btnVal;
            } else if(inputVal == '' && btnVal == '-') {
                input.innerHTML += btnVal;
            }
            if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
                input.innerHTML = inputVal.replace(/.$/, btnVal);
            }
            decimalAdded = false;
        } else if(btnVal == '.') {
            if(!decimalAdded) {
                input.innerHTML += btnVal;
                decimalAdded = true;
            }
        } else if(btnVal == 'Back') {
            input.innerHTML = inputVal.slice(0, -1);
        } else {
            if(!calcResult) {
                calcResult = true;
                input.innerHTML = btnVal;
            } else {
                input.innerHTML += btnVal;
            }
        }
    });
})();