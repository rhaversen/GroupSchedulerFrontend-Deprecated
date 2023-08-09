import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import styles from './userInput.module.css';

function Confirm() {
    const [message, setMessage] = useState('Confirming your email...');
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const code = router.query.code;
        console.log('query code=' + code);

        const confirmEmail = async () => {
            try {
                await axios.post(process.env.NEXT_PUBLIC_API_URL + `/api/v1/users/confirm/${code}`);
                setMessage('Confirmation successful! Your account has been activated.');
                setIsSuccess(true);
            } catch (error) {
                console.log(error);
                setMessage(error.response?.data.error || 'There was a problem with the server confirming your email! Please try again later...');
            }
        };

        confirmEmail();
    }, [router.isReady, router.query.code]);

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.message}>
                    {message}
                </p>
                {!isSuccess && (
                    <p className={styles.redirectPrompt}>
                        Having trouble? <a href="/support" className={styles.redirectLink}>Contact support</a>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Confirm;
