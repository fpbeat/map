import {ElementUtil, GenericUtil, StringUtil} from '~/lib/utils';

import EventEmitter from 'events';

export default class extends EventEmitter {

    options = {
        version: '2.1.77',
        apiKey: 'c0bf728c-baeb-4404-884a-55e2c1790c53',
        language: 'ru_RU',
        endPoint: '//api-maps.yandex.ru/{version}/?apikey={key}&lang={lang}&onload={callback}',
    }

    constructor(options = {}) {
        super();

        GenericUtil.setOptions(this, options);
        this.bootstrap();
    }

    bootstrap() {
        this.load()
    }

    formatEndpoint() {
        return StringUtil.substitute(this.options.endPoint, {
            version: this.options.version,
            key: this.options.apiKey,
            lang: this.options.language,
            callback: this.createCallback()
        })
    }

    load() {
        const injector = document.head || document.body || document.lastChild;

        ElementUtil.createAndInject('script', {
            type: 'text/javascript',
            src: this.formatEndpoint()
        }, injector);
    }

    createCallback() {
        const funcName = 'yamap_' + StringUtil.uuid();
        window[funcName] = this.emit.bind(this, 'loaded');

        return funcName;
    }

    getVersion() {
        return this.options.version.replace(/[^\d]/g, '-');
    }
}