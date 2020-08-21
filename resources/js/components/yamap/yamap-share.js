import {GenericUtil, StringUtil, ElementUtil, ObjectUtil} from '~/lib/utils';

import EventEmitter from 'events';

import Swal from 'sweetalert2'

export default class extends EventEmitter {

    options = {
        telegram: 'tg://resolve?domain=fpbeat',
        whatsapp: 'whatsapp://send?abid=+380930250200&text=getlocation',

        classes: {
            container: 'ya-map-route__share-button',
            hidden: 'ya-map-route__hidden'
        },

        texts: {
            buttonDesktop: 'Отправить на телефон',

            popup: {
                social: 'Получите ссылку на маршрут в мессенджер',
                qrcode: 'Сканируйте QR-код с маршрутом',
                or: 'или'
            },

            apps: {
                title: 'Открыть в приложении',

                navi: 'Яндекс Навигатор',
                yandex: 'Яндекс Карты',
                google: 'Google Maps',
                gis: '2GIS',
                apple: 'Apple Maps'
            }
        },
        // @formatter:off
        popupTemplate: '' +
            '<div class="ya-map-route__share-popup">' +
                '<h4>{social}</h4>' +
                '<div class="ya-map-route__share-social">' +
                    '<a href="{whatsapp}" target="_blank" rel="whatsapp"><label>Whatsapp</label></a>' +
                    '<a href="{telegram}" target="_blank" rel="telegram"><label>Telegram</label></a>' +
                '</div>' +
                '<div class="ya-map-route__share-popup-qr">' +
                    '<span>{or}</span>'  +
                    '<h4>{qrcode}</h4>' +
                    '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={qr}">' +
                 '</div>' +
            '</div>',

        appsTemplate: '' +
            '<div class="ya-map-route__share-apps">' +
                '<strong>{title}</strong>' +
                '<ul>' +
                    '<li rel="navi">' +
                        '<a href="javascript:void(0)"></a>' +
                        '<label>{navi}</label>' +
                    '</li>' +
                    '<li rel="yandex">' +
                        '<a href="javascript:void(0)"></a>' +
                        '<label>{yandex}</label>' +
                    '</li>' +
                    '<li rel="google">' +
                        '<a href="javascript:void(0)"></a>' +
                        '<label>{google}</label>' +
                    '</li>' +
                    '<li rel="apple">' +
                        '<a href="javascript:void(0)"></a>' +
                        '<label>{apple}</label>' +
                    '</li>' +
                '</ul>' +
            '</div>'
        // @formatter:on
    };

    constructor(options = {}) {
        super();

        this.isMobile = GenericUtil.isMobile({
            tablet: true,
            featureDetect: true
        });

        GenericUtil.setOptions(this, options);
    }

    init(position) {
        this.container = ElementUtil.createAndInject('DIV', {
            class: this.options.classes.container + ' ' + this.options.classes.hidden,
        }, position, 'after');

        this.isMobile ? this.addApps() : this.addButton();

        return this.container;
    }

    addButton() {
        ElementUtil.createAndInject('BUTTON', {
            html: this.options.texts.buttonDesktop,
            events: {
                click: this.processDesktop.bind(this)
            }
        }, this.container);
    }

    addApps() {
        ElementUtil.inject(this.container, StringUtil.substitute(this.options.appsTemplate, this.options.texts.apps));

        const el = this.container.querySelectorAll('.ya-map-route__share-apps ul > li');

        el.forEach(function (element) {
            let rel = element.getAttribute('rel'),
                anchor = element.querySelector('a');

            if (anchor) {
                anchor.addEventListener('click', () => {
                    this.emit('appClick', rel);
                });
            }
        }.bind(this));
    }

    processDesktop() {
        let options = ObjectUtil.pick(['telegram', 'whatsapp'], this.options);

        Swal.fire({
            html: StringUtil.substitute(this.options.popupTemplate, Object.assign({}, options, this.options.texts.popup, {
                qr: this.options.beforeOpen()
            })),
            showConfirmButton: false,
            showCloseButton: true,
        })
    }

    processMobile() {
        this.emit('mobileClick');
    }

    toggle(state) {
        ElementUtil.set(this.container, 'class', state ? this.options.classes.hidden : '!' + this.options.classes.hidden);
    }
}