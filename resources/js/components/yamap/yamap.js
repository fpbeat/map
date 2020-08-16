import {GeoUtil} from '~/lib/utils';

import EventEmitter from 'events';

export default class extends EventEmitter {

    getCenter() {
        return GeoUtil.parseCoords(this.options.map.center);
    }

    getZoom() {
        return parseInt(this.options.map.zoom, 10);
    }

    getType() {
        return String(this.options.map.type);
    }

    getControls() {
        return this.options.map.controls;
    }

    createMap() {
        let map = new ymaps.Map(this.container, {
            center: this.getCenter(),
            zoom: this.getZoom(),

            type: this.getType(),
            controls: this.getControls(),
        });

        this.attachMapControls(map);

        return map;
    }

    attachMapControls(map) {
        map.controls
            .add('routePanelControl')
            .add('zoomControl', {
                size: 'small',
                position: {
                    right: 10,
                    bottom: 40
                }
            })
            .add('typeSelector', {
                panoramasItemMode: 'off',
            })

        map.controls.get('routePanelControl').routePanel.options.set(this.options.panel);
    }

    createMarker(param) {
        const marker = new ymaps.Placemark(this.map.getCenter(), {
            balloonContent: param.content,
            iconCaption: param.caption,
        }, {
            hideIconOnBalloonOpen: false,
            iconOffset: [0, 20],
            preset: param.preset,
            visible: false
        });

        this.map.geoObjects.add(marker);

        return marker;
    }
}
