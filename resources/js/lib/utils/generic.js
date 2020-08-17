import ObjectUtil from "./object";
import StringUtil from "./string";

export default {
    getType(obj) {
        if (typeof obj === 'undefined' && obj === void 0) {
            return void 0;
        }

        if (obj === null) {
            return null;
        }

        if (!!(obj && obj.nodeType === 1)) {
            return 'element';
        }

        return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
    },

    isEmpty(obj) {
        return this.getType(obj) === null || this.getType(obj) === void 0;
    },

    isIterable(obj) {
        if (this.isEmpty(obj)) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    },

    setOptions: function (instance, options) {
        if (!this.isEmpty(options)) {
            for (let option of Object.keys(options)) {
                if (/^on/.test(option) && this.getType(instance.on) === 'function') {
                    instance.on(StringUtil.lcFirst(option.substr(2)), options[option].bind(instance));
                }
            }

            ObjectUtil.merge(true, instance.options || {}, options);
        }
    },

    isMobile: function (options = {}) {
        const mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
        const tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i

        const ua = navigator.userAgent

        if (typeof ua !== 'string') {
            return false;
        }

        let result = options.tablet ? tabletRE.test(ua) : mobileRE.test(ua)

        if (!result && options.tablet && options.featureDetect && navigator && navigator.maxTouchPoints > 1 && ua.indexOf('Macintosh') !== -1 && ua.indexOf('Safari') !== -1) {
            result = true;
        }

        return result;
    }
};