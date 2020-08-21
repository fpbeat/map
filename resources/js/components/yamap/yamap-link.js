import {GenericUtil, ObjectUtil, StringUtil} from '~/lib/utils';

import EventEmitter from 'events';

export default class extends EventEmitter {

    options = {
        yandexLink: 'yandexmaps://maps.yandex.ru/?{params}',
        naviLink: 'yandexnavi://build_route_on_map?{params}',
        gisLink: 'dgis://2gis.ru/routeSearch/rsType/{type}/from/{from}/to/{to}',
        googleLink: 'https://www.google.com/maps/dir/?api=1&{params}',
        appleLink: 'https://maps.apple.com?{params}'
    };

    types = {
        yandex: {
            'driving': 'auto',
            'masstransit': 'mt',
            'pedestrian': 'pd'
        },
        gis: {
            'driving': 'car',
            'masstransit': 'ctx',
            'pedestrian': 'pedestrian'
        },
        google: {
            'driving': 'driving',
            'masstransit': 'transit',
            'pedestrian': 'walking'
        },
        apple: {
            'driving': 'd',
            'masstransit': 'r',
            'pedestrian': 'w'
        }
    };

    constructor(options = {}) {
        super();

        GenericUtil.setOptions(this, options);
    }

    getYandexLink(params) {
        let coords = this.getCoords('yandex', params);

        let queryParams = {
            rtext: coords.from + '~' + coords.to,
            rtt: this.getTransport('yandex', params),
            rtn: this.getIndex(params)
        };

        return StringUtil.substitute(this.options.yandexLink, {
            params: ObjectUtil.toQueryString(queryParams)
        });
    }

    getGoogleLink(params) {
        const coords = this.getCoords('google', params);

        let queryParams = {
            origin: coords.from,
            destination: coords.to,
            travelmode: this.getTransport('google', params)
        };

        return StringUtil.substitute(this.options.googleLink, {
            params: ObjectUtil.toQueryString(queryParams)
        });
    }

    getGisLink(params) {
        return StringUtil.substitute(this.options.gisLink, Object.assign({}, this.getCoords('gis', params), {
            type: this.getTransport('gis', params)
        }));
    }

    getAppleLink(params) {
        const coords = this.getCoords('apple', params);

        let queryParams = {
            saddr: coords.from,
            daddr: coords.to,
            dirflg: this.getTransport('apple', params),
        };

        return StringUtil.substitute(this.options.appleLink, {
            params: ObjectUtil.toQueryString(queryParams)
        });
    }

    getNaviLink(params) {
        const coords = ObjectUtil.map(this.getCoords('navi', params), item => item.split(','));

        let queryParams = {
            lat_from: coords.from[0],
            lon_from: coords.from[1],
            lat_to: coords.to[0],
            lon_to: coords.to[1]
        };

        return StringUtil.substitute(this.options.naviLink, {
            params: ObjectUtil.toQueryString(queryParams)
        });
    }

    getCoords(app, params) {
        let cords = [];
        for (let coord of params.coords) {
            cords.push(this.getOrderedCoords(app, coord).join(','));
        }

        return {from: cords[0], to: cords[1]};
    }

    getTransport(app, params) {
        const first = Object.values(this.types[app]);

        return this.types[app][params.type || first[0]];
    }

    getIndex(params) {
        return params.index || 0;
    }

    getOrderedCoords(app, coords) {
        switch (app) {
            case 'gis':
                return coords.reverse();
            default:
                return coords;
        }
    }

    open(url) {
        let win = window.open(url, '_blank');
        win.focus();
    }
}