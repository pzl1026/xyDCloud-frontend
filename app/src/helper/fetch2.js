import axios from 'axios';

export default async function request (url, options) {
    const data = await axios({
        url: url,
        ...options
    });
    console.log(data);
    const ret = {
        data,
        headers: {}
    };
    return ret;
}