import {GenericUtil, StringUtil, ElementUtil} from '~/lib/utils';

import EventEmitter from 'events';
import dayjs from 'dayjs';

export default class extends EventEmitter {

    options = {
        version: '',
        template: {
            driving: "<p><strong>{time}</strong> Прибытие {when}</p>" +
                "<p>{distance}, без пробок {distanceNoTraffic}</p>" +
                "<a href='javascript:void(0)'>Подробнее</a>",

            pedestrian: "<p><strong>{time}</strong>, растояние {distance}</p>" +
                "<p>Прибытие {when}</p>" +
                "<a href='javascript:void(0)'>Подробнее</a>",

            masstransit: "<p><strong>{time}</strong>, растояние {distance}</p>" +
                "<p>Прибытие {when}</p>" +
                "<a href='javascript:void(0)'>Подробнее</a>"
        },
        position: '.ymaps-{version}-controls__toolbar .ymaps-{version}-route-panel__points',
        input: '.ymaps-{version}-route-panel-input__input',
        classes: {
            container: 'ya-map-route__directions',
            current: 'ya-map-route__directions-current'
        },

        texts: {
            tomorrow: 'завтра, {time}',
            fakeTo: 'Дикий лось'
        }
    }

    directions = [];

    constructor(options) {
        super();

        GenericUtil.setOptions(this, options);

    }

    init() {
        let position = document.querySelector(StringUtil.substitute(this.options.position, {
            version: this.options.version
        }));

        if (position !== null) {
            this.container = ElementUtil.createAndInject('DIV', {
                class: this.options.classes.container
            }, position, 'after');

            this.emit('init', this.container);
        }
    }

    build(route, params) {
        let direction = ElementUtil.create('LI', {
            class: params.current ? this.options.classes.current : '',
            events: {
                click: this.changeRoute.bind(this, route, params.index)
            },
            html: this.getTemplateByType(params.type, params),
            dataIndex: params.index,
        });

        this.directions.push(direction);
    }

    render() {
        if (this.container && this.directions.length > 0) {
            let list = ElementUtil.create('UL');

            for (let direction of this.directions) {
                ElementUtil.inject(list, direction);

                let more = direction.querySelector('a');
                more.addEventListener('click', () => this.emit('moreClick'));
            }

            ElementUtil.inject(this.container, list);
        }
    }

    clean() {
        if (this.container) {
            ElementUtil.empty(this.container);
        }

        this.directions = [];
    }

    getWhenDate(seconds) {
        let date = dayjs().add(parseInt(seconds, 10), 'second'),
            now = dayjs();

        if (date.format('YY/M/D') === now.format('YY/M/D')) {
            return date.format('HH:mm');
        }

        if (date.format('YY/M/D') === now.add(1, 'day').format('YY/M/D')) {
            return StringUtil.substitute(this.options.texts.tomorrow, {
                time: date.format('HH:mm')
            });
        }

        return date.format('DD-MM-YY HH:mm');
    }

    getTemplateByType(type, params) {
        let variables = {};

        switch (type) {
            case 'driving':
                variables = {
                    time: params.durationInTraffic.text,
                    when: this.getWhenDate(params.durationInTraffic.value),
                    distance: params.distance.text,
                    distanceNoTraffic: params.duration.text
                }
                break;
            default:
                variables = {
                    time: params.duration.text,
                    when: this.getWhenDate(params.duration.value),
                    distance: params.distance.text,
                }
        }

        return StringUtil.substitute(this.options.template[type], variables);
    }

    changeRoute(route, index) {
        for (let direction of this.directions) {
            ElementUtil.set(direction, {
                class: parseInt(ElementUtil.getDataAttribute(direction, 'index'), 10) === index ? this.options.classes.current : ('!' + this.options.classes.current),
            })
        }

        this.emit('change', route, index);
    }

    setFakeTo() {
        let inputs = document.querySelectorAll(StringUtil.substitute(this.options.input, {
            version: this.options.version
        }));

        if (inputs && inputs.length > 1) {
            ElementUtil.set(inputs[1], 'text', this.options.texts.fakeTo);
        }
    }
}