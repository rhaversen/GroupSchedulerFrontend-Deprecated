'use client'

// External Packages
import React, { useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import Link from 'next/link'

// Local Modules
import styles from '@/styles/userInput.module.scss'
import InputField from '@/components/inputField'
import useUserInputForm from '@/hooks/useUserInputForm'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const validations = {
    email: {
        isValid: (values: Record<string, string | boolean>): boolean => validator.isEmail(values.email as string),
        errors: (values: Record<string, string | boolean>) => !validator.isEmail(values.email as string) ? 'Please enter a valid email' : null
    }
}

const inputConfigs = [
    {
        type: 'email',
        name: 'email',
        label: 'Please enter your email:',
        autoComplete: 'email',
        id: 'email'
    }
]

const initialValues: {
    email: string
} = {
    email: ''
}

function NewPassword (): JSX.Element {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [shouldShake, setShouldShake] = useState(false)
    const {
        values,
        errors,
        formIsValid,
        fieldIsValid,
        isTouched,
        handleChange
    } = useUserInputForm(
        initialValues,
        validations
    )

    const triggerErrorShake = (): void => {
        setShouldShake(true)
        setTimeout(() => {
            setShouldShake(false)
        }, 500)
    }

    const handleSubmit = (e: { preventDefault: () => void }): void => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        axios.post(API_V1_URL + 'users/request-password-reset-email', values)
            .then(() => {
                setMessage('If you have signed up with this email, a password reset link has been sent to your email inbox')
            })
            .catch(() => {
                setMessage('There was a problem with the server! Please try again later...')
                triggerErrorShake()
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                {inputConfigs.map((input) => (
                    <InputField
                        key={input.name}
                        type={input.type}
                        name={input.name}
                        label={input.label}
                        autoComplete={input.autoComplete}
                        value={values[input.name] as string} // Always an input field
                        onChange={handleChange}
                        errorMessage={
                            isTouched[input.name]
                                ? errors[input.name]
                                : ''
                        }
                        fieldIsValid={fieldIsValid[input.name] || !isTouched[input.name]}
                        id={input.id}
                    />
                ))}
                <button
                    type="submit"
                    disabled={!formIsValid || isLoading}
                    className={`${styles.submitButton} ${
                        shouldShake ? styles.shake : ''
                    }`}
                >
                    {'Request New Password'}
                </button>
            </form>
            <p className={styles.redirectPrompt}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className={styles.redirectLink}>
                    Sign Up
                </Link>
            </p>
            <p className={styles.redirectPrompt}>
                Remember your password?{' '}
                <Link href="/login" className={styles.redirectLink}>
                    Log in
                </Link>
            </p>
            {message !== '' && <p className={styles.message}>{message}</p>}
        </div>
    )
}

export default NewPassword
