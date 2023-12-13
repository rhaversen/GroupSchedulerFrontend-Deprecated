import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from './userInput.module.scss'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

function Confirm (): JSX.Element {
    const [message, setMessage] = useState<string>('Confirmation missing')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const confirmationCode = router.query.confirmationCode as string | undefined
        if (!router.isReady || confirmationCode === '' || confirmationCode == null) return

        confirmEmail(confirmationCode)
    }, [router.isReady, router.query.confirmationCode])

    const confirmEmail = (confirmationCode: string): void => {
        setMessage('Confirming your email...')

        // Encode URI component by escaping special characters
        const encodedConfirmationCode = encodeURIComponent(confirmationCode)

        axios.post(API_V1_URL + 'users/confirm/' + encodedConfirmationCode)
            .then(response => {
                if (response?.data?.message !== '') {
                    setMessage(response.data.message)
                } else {
                    setMessage('Confirmation successful! Your account has been activated.')
                }
                setIsSuccess(true)
            })
            .catch(error => {
                console.error('Error confirming email:', error)
                setMessage('Confirmation unsuccessful. Please try again.')
            })
    }

    const goToLogin = (): void => {
        router.push('/login')
            .catch((error) => {
                console.error('Router push error:', error)
            })
    }

    const goToSupport = (): void => {
        router.push('/support')
            .catch((error) => {
                console.error('Router push error:', error)
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.message}>{message}</p>
                {!isSuccess && (
                    <p className={styles.redirectPrompt}>
                    Having trouble?{' '}
                        <span className={styles.redirectLink} onClick={goToSupport}>
                    Contact support
                        </span>
                    </p>
                )}
                {isSuccess && (
                    <button
                        className={styles.submitButton}
                        onClick={goToLogin}
                    >
                        Proceed to Login
                    </button>
                )}
            </div>
        </div>
    )
}

export default Confirm
