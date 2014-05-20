define(function() {
    'use strict';

    var Env = {

        isMobile: function() {
            return (/iPhone|iPod|acs|alav|alca|amoi|audi|aste|avan|benq|bird|blac|blaz|brew|cell|cldc|cmd-|dang|doco|eric|hipt|inno|ipaq|java|jigs|kddi|keji|leno|lg-c|lg-d|lg-g|lge-|maui|maxo|midp|mits|mmef|mobi|mot-|moto|mwbp|nec-|newt|noki|opwv|palm|pana|pant|pdxg|phil|play|pluc|port|prox|qtek|qwap|sage|sams|sany|sch-|sec-|send|seri|sgh-|shar|sie-|siem|smal|smar|sony|sph-|symb|t-mo|teli|tim-|tosh|tsm-|upg1|upsi|vk-v|voda|w3cs|wap-|wapa|wapi|wapp|wapr|webc|winw|winw|xda|xda-|up.browser|up.link|windowssce|iemobile|mini|mmp|symbian|midp|wap|phone|pocket|mobile|pda|psp/i.test(navigator.userAgent) && !(/macintosh/i.test(navigator.userAgent)));
        },
        orientation: function() {

            switch (window.orientation) {
                case 0:
                case 180:
                    console.log('Orientation is currently portrait');
                    return 'portrait';
                case 90:
                case -90:
                    console.log('Orientation is currently landscape');
                    return 'landscape';
                default:
                    return null;
            }
        }

    };

    return Env;

});
