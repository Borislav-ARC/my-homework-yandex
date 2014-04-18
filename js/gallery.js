(function(){

    var countPhotos = 30,
        arrows = $('.arrow'),
        buttonImagePrev = $('#prev-image'),
        buttonImageNext = $('#next-image'),
        thumbsContent = $('#thumbs-content'),
        photoSection = $('#main-photos'),
        position = 0,
        itemWidth;

    $.getJSON('http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json&callback=?', function(data) {
        for(i = 0; i < countPhotos; i++) {
            thumbsContent.append('<a href="#' + data.entries[i].id +'" class="thumb_wrap" ><img src="'+ data.entries[i].img.XXS.href +'" width="'+ data.entries[i].img.XXS.width +'" height="'+ data.entries[i].img.XXS.height +'"> </a> ');
            photoSection.append('<span class="main-photo-wrap" ><img src="'+ data.entries[i].img.L.href +'" width="'+ data.entries[i].img.L.width +'" height="'+ data.entries[i].img.L.height +'"> </span> ');
        }
        photoSection.width(countPhotos * 100 + '%');
        $('.main-photo-wrap').width(100 / countPhotos + '%');
        itemWidth = $('.thumb_wrap').width();
        thumbsContent.width(itemWidth * countPhotos);

        if(location.hash) {
            var lastImg = $('a[href="' + location.hash + '"]');
            lastImg.addClass('active');
            position = - 100 * (lastImg.index());
            photoSection.animate({'left':  position + '%'}, 600);
            checkArrows();
            scrollThumbs(lastImg.index() + 1);
        } else {
            $(".thumb_wrap:first-child").addClass('active');
        }
    });

    //  Проверка и отображение стрелок управления
    function checkArrows(){
        var image_active = $('.thumb_wrap.active');
        if(!(image_active.prev().html())) {
            buttonImageNext.fadeIn();
            buttonImagePrev.hide();
        } else if(!(image_active.next().html())) {
            buttonImagePrev.fadeIn();
            buttonImageNext.hide();
        } else {
            arrows.fadeIn();
        }
    }

    //  Наведение курсора на документ
    $(document).hover(checkArrows, function(){
        arrows.fadeOut();
    });

    //  Наведение курсора на галарею слайдов
    $('#thumbs').hover(function(){
        thumbsContent.stop().animate({bottom:'0'}, 400);
    },function(){
        thumbsContent.stop().animate({bottom:'-102px'}, 400);
    });

    //  Нажатие на слайд в галерее
    $(document).on('click', '.thumb_wrap', function(){
        var img = $(this).index();
        $('.thumb_wrap.active').removeClass('active');
        $(this).addClass('active');
        position = - 100 * img;
        photoSection.animate({'left':  position + '%'}, 600);
        checkArrows();
        scrollThumbs(img + 1);
    });

    //  Кнопка следующий слайд
    buttonImageNext.click(function(){
        var image_active = $('.thumb_wrap.active'),
            image_next = image_active.next();
        image_active.removeClass('active');
        image_next.addClass('active');
        position = position - 100;
        photoSection.animate({left: position + '%'}, 600 );
        checkArrows();
        scrollThumbs(image_next.index() + 1);
    });

    //  Кнопка предыдущий слайд
    buttonImagePrev.click(function(){
        var image_active = $('.thumb_wrap.active'),
            image_prev = image_active.prev();
        image_active.removeClass('active');
        image_prev.addClass('active');
        position = position + 100;
        photoSection.animate({left: position + '%'}, 600 );
        checkArrows();
        scrollThumbs(image_prev.index() + 1)
    });

    //  Скролл мышкой на галерее
    thumbsContent.mousewheel(function(event, delta){
        scrollThumbs(0, delta);
    });

    //  Функция прокрутки
    function scrollThumbs(image, delta){
        var thisImage = image || 0,
            thumbsWrapWidth = $('#thumbs').width(),
            lastItemPosition = thumbsWrapWidth - thumbsContent.width(),
            itemsWrapPosition;

        if(thisImage){
            itemsWrapPosition = -(itemWidth * (thisImage - 0.5) - thumbsWrapWidth / 2);
        } else {
            itemsWrapPosition = parseInt(thumbsContent.css('left')) + (delta > 0 ? itemWidth * 3 : -itemWidth * 3);
        }

        if(itemsWrapPosition <= 0 && itemsWrapPosition > lastItemPosition ){
            $('#thumbs-content').css('left', itemsWrapPosition);
        } else if(itemsWrapPosition > 0){
            $('#thumbs-content').css('left', 0);
        } else {
            $('#thumbs-content').css('left', lastItemPosition);
        }
    }

    //  Изменение размера главного окна
    $(window).resize(function(){
        var thisMainPhoto = $($('.main-photo-wrap')[parseFloat($('.thumb_wrap.active').index())]).find('img'),
            winHeight = $(window).height(),
            winWidth = $(window).width();
        if(winHeight < thisMainPhoto.attr('height')) {
            thisMainPhoto.css({'max-height' : winHeight, 'max-width': 'auto'});
        }
        if(winHeight > thisMainPhoto.attr('height')) {
            thisMainPhoto.css({'max-height' : ''});
        }
        if(winWidth < thisMainPhoto.attr('width')) {
            thisMainPhoto.css({'width' : winWidth, 'height': 'auto'});
        }
        if(winWidth > thisMainPhoto.attr('width')) {
            thisMainPhoto.css({'width' : '', 'height': ''});
        }
    });
})();