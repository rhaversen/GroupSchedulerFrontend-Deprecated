import { useState } from 'react';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        stayLoggedIn: false
    });
    const [message, setMessage] = useState('');
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Assuming your backend endpoint for signup is '/api/v1/users/signup'
            const response = await axios.post('http://localhost:5000/api/v1/users', formData);
            setMessage('Signup successful!');
            // Handle other responses or redirects here
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status outside the range of 2xx
                console.log('Error Data:', error.response.data);
                console.log('Error Status:', error.response.status);
                console.log('Error Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('Error Request:', error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error:', error.message);
            }
            setMessage('Signup failed!');
         }
    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="name" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <div>
                    <input type="checkbox" name="stayLoggedIn" checked={formData.stayLoggedIn} onChange={handleChange} />
                    <label>Stay logged in</label>
                </div>
                <button type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;
