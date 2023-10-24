// External Packages
import { useState } from 'react'
import axios from 'axios'
import validator from 'validator'
import Link from 'next/link'

// Local Modules
import styles from './userInput.module.scss'
import InputField from '../components/inputField'
import useUserInputForm from '../hooks/useUserInputForm'
import { type GetServerSideProps, type GetServerSidePropsContext } from 'next'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const validations = {
    email: {
        validate: (value: string): true | JSX.Element =>
            validator.isEmail(value) ? true : <> Please enter a valid email </>
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

function NewPassword (): JSX.Element {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [shouldShake, setShouldShake] = useState(false)
    const {
        values: formData,
        errors,
        formIsValid,
        handleChange
    } = useUserInputForm(
        {
            email: ''
        },
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

        axios.post(API_V1_URL, formData)
            .then(() => {
                setMessage(
                    'If you have signed up with this email, a password reset link has been sent to your email inbox'
                )
            })
            .catch(() => {
                triggerErrorShake()
                setMessage(
                    'There was a problem with the server! Please try again later...'
                )
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
                <Link href="/signup">
                    <span className={styles.redirectLink}>Sign Up</span>
                </Link>
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
