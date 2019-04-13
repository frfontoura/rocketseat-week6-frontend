import axios from 'axios'

const api = axios.create({
    baseURL: 'https://frf-omnistack-backend.herokuapp.com'
})

export default api