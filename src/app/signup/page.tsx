'use client'

// External Packages
import React, { type FormEvent, type ReactElement, useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { useRouter } from 'next/navigation'

// Local Modules
import styles from '@/styles/userInput.module.scss'
import InputField from '@/components/inputField'
import useUserInputForm from '@/hooks/useUserInputForm'
import { useUser } from '@/contexts/UserContext'
import LinkText from '@/components/ui/LinkText'
import MessageDisplay from '@/components/ui/MessageDisplay'
import Head from 'next/head'

// Setting up zxcvbn options
const zxcvbnConfigs = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary
    }
}
zxcvbnOptions.setOptions(zxcvbnConfigs)

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const validations = {
    username: {
        isValid: (values: Record<string, string | boolean>): boolean => (values.username as string) !== '',
        errors: (values: Record<string, string | boolean>) => (values.username as string) === '' ? 'Please enter a username' : null
    },
    email: {
        isValid: (values: Record<string, string | boolean>): boolean => validator.isEmail(values.email as string),
        errors: (values: Record<string, string | boolean>) => !validator.isEmail(values.email as string) ? 'Please enter a valid email' : null
    },
    password: {
        isValid: (values: Record<string, string | boolean>): boolean => {
            const result = zxcvbn(values.password as string)
            return (result.score > 2)
        },
        errors: (values: Record<string, string | boolean>) => {
            const result = zxcvbn(values.password as string)

            let output = 'Your password is '
            switch (result.score) {
                case 0:
                    output += 'too guessable.'
                    break
                case 1:
                    output += 'very guessable.'
                    break
                case 2:
                    output += 'somewhat guessable.'
                    break
                case 3:
                    output += 'accepted and safely unguessable.'
                    break
                case 4:
                    output += 'accepted and very unguessable.'
            }

            if (result.score <= 2) {
                output += '\n\nHackers can crack your password in '

                output += result.crackTimesDisplay.offlineSlowHashing1e4PerSecond

                if (result.feedback.warning !== null) {
                    output += `\n\nWarning: ${result.feedback.warning}`
                }
                if (result.feedback.suggestions.length > 0) {
                    output += `\n\nPassword suggestions: \n ${result.feedback.suggestions.join('\n')}`
                }
            }

            return output
        }
    },
    confirmPassword: {
        isValid: (values: Record<string, string | boolean>): boolean => (values.confirmPassword as string) === (values.password as string),
        errors: (values: Record<string, string | boolean>) => {
            if ((values.confirmPassword as string) === '') return 'Please confirm your password'
            if ((values.confirmPassword as string) !== (values.password as string)) return 'Passwords do not match'
            return null
        }
    }
}

const inputConfigs = [
    {
        type: 'text',
        name: 'username',
        label: 'Username',
        autoComplete: 'name',
        id: 'username'
    },
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
        autoComplete: 'new-password',
        id: 'password'

    },
    {
        type: 'password',
        name: 'confirmPassword',
        label: 'Confirm Password',
        autoComplete: 'new-password',
        id: 'confirmPassword'
    }
]

const Signup = (): ReactElement => {
    const { setUser } = useUser()
    const initialValues: {
        username: string
        email: string
        password: string
        confirmPassword: string
    } = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [shouldShake, setShouldShake] = useState(false)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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

        axios.post(`${API_V1_URL}users/`, values)
            .then(response => {
                console.info(response)

                const serverMessage = response?.data?.message ?? 'Signup successful!'
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
                <title>Sign Up | RainDate</title>
                <link rel="canonical" href={'https://www.raindate.net/signup'} />
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
                            value={values[input.name] as string}
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
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <LinkText href="/login" prefixText="Already have an account?" buttonText="Log in" />
                {message !== '' && <MessageDisplay message={message} />}
            </div>
        </>
    )
}

export default Signup
