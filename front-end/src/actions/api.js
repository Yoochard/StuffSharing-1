import axios from 'axios';
import moment from 'moment';

axios.defaults.baseURL = 'http://localhost:3001/';

const get = path => axios.get(path).then(response => response.data);

const [post, patch, put] = ['post', 'patch', 'put'].map(method =>
  (path, payload) => axios({
    method,
    url: path,
    data: payload,
  }).catch((err) => {
    console.log('encountered error for', path, ':', (err.response || {}).data);
    throw new Error((err.response || {}).data);
  }));


export default {
  getStuffs: (search) => {
    const query = {
      ...Object.entries(search)
        .filter(([key, value]) => ['name', 'count', 'page',
          'sort', 'name', 'asc', 'maxLoan', 'owner'].includes(key))
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {}),
      availableDate: moment(search.availableDate, 'D MMM YY').format('YYYY-MM-DD'),
      category: search.category === 'All' ? undefined : search.category,
      priceLow: search.price[0],
      priceHigh: search.price[1],
      conditionLow: search.condition[0],
      conditionHigh: search.condition[1],
      location: search.location.join(),
    };
    return get(`stuff?${Object.entries(query).reduce((str, [key, value]) => `${str + key}=${encodeURIComponent(value)}&`, '')}`);
  },
  getUsers: () => get('users'),
  getLoans: () => get('bids'),
  getBids: () => get('loans'),
  login: (username, password) => post('login', { username, password }),
  register: user => post('register', user),
};
