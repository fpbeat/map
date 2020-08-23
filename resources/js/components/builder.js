import {GenericUtil, ElementUtil, StringUtil} from '~/lib/utils';

import YaMap from './yamap/yamap';
import yaMapLoader from './yamap/yamap-loader';
import yaMapDirections from './yamap/yamap-directions';
import yaMapLink from './yamap/yamap-link';
import yaMapShare from './yamap/yamap-share';
import yaMapToggle from './yamap/yamap-toggle';

export default class extends YaMap {

    options = {
        map: {
            center: '55.8941, 37.8620',
            zoom: 10,
            type: 'yandex#map',
            controls: []
        },

        canvas: {
            position: 'relative',
            width: '100%',
            height: '750px'
        },

        markers: {
            start: {
                content: '',
                caption: 'Вы здесь',

                preset: 'islands#greenHomeCircleIcon',

                visible: true
            },

            destination: {
                content: 'Пейнтбол, лазертаг и отдых в заповеднике "Лосиный остров",<br /> г. Королев',
                caption: 'Дикий лось',

                preset: 'islands#orangeParkCircleIcon',

                visible: true
            }
        },

        panel: {
            allowSwitch: false,
            reverseGeocoding: true,
            autofocus: false,
            types: {
                auto: true,
                masstransit: true,
                pedestrian: true,
                bicycle: false,
                taxi: true
            }
        },

        classes: {
            loading: 'wp-poi-map__loading',
            template: 'wp-poi-map__popup'
        },

        loader: {},
        share: {},
        link: {},
        toggle: {},
        directions: {},
    };

    current = {
        coords: [],
        type: 'auto',
        index: 0,
    };

    markers = [];
    pageMarker = null;

    constructor(container, options = {}) {
        super();

        GenericUtil.setOptions(this, options);
        this.bootstrap(container);

    }

    bootstrap(container) {
        this.container = document.querySelector(container);

        this.loader = new yaMapLoader(Object.assign({}, this.options.loader, {
            onLoaded: this.start.bind(this)
        }));

        this.link = new yaMapLink(this.options.link);
        this.toggle = new yaMapToggle(this.options.toggle);

        this.share = new yaMapShare(Object.assign({}, this.options.share, {
            beforeOpen: () => {
                return this.link.getYandexLink(this.current)
            },
            onAppClick: app => {
                this.openAppLink(app);
            }
        }));

        this.directions = new yaMapDirections(Object.assign({}, this.options.directions, {
            version: this.loader.getVersion(),
            onMoreClick: this.openAppLink.bind(this, 'yandex'),
            onInit: (directionContainer) => {
                let shareContainer = this.share.init(directionContainer);

                this.toggle.init(directionContainer, shareContainer);
            }
        }));
    }

    openAppLink(app) {
        const name = 'get' + StringUtil.ucFirst(app) + 'Link';

        this.link.open(this.link[name].call(this.link, this.current));
    }

    intersectionWatcher() {
        if ('IntersectionObserver' in window) {
            let observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(this.container);

                        this.requestUserLocation();
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0
            });

            observer.observe(this.container);
        } else {
            this.requestUserLocation();
        }
    }

    start() {
        this.prepareCanvas();
        this.map = this.createMap();

        this.markers = [
            this.createMarker(this.options.markers.start),
            this.createMarker(this.options.markers.destination)
        ];

        let control = this.map.controls.get('routePanelControl');

        control.options.set({
            autofocus: false,
            maxWidth: 300,
        });

        control.routePanel.state.set({
            type: 'auto',
            toEnabled: false,
            // from: 'Одинцово',
            to: this.map.getCenter(),
        });


        this.intersectionWatcher();

        control.routePanel.getRouteAsync().then(route => {
            this.directions.init();

            this.directions.on('change', (current, index) => {
                route.setActiveRoute(current);

                this.current.index = index;
            });

            route.model.events.add('requestsuccess', () => {
                this.directions.setFakeTo();
                const isRouteEmpty = route.getActiveRoute() === null;

                this.directions.clean();

                this.setCurrentRouteParams(route);
                this.buildDirections(route);

                this.directions.render();
                this.share.toggle(isRouteEmpty);
                this.toggle.toggle(isRouteEmpty);

                route.getWayPoints().each(r => {
                    let index = parseInt(r.properties.get('index'), 10);

                    if (index === 0) {
                        this.markers[index].properties.set('balloonContent', r.properties.get('address'));
                    }
                });

                for (let [index, point] of Array.from(route.model.getAllPoints()).entries()) {
                    let coordinate = point.geometry.getCoordinates();

                    this.markers[index].options.set('visible', coordinate !== null);

                    if (coordinate !== null) {
                        this.markers[index].geometry.setCoordinates(coordinate);
                    }
                }
            });

            route.options.set({
                wayPointVisible: false,
            });

        }, function (error) {
            // none
        });

    }

    setCurrentRouteParams(route) {
        let current = route.getActiveRoute(),
            points = route.getWayPoints();

        if (current !== null) {
            this.current.coords = [];
            points.each(point => {
                this.current.coords.push(point.geometry.getCoordinates());
            });

            Object.assign(this.current, {
                type: current.properties.get('type'),
                index: parseInt(current.properties.get('index'), 10)
            });
        } else {
            Object.assign(this.current, {
                coords: [],
                type: 'auto',
                index: 0
            });
        }
    }

    buildDirections(route) {
        route.getRoutes().each(current => {
            let index = parseInt(current.properties.get('index'), 10);

            this.directions.build(current, Object.assign({}, current.properties.getAll(), {
                current: index === this.current.index
            }));

            current.events.add('click', () => this.directions.changeRoute(current, index));
        });
    }

    requestUserLocation() {
        let control = this.map.controls.get('routePanelControl');

        let location = ymaps.geolocation.get({
            provider: 'auto'
        });

        location.then(res => {
            let userTextLocation = res.geoObjects.get(0).properties.get('text');
            control.routePanel.state.set({
                from: userTextLocation,
            });
        });
    }

    prepareCanvas() {
        ElementUtil.set(this.container, 'styles', this.options.canvas);
    }
}