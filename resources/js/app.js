import '../styles/app.less';

import Builder from './components/builder';

export default {
    version: 'VERSION',

    build: (container, options) => new Builder(container, options)
};