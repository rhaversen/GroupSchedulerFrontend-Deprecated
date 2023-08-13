import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import Link from 'next/link';

import styles from './userInput.module.css';

import InputField from '../components/inputField.js';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        stayLoggedIn: false
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        emailMsg: '',
        passwordMsg: ''
    });
    const [shouldShake, setShouldShake] = useState(false);

    const validations = {
        email: value => (validator.isEmail(value) ? "" : "Please enter a valid email."),
        password: value => (value ? "" : "Please enter your password."),
    };

    const handleValidation = (newFormData) => {
        const valid = Object.keys(validations).every(key => validations[key](newFormData[key]) === "");
        setIsFormValid(valid);
    };    

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        const value = type === 'checkbox' ? checked : e.target.value;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        if (validations[name]) {
            setErrorMessages({ ...errorMessages, [`${name}Msg`]: validations[name](value) });
        }
        handleValidation(newFormData);
    };

    const shakeButton = () => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);  // 900 milliseconds corresponds to the shake animation duration
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setMessage('');
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users/login', formData);
            setMessage(response.data.message);
        } catch (error) {
            shakeButton();
            setMessage(error.response?.data.error || 'There was a problem with the server logging you in! Please try again later...');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField type="email" name="email" label="Email" autoComplete="email" value={formData.email} onChange={handleChange} errorMessage={errorMessages.emailMsg} />
                <InputField type="password" name="password" label="Password" autoComplete="current-password" value={formData.password} onChange={handleChange} errorMessage={errorMessages.passwordMsg} />
                <div className={styles.checkboxContainer}>
                    <input type="checkbox" name="stayLoggedIn" checked={formData.stayLoggedIn} onChange={handleChange} />
                    <label htmlFor="stayLoggedIn">Stay logged in</label>
                </div>
                <button type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`${styles.submitButton} ${shouldShake ? styles.shake : ''}`}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p className={styles.redirectPrompt}>
                Don't have an account? <Link href="/signup"><span className={styles.redirectLink}>Sign Up</span></Link>
            </p>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export default Login;
