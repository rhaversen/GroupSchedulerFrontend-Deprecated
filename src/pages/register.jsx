// External Packages
import { useEffect, useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import Link from 'next/link';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Local Modules
import styles from './userInput.module.scss';
import InputField from '../components/inputField.jsx';

// Setting up zxcvbn options
const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
    },
};
zxcvbnOptions.setOptions(options);

const useForm = (initialValues, validations) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState({});
    const [formIsValid, setFormIsValid] = useState(false);
    const [isTouched, setIsTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsTouched(prev => ({ ...prev, [name]: true }));
        setValues(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const validationErrors = { ...errors };
        const inputIsValid = { ...isValid };

        for (const key in validations) {
            if (values[key] !== undefined && isTouched[key]) {
                if (key === 'confirmPassword') {
                    inputIsValid[key] = validations[key].validate(values[key], values.password);
                } else {
                    inputIsValid[key] = validations[key].validate(values[key]);
                }
                validationErrors[key] = inputIsValid[key] ? '' : validations[key].message;
            }
        }
        
        setIsValid(inputIsValid);
        setErrors(validationErrors);

        const allFieldsValid = Object.keys(validations).every(key => {
            return inputIsValid[key];
        });
        setFormIsValid(allFieldsValid);

        console.log(isTouched);
        console.log(formIsValid);

    }, [values, isTouched]);

    return {
        values,
        errors,
        isValid,
        formIsValid,
        isTouched,
        handleChange
    };
};

function Register() {
    const validations = {
        username: {
            validate: value => value !== '',
            message: 'Please enter a username'
        },
        email: {
            validate: validator.isEmail,
            message: 'Please enter a valid email'
        },
        password: {
            validate: value => {
                const result = zxcvbn(value);
                if (value === '') {
                    return false;
                }
                if (result.score < 2) {
                    validations.password.message = `Hackers can crack your password in ${result.crackTimesDisplay.onlineNoThrottling10PerSecond}`;
                    return false;
                }
                return true;
            },
            message: 'Please enter a password'
        },        
        confirmPassword: {
            validate: (value, password) => value && value === password,
            message: 'Passwords does not match'
        }
    };

    const [shouldShake, setShouldShake] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { values: formData, errors, formIsValid, isTouched, handleChange } = useForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }, validations);
    
    const shakeButton = () => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setMessage('');
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users', formData);
            setMessage(response.data.message);
        } catch (error) {
            shakeButton();
            setMessage(error.response?.data.error || 'There was a problem with the server signing you up! Please try again later...');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <InputField
                    type="text"
                    name="username"
                    label="Username"
                    autoComplete="name"
                    value={formData.username}
                    onChange={handleChange}
                    errorMessage={isTouched.username ? errors.username || '' : ''}
                    color='red'
                />
                <InputField 
                    type="email"
                    name="email"
                    label="Email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    errorMessage={isTouched.username ? errors.email || '' : ''}
                    color='red'
                />
                <InputField
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    errorMessage={errors.password || ''}
                    color='red'
                />
                <InputField
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    errorMessage={errors.confirmPassword || ''}
                    color='red'
                />
                <button
                    type="submit"
                    disabled={!formIsValid || isLoading}
                    className={`${styles.submitButton} ${shouldShake ? styles.shake : ''}`}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p className={styles.redirectPrompt}>
                Already have an account? <Link href="/login"><span className={styles.redirectLink}>Log In</span></Link>
            </p>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export default Register;
