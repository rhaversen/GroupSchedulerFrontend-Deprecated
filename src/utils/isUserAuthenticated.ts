import axios from 'axios'
import Cookies from 'js-cookie'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

// Function to check user authentication
export default async function checkAuthentication (): Promise<boolean> {
    if (!Cookies.get('connect.sid')) {
        return false
    }
    const res = await axios.post(API_V1_URL + 'users/is-authenticated')
    if (res.status === 200) {
        return true
    } else {
        return false
    }
}
