import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://cofee-react-native.herokuapp.com/api';

const coffeeAPI = axios.create({baseURL});

coffeeAPI.interceptors.request.use(
    async(config) => {
        const token = await AsyncStorage.getItem('token');

        if(token) {
            config.headers!['x-token'] = token;
        }
        return config;
    }, err => {
        return console.log({err});
    }
)

export default coffeeAPI;