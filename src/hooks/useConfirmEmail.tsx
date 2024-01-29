import axios from 'axios'
import { useEffect, useState } from 'react'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

export const useConfirmEmail = (confirmationCode: string | null) => {
    const [message, setMessage] = useState<string>('The confirmation code is missing, please follow the link again or paste it directly into your browser')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        if (!confirmationCode) return

        const confirmEmail = async () => {
            setMessage('Confirming your email...')
            try {
                const encodedConfirmationCode = encodeURIComponent(confirmationCode)
                const response = await axios.post(`${API_V1_URL}users/confirm?confirmationCode=${encodedConfirmationCode}`)
                setMessage(response?.data?.message ?? 'Confirmation successful! Your account has been activated.')
                setIsSuccess(true)
            } catch (error: any) {
                console.error('Error confirming user:', error)
                setMessage(error.response?.data?.error ?? 'Confirmation unsuccessful. Please try again.')
            }
        }

        confirmEmail()
    }, [confirmationCode])

    return { message, isSuccess }
}

export default useConfirmEmail
