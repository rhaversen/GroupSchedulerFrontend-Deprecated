// External Packages
import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import Link from 'next/link';

// Local Modules
import styles from './userInput.module.scss';
import InputField from '../components/inputField.jsx';
import useUserInputForm from '../hooks/useUserInputForm.js';
import { useUser } from '../contexts/UserContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/users/login-local' || '';

const validations = {
    email: {
        validate: value => validator.isEmail(value) ? true : <> Please enter a valid email </>,
    },
    password: {
        validate: value => value ? true : <> Please enter your password </>,
    }
};

const inputConfigs = [
    { type: 'email', name: 'email', label: 'Email', autoComplete: 'email' },
    { type: 'password', name: 'password', label: 'Password', autoComplete: 'current-password' }
];

function Login() {
    const { setUser } = useUser();  // Use the user context

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);
    const { values: formData, errors, formIsValid, handleChange } = useUserInputForm({
        email: '',
        password: '',
        stayLoggedIn: false
    }, validations);

    const triggerErrorShake = () => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setMessage('');
            const response = await axios.post(API_URL, formData);
            setMessage(response.data.message);
            setUser(response.data.user); // Assuming the backend sends user data on successful login.
        } catch (error) {
            triggerErrorShake();
            setMessage(error.response?.data.error || 'There was a problem with the server logging you in! Please try again later...');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                {inputConfigs.map(input => (
                    <InputField
                        key={input.name}
                        type={input.type}
                        name={input.name}
                        label={input.label}
                        autoComplete={input.autoComplete}
                        value={formData[input.name]}
                        onChange={handleChange}
                        errorMessage={errors[input.name] || ''}
                    />
                ))}
                <div className={styles.checkboxContainer}>
                    <input type="checkbox" name="stayLoggedIn" checked={formData.stayLoggedIn} onChange={handleChange} />
                    <label htmlFor="stayLoggedIn">Stay logged in</label>
                </div>
                <button
                    type="submit"
                    disabled={!formIsValid || isLoading}
                    className={`${styles.submitButton} ${shouldShake ? styles.shake : ''}`}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p className={styles.redirectPrompt}>
                Don't have an account? <Link href="/register"><span className={styles.redirectLink}>Sign Up</span></Link>
            </p>
            <p className={styles.redirectPrompt}>
                Forgot your password? <Link href="/new-password"><span className={styles.redirectLink}>Set New Password</span></Link>
            </p>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export async function getServerSideProps(context) {
    // Check if user is logged in here
    // For now, let's return an empty props
    return { props: {} };
}

export default Login;
