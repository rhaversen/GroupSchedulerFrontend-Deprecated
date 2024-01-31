'use client'

// External Packages
import React, { type FormEvent, type ReactElement, useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import { useRouter } from 'next/navigation'

// Local Modules
import styles from '@/styles/userInput.module.scss'
import InputField from '@/components/inputField'
import useUserInputForm from '@/hooks/useUserInputForm'
import { useUser } from '@/contexts/UserContext'
import LinkText from '@/components/ui/LinkText'
import MessageDisplay from '@/components/ui/MessageDisplay'
import Head from 'next/head'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const validations = {
    email: {
        isValid: (values: Record<string, string | boolean>): boolean => validator.isEmail(values.email as string),
        errors: (values: Record<string, string | boolean>) => !validator.isEmail(values.email as string) ? 'Please enter a valid email' : null
    },
    password: {
        isValid: (values: Record<string, string | boolean>): boolean => (values.password as string) !== '',
        errors: (values: Record<string, string | boolean>) => (values.password as string) === '' ? 'Please enter your password' : null
    },
    stayLoggedIn: {
        isValid: (values: Record<string, string | boolean>): boolean => true,
        errors: (values: Record<string, string | boolean>) => null
    }
}

const inputConfigs = [
    {
        type: 'email',
        name: 'email',
        label: 'Email',
        autoComplete: 'email',
        id: 'email'
    },
    {
        type: 'password',
        name: 'password',
        label: 'Password',
        autoComplete: 'current-password',
        id: 'password'
    }
]

const initialValues: {
    email: string
    password: string
    stayLoggedIn: boolean
} = {
    email: '',
    password: '',
    stayLoggedIn: false
}

function Login (): ReactElement {
    const { setUser } = useUser()
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [shouldShake, setShouldShake] = useState<boolean>(false)
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        axios.post(`${API_V1_URL}users/login-local`, values)
            .then(response => {
                console.info(response)

                const serverMessage = response?.data?.message ?? 'Login successful!'
                setMessage(serverMessage)

                setUser(response.data.user)
                router.push('/')
            })
            .catch(error => {
                console.error('Post error:', error)

                const serverError = error.response?.data?.error ?? 'There was a problem with the server logging you in! Please try again later...'
                setMessage(serverError)

                triggerErrorShake()
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Head>
                <title>Log In | RainDate</title>
                <link rel="canonical" href={'https://www.raindate.net/login'} />
            </Head>
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
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="stayLoggedIn"
                            id="stayLoggedIn"
                            checked={values.stayLoggedIn as boolean} // Always a checkbox
                            onChange={handleChange}
                        />
                        <label htmlFor="stayLoggedIn">Stay logged in</label>
                    </div>
                    <button
                        type="submit"
                        disabled={!formIsValid || isLoading}
                        className={`${styles.submitButton} ${
                            shouldShake ? styles.shake : ''
                        }`}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <LinkText href="/signup" prefixText="Don't have an account?" buttonText="Sign Up" />
                <LinkText href="/reset-password" prefixText="Forgot your password?" buttonText="Set New Password" />
                {message !== '' && <MessageDisplay message={message} />}
            </div>
        </>
    )
}

export default Login
