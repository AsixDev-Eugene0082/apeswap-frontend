import axios from 'axios'
import { baseUrlStrapi } from 'hooks/api'

const fetchOrderingFromApi = async () => {
  try {
    const res = await axios.get(`${baseUrlStrapi}/orderings`)
    const orderResult = res.data[0].ordering

    return orderResult
  } catch (error) {
    console.error('fetchOrderingFromApiError::', error)
    return null
  }
}

export default fetchOrderingFromApi
