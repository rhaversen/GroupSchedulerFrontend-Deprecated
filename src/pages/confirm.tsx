import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import styles from './userInput.module.scss'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

function Confirm (): JSX.Element {
    const [message, setMessage] = useState<string>('Confirmation missing')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const userCode = router.query.userCode as string | undefined
        if (!router.isReady || userCode === '' || userCode == null) return

        confirmEmail(userCode)
    }, [router.isReady, router.query.userCode])

    const confirmEmail = (userCode: string): void => {
        setMessage('Confirming your email...')

        axios.post(`${API_V1_URL}/api/v1/users/confirm/${userCode}`)
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

    const handleRedirectToLogin = (): void => {
        router.push('/login')
            .then(() => {
            // handle success if needed
            })
            .catch(error => {
                console.error('Navigation error:', error)
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.message}>{message}</p>
                {!isSuccess && (
                    <p className={styles.redirectPrompt}>
                        Having trouble?{' '}
                        <Link href="/support">
                            <span className={styles.redirectLink}>
                                Contact support
                            </span>
                        </Link>
                    </p>
                )}
                {isSuccess && (
                    <button
                        className={styles.submitButton}
                        onClick={handleRedirectToLogin}
                    >
                        Proceed to Login
                    </button>
                )}
            </div>
        </div>
    )
}

export default Confirm
