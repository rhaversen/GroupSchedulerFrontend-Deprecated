'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from '@/styles/userInput.module.scss'
import useConfirmEmail from '@/hooks/useConfirmEmail'
import LinkText from '@/components/ui/LinkText'
import MessageDisplay from '@/components/ui/MessageDisplay'
import Head from 'next/head'

const ConfirmEmailContent = (): JSX.Element => {
    const searchParams = useSearchParams()
    const confirmationCode = searchParams ? searchParams.get('confirmationCode') : null
    const { message, isSuccess } = useConfirmEmail(confirmationCode)

    return (
        <>
            <Head>
                <title>Confirm | RainDate</title>
                <link rel="canonical" href={'https://www.raindate.net/confirm'} />
            </Head>
            <div>
                {message !== '' && <MessageDisplay message={message} />}
                {!isSuccess
                    ? (
                        <LinkText href="/support" prefixText='Having trouble?' buttonText="Contact support" />
                    )
                    : (
                        <LinkText href="/login" buttonText="Proceed to Login" />
                    )}
            </div>
        </>
    )
}

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div></div>}>
        {children}
    </Suspense>
)

const ConfirmEmail = (): JSX.Element => (
    <div className={styles.container}>
        <div className={styles.form}>
            <SuspenseWrapper>
                <ConfirmEmailContent />
            </SuspenseWrapper>
        </div>
    </div>
)

export default ConfirmEmail
