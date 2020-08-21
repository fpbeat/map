import {GenericUtil, ElementUtil} from '~/lib/utils';

import EventEmitter from 'events';

export default class extends EventEmitter {

    options = {
        classes: {
            container: 'ya-map-route__toggle',
            hidden: 'ya-map-route__hidden',
            button: 'ya-map-route__toggle-button'
        },

        texts: {
            shown: '<label>Скрыть панель</label>',
            hidden: '<label>Открыть панель</label>'
        }
    };

    visible = true;
    toggleElements = [];

    constructor(options = {}) {
        super();

        this.isMobile = GenericUtil.isMobile({
            tablet: true,
            featureDetect: true
        });

        GenericUtil.setOptions(this, options);
    }

    init(directionContainer, shareContainer) {
        this.container = ElementUtil.createAndInject('DIV', {
            class: this.options.classes.container + ' ' + this.options.classes.hidden,
        }, shareContainer, 'after');

        this.toggleElements.push(directionContainer, shareContainer);

        this.isMobile && this.addButton();
    }

    addButton() {
        this.button = ElementUtil.createAndInject('BUTTON', {
            class: this.options.classes.button,
            events: {
                click: this.process.bind(this)
            }
        }, this.container);
    }

    hide() {
        this.toggleElements.forEach(element => ElementUtil.set(element, 'class', this.options.classes.hidden));
        ElementUtil.set(this.button, {
            rel: 'hidden',
            html: this.options.texts.hidden
        });
        this.visible = false;
    }

    show() {
        this.toggleElements.forEach(element => ElementUtil.set(element, 'class', '!' + this.options.classes.hidden));
        ElementUtil.set(this.button, {
            rel: 'shown',
            html: this.options.texts.shown
        });
        this.visible = true;
    }

    process() {
        this.visible ? this.hide() : this.show();
    }

    toggle(state) {
        if (this.isMobile) {
            ElementUtil.set(this.container, 'class', state ? this.options.classes.hidden : '!' + this.options.classes.hidden);

            this[state ? 'hide' : 'show'].call(this);
        }
    }
}