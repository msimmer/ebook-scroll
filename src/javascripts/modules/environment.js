define(function () {

  return {
    devices: [
      'android',
      'iphone',
      'ipod',
      'acs',
      'alav',
      'alca',
      'amoi',
      'audi',
      'aste',
      'avan',
      'benq',
      'bird',
      'blac',
      'blaz',
      'brew',
      'cell',
      'cldc',
      'cmd-',
      'dang',
      'doco',
      'eric',
      'hipt',
      'inno',
      'ipaq',
      'java',
      'jigs',
      'kddi',
      'keji',
      'leno',
      'lg-c',
      'lg-d',
      'lg-g',
      'lge-',
      'maui',
      'maxo',
      'midp',
      'mits',
      'mmef',
      'mobi',
      'mot-',
      'moto',
      'mwbp',
      'nec-',
      'newt',
      'noki',
      'opwv',
      'palm',
      'pana',
      'pant',
      'pdxg',
      'phil',
      'play',
      'pluc',
      'port',
      'prox',
      'qtek',
      'qwap',
      'sage',
      'sams',
      'sany',
      'sch-',
      'sec-',
      'send',
      'seri',
      'sgh-',
      'shar',
      'sie-',
      'siem',
      'smal',
      'smar',
      'sony',
      'sph-',
      'symb',
      't-mo',
      'teli',
      'tim-',
      'tosh',
      'tsm-',
      'upg1',
      'upsi',
      'vk-v',
      'voda',
      'w3cs',
      'wap-',
      'wapa',
      'wapi',
      'wapp',
      'wapr',
      'webc',
      'winw',
      'winw',
      'xda',
      'xda-',
      'up.browser',
      'up.link',
      'windowssce',
      'iemobile',
      'mini',
      'mmp',
      'symbian',
      'midp',
      'wap',
      'phone',
      'pocket',
      'mobile',
      'pda',
      'psp'
    ],
    isMobile: function () {
      var regex = new RegExp(this.devices.join('|'), 'i');
      return (regex.test(navigator.userAgent.toLowerCase()) && !(/macintosh/i.test(navigator.userAgent.toLowerCase())));
    },
    prefix: function () {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    },
    orientation: function () {
      switch (window.orientation) {
      case 0:
      case 180:
        return 'portrait';
      case 90:
      case -90:
        return 'landscape';
      default:
        return null;
      }
    }
  };

});
