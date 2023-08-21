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

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/users' || '';

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
                const validationResult = validations[key].validate(values[key], values.password);
                if (validationResult === true) {
                    inputIsValid[key] = true;
                    validationErrors[key] = '';
                } else {
                    inputIsValid[key] = false;
                    validationErrors[key] = validationResult;
                }
            }
        }
    
        setIsValid(inputIsValid);
        setErrors(validationErrors);
    
        const allFieldsValid = Object.keys(validations).every(key => {
            return inputIsValid[key];
        });
    
        setFormIsValid(allFieldsValid);
    }, [values]);
    

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
            validate: value => value ? true : 'Please enter a username',
        },
        email: {
            validate: value => validator.isEmail(value) ? true : 'Please enter a valid email',
        },
        password: {
            validate: value => {
                const result = zxcvbn(value);
                if (!value) return 'Please enter a password';
                if (result.score < 2) return `Hackers can crack your password in ${result.crackTimesDisplay.onlineNoThrottling10PerSecond}`;
                return true;
            },
        },        
        confirmPassword: {
            validate: (value, password) => {
                if (!value) return 'Please confirm your password';
                if (value !== password) return 'Passwords do not match';
                return true;
            },
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

    const inputConfigs = [
        { type: 'text', name: 'username', label: 'Username', autoComplete: 'name' },
        { type: 'email', name: 'email', label: 'Email', autoComplete: 'email' },
        { type: 'password', name: 'password', label: 'Password', autoComplete: 'new-password' },
        { type: 'password', name: 'confirmPassword', label: 'Confirm Password', autoComplete: 'new-password' },
    ];
    
    const shakeButton = () => {
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
                {inputConfigs.map(input => (
                    <InputField
                        key={input.name}
                        type={input.type}
                        name={input.name}
                        label={input.label}
                        autoComplete={input.autoComplete}
                        value={formData[input.name]}
                        onChange={handleChange}
                        errorMessage={isTouched[input.name] ? errors[input.name] || '' : ''}
                        color='red'
                    />
                ))}
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
