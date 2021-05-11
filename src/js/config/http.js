import Vue from 'vue';
import axios from 'axios';
let Http = (method, path, data, headers) => {
    let newData = '';
    let encryption = JSON.parse(localStorage.getItem('UserInfo')) ? JSON.parse(localStorage.getItem('UserInfo')).encryption : null;
    newData = encryption ? Vue.$encode(data) : data;
    let option = {
        method: method,
        url: path,
        data: newData,
        headers: headers
    };
    if (method === "GET") {
        option['params'] = newData;
        delete option.data;
    }
    let HttpData = axios(option)
        .then(response => response)
        .catch(error => error);
    return HttpData.then();
};
export default Http;