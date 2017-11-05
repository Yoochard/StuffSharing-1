import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/';

const get = path => axios.get(path).then(response => response.data);

const [post, patch, put] = ['post', 'patch', 'put'].map(method =>
  (path, payload) => axios({
    method,
    url: path,
    data: payload,
  }).catch((err) => {
    console.log('encountered error for', path, ':', 'method:', method, (err.response || {}).data, payload);
    throw new Error((err.response || {}).data);
  }));


export default {
  getStuffs: (search) => {
    console.log('search', search);
    return get(`stuff?${Object.entries(search)
      .reduce((str, [key, value]) => `${str + key}=${encodeURIComponent(value)}&`, '')}`);
  },
  getUser: username => get(`users/${username}`),
  login: (username, password) => post('login', { username, password }),
  register: user => post('register', user),
  postNew: stuff => post('users/add/stuff', stuff),
};
