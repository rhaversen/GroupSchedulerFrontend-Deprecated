// External Packages
import { type FormEvent, useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import Link from 'next/link'
import cookie from 'cookie'

// Local Modules
import styles from './userInput.module.scss'
import InputField from '../components/inputField'
import useUserInputForm from '../hooks/useUserInputForm'
import { useUser } from '../contexts/UserContext'
import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const validations = {
    email: {
        validate: (value: string): true | JSX.Element =>
            validator.isEmail(value) ? true : <> Please enter a valid email </>
    },
    password: {
        validate: (value: string): true | JSX.Element =>
            value !== '' ? true : <> Please enter your password </>
    }
}

const inputConfigs = [
    {
        type: 'email',
        name: 'email',
        label: 'Email',
        autoComplete: 'email'
    },
    {
        type: 'password',
        name: 'password',
        label: 'Password',
        autoComplete: 'current-password'
    }
]

function Login (): JSX.Element {
    const { setUser } = useUser()
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [shouldShake, setShouldShake] = useState<boolean>(false)
    const {
        values: formData,
        errors,
        formIsValid,
        handleChange
    } = useUserInputForm(
        {
            email: '',
            password: '',
            stayLoggedIn: false
        },
        validations
    )

    const triggerErrorShake = (): void => {
        setShouldShake(true)
        setTimeout(() => {
            setShouldShake(false)
        }, 500)
    }

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        axios.post(API_V1_URL, formData)
            .then(response => {
                setMessage(response.data.message)
                setUser(response.data.user)
            }).catch((error) => {
                console.error('Post error:', error)
                setMessage('There was a problem with the server logging you in! Please try again later...')
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
                        value={formData[input.name]}
                        onChange={handleChange}
                        errorMessage={errors[input.name]}
                    />
                ))}
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        name="stayLoggedIn"
                        checked={formData.stayLoggedIn}
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
            <p className={styles.redirectPrompt}>
                Don&apos;t have an account?{' '}
                <Link href="/signup">
                    <span className={styles.redirectLink}>Sign Up</span>
                </Link>
            </p>
            <p className={styles.redirectPrompt}>
                Forgot your password?{' '}
                <Link href="/new-password">
                    <span className={styles.redirectLink}>
                        Set New Password
                    </span>
                </Link>
            </p>
            {message !== '' && <p className={styles.message}>{message}</p>}
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

export default Login
