define([
    'jquery',
    'env',
    'reader',
    'settings',
    'vents',
    'plugins/hammer'
], function ($, Env, Reader, Settings, Vents, Hammer) {
    'use strict';

    var MobileEvs = function () {

        var _this = this,
            env = Env,
            reader = Reader,
            settings = Settings,
            vents = new Vents();

        if (!env.isMobile()) {
            return;
        }

        settings.el.css('overflow-y', 'scroll');

        var el = document.getElementsByTagName('body')[0],
            frame = document.getElementById('main'),
            controls = document.getElementsByClassName('controls')[0],
            wasScrolling = reader.isScrolling,
            doubleTapped = false,
            wasHolding = false,
            touchTimer,
            dist,
            dir,
            options = {
                behavior: {
                    doubleTapInterval: 200,
                    contentZooming: 'none',
                    touchAction: 'none',
                    touchCallout: 'none',
                    userDrag: 'none'
                },
                dragLockToAxis: true,
                dragBlockHorizontal: true
            },
            hammer = new Hammer(el, options);

        hammer.on('touch release pinchin pinchout dragend doubletap', function (e) {

            var target = $(e.target);

            doubleTapped = false;
            clearTimeout(touchTimer);

            if (!target.is('.control-btn') && !target.is('.chapter-nav') && !target.is(frame) && !target.parents().is(frame)) {

                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation();
                e.gesture.stopDetect();

            } else if (target.is(frame) || target.parents().is(frame)) {

                if (e.type == 'doubletap') {

                    doubleTapped = true;

                    e.stopPropagation();
                    e.gesture.stopPropagation();

                    wasScrolling = reader.isScrolling;

                    if (wasScrolling) {
                        vents.stopScrolling();
                    } else {
                        vents.startScrolling();
                    }

                } else if (e.type == 'touch' && e.gesture.touches.length < 2) {

                    touchTimer = setTimeout(function () {
                        e.stopPropagation();
                        e.gesture.stopPropagation();

                        wasScrolling = reader.isScrolling;
                        wasHolding = true;

                        if (wasScrolling && !doubleTapped) {
                            vents.stopScrolling();
                        }
                    }, 150);

                } else if (e.type == 'release') {

                    if (wasHolding) {
                        e.gesture.stopPropagation();
                        vents.countPages();

                        if (wasScrolling && wasHolding) {
                            setTimeout(function () {
                                wasHolding = false;
                                vents.startScrolling();
                            }, 200);

                        }
                    }

                } else if (e.type == 'pinchin') {

                    e.stopPropagation();
                    e.gesture.stopPropagation();

                    vents.fontDecrement();
                    if (wasScrolling) {
                        vents.startScrolling();
                    }

                    e.gesture.stopDetect();

                } else if (e.type == 'pinchout') {

                    e.stopPropagation();
                    e.gesture.stopPropagation();

                    vents.fontIncrement();
                    if (wasScrolling) {
                        vents.startScrolling();
                    }

                    e.gesture.stopDetect();

                } else if (e.type == 'dragend' && e.gesture.touches.length < 2) {

                    e.preventDefault();
                    e.stopPropagation();
                    e.gesture.preventDefault();
                    e.gesture.stopPropagation();

                    if (e.gesture.distance >= 70 && e.gesture.direction == 'right') {

                        e.gesture.stopDetect();
                        vents.speedIncrement();

                    } else if (e.gesture.distance >= 70 && e.gesture.direction == 'left') {

                        e.gesture.stopDetect();
                        vents.speedDecrement();

                    }

                }

            } else if (target.parents().is(controls)) {
                e.stopPropagation();
                e.gesture.stopPropagation();
            }

        });

    };

    return MobileEvs;

});
