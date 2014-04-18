(function(){
    var calcResult = true,
        container = $('.container'),
        icons = $('.desktop .icons'),
        numberNote = 0,
        noteNames = [],
        drag, dialogWindow;

    //  Старт Windows
    $('.desktop > .icons').hide();
    setTimeout(function(){
        container.removeClass('start-windows');
    }, 2000);
    setTimeout(function(){
        $('.start-menu').show();
        $('.play-start-windows')[0].play();
    }, 3000);
    setTimeout(function(){
        for(var i=0; i<icons.length; i+=2) {
            (function(i) {
                setTimeout(function(){
                    $(icons[i]).show();
                    $(icons[i+1]).show();
                }, i*70);
            })(i);
        }
    }, 4000);

    //  Перетаскивание значков
    function makeDraggable() {
    $('.icons').draggable({
        containment: 'parent',
        drag: function(){
            drag = $(this);
        }
    });
    }
    makeDraggable();

    //  Удаление в корзину
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
    function creatNotepad(title) {
        var titleNote;
        if(!title && !numberNote) {
            titleNote = 'Блокнот';
        } else if(title) {
            titleNote = title;
        } else {
            titleNote = 'Новый текстовый документ (' + numberNote + ')';
        }
        $('.win-notepad-' +  numberNote ).dialog({
            autoOpen: false,
            height: 400,
            width: 600,
            minWidth: 250,
            position: 'center',
            closeOnEscape: false,
            resizable: true,
            draggable: true,
            title: titleNote,
            dialogClass: 'notepad-' + numberNote,
            close: function() {
                $('.task-' + $(this).parents('.ui-dialog').find('.ui-dialog-content').data('window')).remove();
                $(this).parents('.ui-dialog').find('.ui-dialog-titlebar-resize').data('resize', 'false');
            }
        });
        noteNames.push(titleNote);
        var thatWinNote = document.querySelector('.win-notepad-' + numberNote),
            thatNote = document.querySelector('.notepad-' + numberNote),
            textArea = thatWinNote.querySelector('textarea'),
            buttonsClose, noteSaveAs, noteSaveAsName, buttonsSaveAs, buttonsQuitMes,
            buttonsSettings, settingsWin, fontFamily;

        textArea.addEventListener('keydown', function(e){
            var event = e || window.event,
                target = event.target || event.srcElement;
            target.dataset.changes = true;
        });
        $('div[class*="notepad"] .ui-dialog-titlebar-close').unbind('click');
        buttonsClose = [thatNote.querySelector('.ui-dialog-titlebar-close'), thatNote.querySelector('.note-quit')];
        for(var b=0;b<buttonsClose.length;b++) {
            buttonsClose[b].addEventListener('click', function(){
                showQuitDialog(thatWinNote, titleNote);
            })
        }

        //  Кнопки - Закрытие блокнота
        buttonsQuitMes = thatNote.querySelectorAll('.note-close');
        for(i=0;i<buttonsQuitMes.length;i++){
            buttonsQuitMes[i].addEventListener('click', function(e){
                var event = e || window.event,
                    target = event.target || event.srcElement;
                clickButtonsNote(target);
            });
        }
        //  Нажатия на кнопки в окне закрытия блокнота
        function clickButtonsNote(target){
                var messageWindow = thatWinNote.querySelector('.quit-message-wrap'),
                    thisNote = thatWinNote.dataset.window;
                if(target.value === 'yes') {
                    localStorage.setItem(thisNote, textArea.value);
                    $('.win-' + thisNote).dialog('close');
                    messageWindow.style.display = 'none';
                    textArea.dataset.changes = false;
                } else if(target.value === 'no') {
                    textArea.value = localStorage.getItem(thisNote);
                    $('.win-' + thisNote).dialog('close');
                    messageWindow.style.display = 'none';
                    textArea.dataset.changes = false;
                } else {
                    messageWindow.style.display = 'none';
                }
            }

        //  Окно - Сохранить как
        noteSaveAs = thatWinNote.querySelector('.note-save-as-wrap');
        noteSaveAsName = thatWinNote.querySelector('.note-name-save-as');
        thatWinNote.querySelector('.note-save-as').addEventListener('click', function() {
            var content = thatWinNote.querySelector('.note-save-as-content');
            content.innerHTML = '';
            for(var a=0;a<noteNames.length;a++) {
                content.innerHTML += '<div class="note-save-as-others">' + noteNames[a] + '</div>'
            }
            noteSaveAs.style.display = 'block';
            noteSaveAsName.value = '';
            noteSaveAsName.focus()
        });
        //   Кнопки - Сохранить как
        buttonsSaveAs = thatWinNote.querySelectorAll('.note-save-as-close');
        for(var i=0;i<buttonsSaveAs.length;i++){
            buttonsSaveAs[i].addEventListener('click', function(e){
                var textArea = thatWinNote.querySelector('textarea'),
                    event = e || window.event,
                    target = event.target || event.srcElement;
                saveAs(target)
            })
        }
        //  Нажатия на кнопки - Сохранить как
        function saveAs(target) {
            var replace = thatWinNote.querySelector('.note-save-as-replace');
            if(target.value === 'yes') {
                if(noteSaveAsName.value && noteNames.indexOf(noteSaveAsName.value) === -1 ) {
                    noteSaveAs.style.display = 'none';
                    creatNewNotepad(noteSaveAsName.value, textArea.value);
                    localStorage.setItem(thatWinNote.dataset.window, textArea.value);
                } else if( noteNames.indexOf(noteSaveAsName.value) > -1 ) {
                    replace.style.display = 'block';
                } else {
                    noteSaveAsName.focus();
                }
            } else if(target.value === 'no') {
                noteSaveAs.style.display = 'none';
            } else if(target.value === 'replace') {
                replace.style.display = 'none';
                noteSaveAs.style.display = 'none';
                document.querySelector('.win-notepad-' + noteNames.indexOf(noteSaveAsName.value)).querySelector('textarea').value =  textArea.value;
                textArea.dataset.changes = false;
                $(thatWinNote).dialog('close');
                textArea.value = localStorage.getItem(thatWinNote.dataset.window);
                $('.win-notepad-' + noteNames.indexOf(noteSaveAsName.value)).dialog('open')
            } else if(target.value === 'no-replace') {
                replace.style.display = 'none';
            } else {
                noteSaveAs.style.display = 'none';
            }
        }

        //  Кнопки - Настройки
        thatWinNote.querySelector('.select-font-size').addEventListener('change', function(e){
            var event = e || window.event,
                target = event.target || event.srcElement;
            thatWinNote.querySelector('.input-font-size').value = target.value;
        });
        buttonsSettings = thatWinNote.querySelectorAll('.settings-close');
        settingsWin = thatWinNote.querySelector('.setting-wrap');
        for(var q=0;q<buttonsSettings.length;q++){
            buttonsSettings[q].addEventListener('click', function(e){
                var event = e || window.event,
                    target = event.target || event.srcElement;
                setNoteParams(target)
            })
        }
        //  Нажатия на кнопки - Настройки
        function setNoteParams(target) {
            var valuesStyle = thatWinNote.querySelector('.select-font-style').value.split(',');
            if(target.value === 'yes') {
                var textAreas = document.querySelectorAll('.notepad-text');
                switch (thatWinNote.querySelector('.select-font-family').value) {
                    case 'Arial':
                        fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
                        break;
                    case 'Calibri':
                        fontFamily = 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif';
                        break;
                    case 'Futura':
                        fontFamily = 'Futura, "Trebuchet MS", Arial, sans-serif';
                        break;
                    case 'Geneva':
                        fontFamily = 'Geneva, Tahoma, Verdana, sans-serif';
                        break;
                    case 'Optima':
                        fontFamily = 'Optima, Segoe, "Segoe UI", Candara, Calibri, Arial, sans-serif';
                        break;
                    case 'Tahoma':
                        fontFamily = 'Tahoma, Verdana, Segoe, sans-serif';
                        break;
                    case 'Times New Roman':
                        fontFamily = 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif';
                        break;
                    case 'Trebushet':
                        fontFamily = '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif';
                        break;
                    case 'Verdana':
                        fontFamily = 'Verdana, Geneva, sans-serif';
                        break;
                }
                for(var z=0;z<textAreas.length;z++) {
                    textAreas[z].style.cssText = 'font-size:' + thatWinNote.querySelector('.input-font-size').value + 'px;' +
                        'font-weight:' + valuesStyle[0] + ';' +
                        'font-style:' + valuesStyle[1] + ';' +
                        'font-family:' + fontFamily + ';'
                }
                settingsWin.style.display = 'none';
            } else {
                settingsWin.style.display = 'none';
            }
        }

        //  Остальные обработчики
        thatWinNote.querySelector('.creat-new-notepad').addEventListener('click', function() {
            creatNewNotepad(null, false);
        });
        thatWinNote.querySelector('.note-save').addEventListener('click', function() {
            localStorage.setItem(thatWinNote.dataset.window, textArea.value);
            textArea.dataset.changes = false;
        });
        thatWinNote.querySelector('.note-setting').addEventListener('click', function() {
            thatWinNote.querySelector('.setting-wrap').style.display = 'block';
        });

        //  Создание новых блокнотов
        function creatNewNotepad(title, content) {
            numberNote++;
            var titleNote = title || 'Новый текстовый документ (' + numberNote + ')',
                clone = document.querySelector('.win-notepad-0').cloneNode(true),
                newNote;
            clone.classList.remove('win-notepad-0');
            clone.classList.add('win-notepad-' + numberNote);
            clone.dataset.window = 'notepad-' + numberNote;
            if(content) {
                clone.querySelector('textarea').value = content;
            } else {
                clone.querySelector('textarea').value = ''
            }
            document.querySelector('.created-windows').appendChild(clone);
            newNote = document.querySelector('.win-notepad-' + numberNote);
            localStorage.setItem(newNote.dataset.window, newNote.querySelector('textarea').value);
            newNote.querySelector('textarea').dataset.changes = false;
            document.querySelector('.new-elements').innerHTML += '<div class="icons notepad new-'+ numberNote +'"><span class="icon desk" data-window="notepad-'+ numberNote +'"></span><span class="icon-text">' + titleNote + '</span></div>';
            creatNotepad(titleNote);
            makeDraggable();
            startProgs($('.win-notepad-' + numberNote), titleNote)
        }
    }
    creatNotepad();

    //  Окно - Закрытие блокнота
    function showQuitDialog(thatWinNote, titleNote){
        thatWinNote.querySelector('.title-note').innerHTML = titleNote;
        if(thatWinNote.querySelector('textarea').dataset.changes === 'true'){
            thatWinNote.querySelector('.quit-message-wrap').style.display = 'block';
        } else {
            $(thatWinNote).dialog('close');
        }
    }

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
    $(document).on('dblclick', '.icon.desk', function() {
        startProgs($(this));
    });
    function startProgs(obj, title){
        var that = obj.data('window'),
            name = title || obj.next().html();
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
    }

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
        var windows = [$('.win-my-comp'), $('.win-recycle'), $('.win-calculator'), $('.win-mineweeper'), $('.win-winamp')],
            noteChanges = [];
        if($(this).val() === 'yes') {
            $('.win-shutdown').dialog('close');
            function closeNotes(){
                for(var i=0;i<noteNames.length;i++) {
                    showQuitDialog(document.querySelector('.win-notepad-'+i), noteNames[i]);
                    if(document.querySelectorAll('.notepad-text')[i].dataset.changes === 'true') {
                        noteChanges[i] = true;
                    } else {
                        noteChanges[i] = false;
                    }
                }
            }
            closeNotes();

            var confirmClose = setInterval(function(){
                if(noteChanges.indexOf(true) > -1) {
                    closeNotes();
                } else {
                    shutdown();
                    clearInterval(confirmClose)
                }
            }, 1000);

            function shutdown(){
                for(var i=0; i<windows.length; i++) {
                    (function(i) {
                        setTimeout(function(){
                            windows[i].dialog('close');
                        }, i*500);
                    })(i);
                }
                for(var b=0; b<icons.length; b+=2) {
                    (function(b) {
                        setTimeout(function(){
                            $(icons[b]).html('');
                            $(icons[b+1]).html('');
                        }, b*70);
                    })(b);
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
        } else if($(this).val() === 'no'){
            $('.win-shutdown').dialog('close');
        } else {
            return;
        }
    });

    //  Активация таска при нажатии на окно
    dialogWindow = $('.ui-dialog');
    $(document).on('mousedown', '.ui-dialog', function(){
        $('.task.active').removeClass('active');
        $('.task-' + $(this).find('.ui-dialog-content').data('window')).addClass('active');
    });
    $(document).on('resize', dialogWindow, function() {
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
    $(document).on('click', '.ui-dialog-titlebar-mini', function(){
        var that = $(this).parents('.ui-dialog');
        that.animate({'top': '120%','left': '0'}, 65);
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