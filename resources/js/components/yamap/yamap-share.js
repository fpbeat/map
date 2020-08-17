import {GenericUtil, StringUtil, ElementUtil, ObjectUtil} from '~/lib/utils';

import EventEmitter from 'events';

import Swal from 'sweetalert2'

export default class extends EventEmitter {

    options = {
        telegram: 'tg://resolve?domain=fpbeat',
        viber: 'viber://public?id=swelly',
        whatsapp: 'whatsapp://send?abid=+380930250200&text=getlocation',

        classes: {
            container: 'ya-map-route__share-button',
            hidden: 'ya-map-route__share-button-hidden'
        },

        texts: {
            buttonDesktop: 'Отправить на телефон',
            buttonMobile: 'Открыть в приложении Карты'
        },

        template: '<div class="ya-map-route__share-popup">' +
            '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={qr}">' +
            '<div class="ya-map-route__share-social">' +
            '<a href="{whatsapp}" target="_blank" rel="whatsapp"></a>' +
            '<a href="{telegram}" target="_blank" rel="telegram"></a>' +
            '<a href="{viber}" target="_blank" rel="viber"></a>' +
            '</div>' +
            '</div>'
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

        this.addButton();
    }

    addButton() {
        ElementUtil.createAndInject('BUTTON', {
            html: this.options.texts[this.isMobile ? 'buttonMobile' : 'buttonDesktop'],
            class: this.options.classes.container,
            events: {
                click: this.isMobile ? this.processMobile.bind(this) : this.processDesktop.bind(this)
            }
        }, this.container);
    }

    processDesktop() {
        let options = ObjectUtil.pick(['telegram', 'viber', 'whatsapp'], this.options);

        Swal.fire({
            title: this.options.texts.buttonDesktop,
            html: StringUtil.substitute(this.options.template, Object.assign({}, options, {
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