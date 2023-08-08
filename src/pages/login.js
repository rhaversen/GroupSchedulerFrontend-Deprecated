import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import Link from 'next/link';

import styles from './userInput.module.css';

import InputField from '../components/inputField.js';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        emailMsg: '',
        passwordMsg: ''
    });

    const validations = {
        email: value => (validator.isEmail(value) ? "" : "Please enter a valid email."),
        password: value => (value ? "" : "Please enter your password."),
    };

    const handleValidation = (name, value) => {
        const validationMessage = validations[name](value);
        setErrorMessages({ ...errorMessages, [`${name}Msg`]: validationMessage });
        
        const valid = Object.keys(validations).every(key => validations[key](formData[key]) === "");
        setIsFormValid(valid);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        handleValidation(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setMessage('');
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/login', formData);
            setMessage('Login successful!');
        } catch (error) {
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
                <button type="submit" disabled={!isFormValid || isLoading} className={styles.submitButton}>
                    {isLoading ? 'Logging in...' : 'Login'}
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
