import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'

import styles from './userInput.module.scss'

function Confirm () {
  const [message, setMessage] = useState('Confirmation missing')
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userCode = router.query.userCode
    if (!router.isReady || !userCode) return

    confirmEmail(userCode)
  }, [router.isReady])

  const confirmEmail = async (userCode) => {
    try {
      setMessage('Confirming your email...')
      await axios.post(process.env.NEXT_PUBLIC_API_URL + `/api/v1/users/confirm/${userCode}`)
      setMessage('Confirmation successful! Your account has been activated.')
      setIsSuccess(true)
    } catch (error) {
      setMessage(error.response?.data.error || 'There was a problem with the server confirming your email! Please try again later...')
    } // test
  }

  const handleRedirectToLogin = () => {
    router.push('/login')
  }

  return (
        <div className={styles.container}>
            <div className={styles.form}>
                <p className={styles.message}>
                    {message}
                </p>
                {!isSuccess && (
                    <p className={styles.redirectPrompt}>
                        Having trouble? <Link href="/support"><span className={styles.redirectLink}>Contact support</span></Link>
                    </p>
                )}
                {isSuccess && (
                    <button
                        className={styles.submitButton}
                        onClick={handleRedirectToLogin}
                    >
                        Proceed to Login
                    </button>
                )}
            </div>
        </div>
  )
}

export default Confirm
