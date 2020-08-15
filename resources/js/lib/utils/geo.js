export default {
    parseCoords: function (coordinates) {
        const parts = String(coordinates).split(',');

        if (parts.length === 2) {
            return parts.map(parseFloat);
        }

        return [];
    }
}