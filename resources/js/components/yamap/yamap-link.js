import {GenericUtil, ObjectUtil, StringUtil} from '~/lib/utils';

import EventEmitter from 'events';

export default class extends EventEmitter {

    options = {
        yandexLink: 'https://yandex.ru/maps/?{params}'
    };

    types = {
        'driving': 'auto',
        'masstransit': 'mt',
        'pedestrian': 'pd'
    };

    constructor(options = {}) {
        super();

        GenericUtil.setOptions(this, options);
        this.bootstrap();
    }

    bootstrap() {

    }

    get(params) {
        let queryParams = {
            rtext: this.getCoords(params),
            rtt: this.getTransport(params),
            rtn: this.getIndex(params)
        };

        return StringUtil.substitute(this.options.yandexLink, {
            params: ObjectUtil.toQueryString(queryParams)
        });
    }

    getCoords(params) {
        let cords = [];
        for (let coord of params.coords) {
            cords.push(coord.join(','));
        }

        return cords.join('~');
    }

    getTransport(params) {
        return this.types[params.type || 'auto'];
    }

    getIndex(params) {
        return params.index || 0;
    }

    open(url) {
        let win = window.open(url, '_blank');
        win.focus();
    }
}