// External Packages
import React, { useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import { useRouter } from 'next/router'

// Local Modules
import styles from './userInput.module.scss'
import InputField from '../components/inputField'
import useUserInputForm from '../hooks/useUserInputForm'
import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'

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
        autoComplete: 'email'
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
    const router = useRouter()

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

        axios.post(API_V1_URL, values)
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

    const goToSignup = (): void => {
        router.push('/signup')
            .catch((error) => {
                console.error('Router push error:', error)
            })
    }

    const goToLogin = (): void => {
        router.push('/login')
            .catch((error) => {
                console.error('Router push error:', error)
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
                <span className={styles.redirectLink} onClick={goToSignup}>
                    Sign Up
                </span>
            </p>
            <p className={styles.redirectPrompt}>
                Remember your password?{' '}
                <span className={styles.redirectLink} onClick={goToLogin}>
                    Log in
                </span>
            </p>
            {message !== '' && <p className={styles.message}>{message}</p>}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    // Check if user is logged in here
    // For now, let's return an empty props
    return { props: {} }
}

export default NewPassword
