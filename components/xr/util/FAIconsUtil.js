import FAMap from './FAMap';
import icons from '../../../lib/util/icons';

function getContentTypeIcon (type) {
    return icons('content', type.toLowerCase())
}

function getProviderIcon (provider) {
    return icons('provider', provider.toLowerCase());
}

function getEventTypeIcon (type) {
    return icons('event', type.toLowerCase())
}

/*
returns the name of a font awesome character
from its css class

ex:
far fa-clock -> clock
*/
function stripFAName (icon) {
    var match = icon.match(/(?:fa[rlb] fa-)(.*)/);
    return match[1];
}

function getContentTypeIconUnicode (type) {
    var result = FAMap.get(stripFAName(getContentTypeIcon(type)));
    return result;
}

function getEventTypeIconUnicode (type) {
    var result = FAMap.get(stripFAName(getEventTypeIcon(type)));
    return result;
}

function getProviderTypeIconUnicode (type) {
    var result = FAMap.get(stripFAName(getProviderIcon(type)));
    return result;
}

export {getContentTypeIconUnicode, getProviderTypeIconUnicode, getEventTypeIconUnicode,
    getContentTypeIcon, getProviderIcon, getEventTypeIcon,
    stripFAName, FAMap};
