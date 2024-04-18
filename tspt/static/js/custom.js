(function ($) {
    "use strict";

    $(document).ready(function () {
        /*---------------------------------------------------
            service carousel
        ----------------------------------------------------*/
        $('.mainmenu').meanmenu({
            meanScreenWidth: '991'
        });

        var carousel = $(".service-carousel");
        carousel.owlCarousel({
            loop: true,
            navText: ['<i class="icofont-simple-left"></i>', '<i class="icofont-simple-right"></i>'],
            nav: true,
            autoplay: true,
            autoplayTimeout: 5000,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 450,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1200: {
                    items: 3
                },
                1920: {
                    items: 3
                }
            }
        });

        checkClasses();
        carousel.on('translated.owl.carousel', function (event) {
            checkClasses();
        });

        function checkClasses() {
            var total = $('.service-carousel .owl-stage .owl-item.active').length;

            $('.service-carousel .owl-stage .owl-item').removeClass('lastActive');

            $('.service-carousel .owl-stage .owl-item.active').each(function (index) {

                if (index === total - 1 && total > 1) {
                    // this is the last one
                    $(this).addClass('lastActive');
                }
            });
        }

        /*---------------------------------------------------
            testimonial carousel
        ----------------------------------------------------*/
        $('.testi-carousel').owlCarousel({
            loop: true,
            navText: ['<i class="icofont-simple-left"></i>', '<i class="icofont-simple-right"></i>'],
            nav: true,
            autoplay: true,
            autoplayTimeout: 5000,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 450,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1200: {
                    items: 4
                },
                1920: {
                    items: 4
                }
            }
        });
        $('.testi-carousel-two').owlCarousel({
            loop: true,
            autoplay: true,
            autoplayTimeout: 5000,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            smartSpeed: 450,
            margin: 20,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                991: {
                    items: 3
                },
                1200: {
                    items: 3
                },
                1920: {
                    items: 3
                }
            }
        });

        /*---------------------------------------------------
            counter
        ----------------------------------------------------*/
        $('.counter-single h2').counterUp({
            delay: 10, // the delay time in ms
            time: 1000 // the speed time in ms
        });

    });

    /*---------------------------------------------------
        accordian
    ----------------------------------------------------*/
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).prev().addClass('active');
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).prev().removeClass('active');
    });

    /*---------------------------------------------------
        preloader
    ----------------------------------------------------*/
    $(window).on('load', function () {
        $('.preloader').fadeOut(500);
    });


}(jQuery));
