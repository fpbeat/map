import {GenericUtil, StringUtil, ElementUtil, ObjectUtil} from '~/lib/utils';

import EventEmitter from 'events';

import Swal from 'sweetalert2'

export default class extends EventEmitter {

    options = {
        telegram: 'tg://resolve?domain=fpbeat',
        viber: 'viber://public?id=swelly',
        whatsapp: 'whatsapp://send?abid=+380930250200&text=sometext',

        classes: {
            container: 'ya-map-route__share-button',
            hidden: 'ya-map-route__share-button-hidden'
        },

        texts: {
            button: 'Отправить на телефон'
        },

        template: '<div class="ya-map-route__share-popup">' +
            '<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data={qr}">' +
            '<div class="ya-map-route__share-social">' +
            '<a href="{telegram}" target="_blank" rel="telegram"></a>' +
            '<a href="{whatsapp}" target="_blank" rel="whatsapp"></a>' +
            '<a href="{viber}" target="_blank" rel="viber"></a>' +
            '</div>' +
            '</div>'
    };

    constructor(options = {}) {
        super();

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
            html: this.options.texts.button,
            class: this.options.classes.container,
            events: {
                click: this.process.bind(this)
            }
        }, this.container);
    }

    process() {
        let options = ObjectUtil.pick(['telegram', 'viber', 'whatsapp'], this.options);

        Swal.fire({
            title: 'Отправить на телефон',
            html: StringUtil.substitute(this.options.template, Object.assign({}, options, {
                qr: this.options.beforeOpen()
            })),
            showConfirmButton: false,
            showCloseButton: true,
        })
    }

    toggle(state) {
        ElementUtil.set(this.container, 'class', state ? this.options.classes.hidden : '!' + this.options.classes.hidden);
    }
}