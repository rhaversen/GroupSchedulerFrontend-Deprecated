import { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';

// Input component to be reused
const InputField = ({ label, type, name, value, autoComplete, onChange, errorMessage }) => (
    <div>
        <label>{label}:</label>
        <input type={type} name={name} autoComplete={autoComplete} value={value} onChange={onChange} />
        {errorMessage && <span>{errorMessage}</span>}
    </div>
);

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
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <InputField label="Username" type="text" name="username" autoComplete="name" value={formData.username} onChange={handleChange} errorMessage={errorMessages.usernameMsg} />
                <InputField label="Email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} errorMessage={errorMessages.emailMsg} />
                <InputField label="Password" type="password" name="password" autoComplete="new-password" onChange={handleChange} errorMessage={errorMessages.passwordMsg} />
                <InputField label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" onChange={handleChange} errorMessage={errorMessages.confirmPasswordMsg} />
                <button type="submit" disabled={!isFormValid || isLoading}>
                    {isLoading ? 'Signing up...' : 'Signup'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;