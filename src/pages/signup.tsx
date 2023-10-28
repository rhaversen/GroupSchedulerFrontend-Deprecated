// External Packages
import React, { useState, type ReactElement } from 'react'
import axios from 'axios'
import validator from 'validator'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { useRouter } from 'next/router'
import cookie from 'cookie'

// Local Modules
import styles from './userInput.module.scss'
import InputField from '../components/inputField'
import useUserInputForm from '../hooks/useUserInputForm'
import { useUser } from '../contexts/UserContext'
import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'

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
            let output = `Hackers can crack your password in ${result.crackTimesDisplay.onlineNoThrottling10PerSecond}.\n`
            if (result.feedback.suggestions.length > 0) {
                output += `Password suggestions: \n ${result.feedback.suggestions.join('\n')}`
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

    const handleSubmit = (e: { preventDefault: () => void }): void => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')
        console.log(values)
        axios.post(API_V1_URL, values)
            .then(response => {
                setMessage(response.data.message)
                setUser(response.data.user)
                goToDashboard()
            })
            .catch(error => {
                triggerErrorShake()
                setMessage(
                    error.response?.data.error !== null && error.response?.data.error !== undefined
                        ? error.response.data.error
                        : 'There was a problem with the server signing you up! Please try again later...'
                )
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const goToLogin = (): void => {
        router.push('/login')
            .catch((error) => {
                console.error('Router push error:', error)
            })
    }

    const goToDashboard = (): void => {
        router.push('/dashboard')
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
            <p className={styles.redirectPrompt}>
                Already have an account?{' '}
                <span className={styles.redirectLink} onClick={goToLogin}>
                    Log in
                </span>
            </p>
            {(message !== '') && <p className={styles.message}>{message}</p>}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const parsedCookies = cookie.parse(context.req.headers.cookie ?? '')
    const token = parsedCookies.token

    // If the user has a token (indicating they're logged in), redirect them to the dashboard
    if (token !== null && token !== undefined && token !== '') {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }

    return { props: {} }
}

export default Signup
