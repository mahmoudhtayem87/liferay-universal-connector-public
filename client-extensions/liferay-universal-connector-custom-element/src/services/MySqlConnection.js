import {config} from "../utils/constants";
import { getServerUrl, oAuthRequest} from "../utils/request";


export const discoverTable = (connectionString) => {
    return oAuthRequest({
        data: connectionString,
        method: 'post',
        url: `${getServerUrl()}/${config.mySqlDiscover}`,
    });
}
