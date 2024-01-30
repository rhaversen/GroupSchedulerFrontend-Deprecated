import axios from 'axios'
import Cookies from 'js-cookie'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

// Function to check user authentication
export default async function checkAuthentication (): Promise<boolean> {
    const connectSid = Cookies.get('connect.sid');

    if (!connectSid) {
        return false;
    }

    try {
        const res = await axios.get(API_V1_URL + 'users/is-authenticated')
        return res.status === 200
    } catch (error) {
        return false
    }
}
