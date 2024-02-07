import axios from 'axios'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

/**
 * Checks if the user is authenticated by verifying the presence and validity of the connect.sid cookie.
 * @returns {Promise<boolean>} True if the user is authenticated, otherwise false.
 */
export default async function checkAuthentication (): Promise<boolean> {
    try {
        const res = await axios.get(`${API_V1_URL}users/is-authenticated`)
        console.info('Authentication check response status:', res.status)
        return res.status === 200
    } catch (error) {
        // Convert 'error' to an AxiosError type for better error handling in TypeScript
        if (axios.isAxiosError(error)) {
            // The error is an AxiosError
            if (error.response) {
                console.error('Server responded with an error:', error.response.status)
            } else if (error.request) {
                console.error('No response received for authentication check.')
            } else {
                console.error('Error in setting up authentication check request:', error.message)
            }
        } else {
            // The error is not an AxiosError, handling generic or unknown errors
            console.error('An unexpected error occurred:', error)
        }
        return false
    }
}
