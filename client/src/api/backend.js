import axios from 'axios'

const backend = axios.create({
  baseURL: `http://35.240.233.129`
})

export default backend
