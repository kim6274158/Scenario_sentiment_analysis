import {createContext} from 'react';

const LocationContext = createContext({
    serverIp: null,
    setServerIp: () => {}
});

export default LocationContext;