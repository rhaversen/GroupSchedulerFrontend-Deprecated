import { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import Link from 'next/link';


import styles from './Signup.module.css';

function InputField({ type, name, label, autoComplete, value, onChange, errorMessage }) {
    return (
        <div className={styles.labelContainer}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputContainer}>
                <input className={styles.input} type={type} name={name} autoComplete={autoComplete} value={value} onChange={onChange} />
                <div className={styles.errorContainer}>
                    {errorMessage && <span className={styles.error}>{errorMessage}</span>}
                </div>
            </div>
        </div>
    );
}

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        usernameMsg: '',
        emailMsg: '',
        passwordMsg: '',
        confirmPasswordMsg: ''
    });

    const validations = {
        username: value => (value ? "" : "Please enter a username"),
        email: value => (validator.isEmail(value) ? "" : "Please enter a valid email."),
        password: value => (validator.isStrongPassword(value) ? "" : "Password must be strong (e.g., contain letters, numbers, and symbols)."),
        confirmPassword: value => (value === formData.password ? "" : "Passwords must match.")
    };

    const handleValidation = (name, value) => {
        const validationMessage = validations[name](value);
        setErrorMessages({ ...errorMessages, [`${name}Msg`]: validationMessage });
        
        const valid = Object.keys(validations).every(key => validations[key](formData[key]) === "");
        setIsFormValid(valid);
    };

    useEffect(() => {
        // Re-validate the confirmPassword field whenever the password changes, but only if confirmPassword is not empty
        if (formData.confirmPassword !== "") {
            handleValidation('confirmPassword', formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);
    

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
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users', formData);
            setMessage('Signup successful!');
        } catch (error) {
            setMessage(error.response?.data.error || 'Error signing up! Please try again later');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField type="text" name="username" label="Username" autoComplete="name" value={formData.username} onChange={handleChange} errorMessage={errorMessages.usernameMsg} />
                <InputField type="email" name="email" label="Email" autoComplete="email" value={formData.email} onChange={handleChange} errorMessage={errorMessages.emailMsg} />
                <InputField type="password" name="password" label="Password" autoComplete="new-password" onChange={handleChange} errorMessage={errorMessages.passwordMsg} />
                <InputField type="password" name="confirmPassword" label="Confirm Password" autoComplete="new-password" onChange={handleChange} errorMessage={errorMessages.confirmPasswordMsg} />
                <button type="submit" disabled={!isFormValid || isLoading} className={styles.signUpButton}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p className={styles.loginPrompt}>
                Already have an account? <Link href="/login"><span className={styles.loginLink}>Login</span></Link>
            </p>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export default Signup;