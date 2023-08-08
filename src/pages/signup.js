import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [usernameMsg, setUsernameMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('');

    const handleValidation = (name, value) => {
        if (name === "username" && value === "") {
            setUsernameMsg("Please enter a username");
        } else if (name === "username") {
            setUsernameMsg("");
        }
    
        if (name === "email" && !validator.isEmail(value)) {
            setEmailMsg("Please enter a valid email.");
        } else if (name === "email") {
            setEmailMsg("");
        }
    
        if (name === "password" && !validator.isStrongPassword(value)) {
            setPasswordMsg("Password must be strong (e.g., contain letters, numbers, and symbols).");
        } else if (name === "password") {
            setPasswordMsg("");
        }
    
        if (name === "confirmPassword" && value !== formData.password) {
            setConfirmPasswordMsg("Passwords must match.");
        } else if (name === "confirmPassword") {
            setConfirmPasswordMsg("");
        }
    
        const valid = (
            validator.isEmail(formData.email) &&
            validator.isStrongPassword(formData.password) &&
            formData.username !== ""
        );
        setIsFormValid(valid);
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (formData.hasOwnProperty(name)) {
            setFormData({ ...formData, [name]: value });
        }
        handleValidation(name, value);

        // Check if passwords match when password is updated
        if (name === "password" && value !== formData.confirmPassword && formData.confirmPassword) {
            setConfirmPasswordMsg("Passwords must match.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setMessage('');
            // Assuming your backend endpoint for signup is '/api/v1/users/signup'
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/users', formData);
            setMessage('Signup successful!');
            // Handle other responses or redirects here
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
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        autoComplete="name"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {usernameMsg && <span>{usernameMsg}</span>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {emailMsg && <span>{emailMsg}</span>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    {passwordMsg && <span>{passwordMsg}</span>}
                </div>
                <div>
                    <label>Confirm password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        onChange={handleChange}
                    />
                    {confirmPasswordMsg && <span>{confirmPasswordMsg}</span>}
                </div>
                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}>
                        {isLoading ? 'Signing up...' : 'Signup'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;
