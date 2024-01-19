'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import styles from '@/styles/userInput.module.scss'
import Link from 'next/link'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const ConfirmEmail = (): JSX.Element => {
    const [message, setMessage] = useState<string>('Confirmation missing')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const confirmationCode = searchParams ? searchParams.get('confirmationCode') : null

    useEffect(() => {
        if (confirmationCode === null) return

        confirmEmail(confirmationCode)
    }, [confirmationCode])

    const confirmEmail = (confirmationCode: string): void => {
        setMessage('Confirming your email...')

        // Encode URI component by escaping special characters
        const encodedConfirmationCode = encodeURIComponent(confirmationCode)

        axios.post(API_V1_URL + 'users/confirm?confirmationCode=' + encodedConfirmationCode)
            .then(response => {
                console.info(response)

                const serverMessage = response?.data?.message ?? 'Confirmation successful! Your account has been activated.'
                setMessage(serverMessage)

                setIsSuccess(true)
            })
            .catch(error => {
                console.error('Error confirming user:', error)

                const serverError = error.response?.data?.error ?? 'Confirmation unsuccessful. Please try again.'
                setMessage(serverError)
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <Suspense fallback={<p>Loading...</p>}>
                    <ConfirmEmail />
                </Suspense>
                <p className={styles.message}>{message}</p>
                {!isSuccess && (
                    <p className={styles.redirectPrompt}>
                        Having trouble?{' '}
                        <Link href="/support" className={styles.redirectLink}>
                            Contact support
                        </Link>
                    </p>
                )}
                {isSuccess && (
                    <p className={styles.redirectPrompt}>
                        <Link href="/reset-password" className={styles.redirectLink}>
                            Proceed to Login
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}

export default ConfirmEmail
