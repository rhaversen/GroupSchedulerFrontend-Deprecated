'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import styles from '@/styles/userInput.module.scss'
import Link from 'next/link'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const ConfirmEmailContent = (): JSX.Element => {
    const [message, setMessage] = useState<string>('The confirmation code is missing, please follow the link again og paste it directly into your browser')
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const confirmationCode = searchParams ? searchParams.get('confirmationCode') : null

    useEffect(() => {
        if (confirmationCode === null) return

        const confirmEmail = async (confirmationCode: string): Promise<void> => {
            setMessage('Confirming your email...')
            try {
                // Encode URI component by escaping special characters
                const encodedConfirmationCode = encodeURIComponent(confirmationCode)
                const response = await axios.post(`${API_V1_URL}users/confirm?confirmationCode=${encodedConfirmationCode}`)

                setMessage(response?.data?.message ?? 'Confirmation successful! Your account has been activated.')
                setIsSuccess(true)
            } catch (error: any) {
                console.error('Error confirming user:', error)
                setMessage(error.response?.data?.error ?? 'Confirmation unsuccessful. Please try again.')
            }
        }

        confirmEmail(confirmationCode)
    }, [confirmationCode])

    return (
        <div>
            <p className={styles.message}>{message}</p>
            {!isSuccess && (
                <p className={styles.redirectPrompt}>
          Having trouble?{' '}
                    <Link href="/support">
                        <button className={styles.redirectLink}>Contact support</button>
                    </Link>
                </p>
            )}
            {isSuccess && (
                <p className={styles.redirectPrompt}>
                    <Link href="/login">
                        <button className={styles.redirectLink}>Proceed to Login</button>
                    </Link>
                </p>
            )}
        </div>
    )
}

const ConfirmEmail = (): JSX.Element => {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <Suspense fallback={<div/>}>
                    <ConfirmEmailContent />
                </Suspense>
            </div>
        </div>
    )
}

export default ConfirmEmail
