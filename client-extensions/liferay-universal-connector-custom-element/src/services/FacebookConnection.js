import {getServerUrl, oAuthRequest} from "../utils/request";
import {config} from "../utils/constants";


export const checkConnection = (connectionString) => {
    return oAuthRequest({
        data: connectionString,
        method: 'post',
        url: `${getServerUrl()}/${config.facebookCheck}`,
    });
}
