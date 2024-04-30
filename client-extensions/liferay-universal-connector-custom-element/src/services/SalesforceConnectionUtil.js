import {config} from "../utils/constants";
import { getServerUrl, oAuthRequest} from "../utils/request";


export const discoverEntity = (connectionString) => {
    return oAuthRequest({
        data: connectionString,
        method: 'post',
        url: `${getServerUrl()}/${config.salesforceDiscover}`,
    });
}
