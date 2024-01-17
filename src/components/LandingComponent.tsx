'use client'
import React from 'react'
import './LandingComponent.scss'
import { useRouter } from 'next/router'
import Image from 'next/image'
import RaindateLogo from '../assets/svg/raindate.svg' // Adjust the path as necessary
import Head from 'next/head'

const Landing: React.FC = () => {
    const router = useRouter()

    const goToSignup = (): void => {
        router.push('/signup').catch((error) => { console.error('Router push error:', error) })
    }

    const goToLogin = (): void => {
        router.push('/login').catch((error) => { console.error('Router push error:', error) })
    }

    return (
        <div className="container">
            <Head>
                <title>Raindate - Find the Time to Do Some Things</title>
            </Head>

            <div className="logo">
                <RaindateLogo />
            </div>
            <div className="black-bar"></div>
            <Image
                src="/landing/landing_lake.webp"
                alt="A calm lake with rain and a golden stone creating ripples, against hills and a cloudy sky."
                draggable="false"
                className="background-image"
                width='1920'
                height='1080'
                quality={100}
            />
            <h1>Find the Time <br></br> to Do Some Things</h1>
            <div className="buttons">
                <button className="btn" id="signup" onClick={goToSignup}>Sign up</button>
                <button className="btn" id="login" onClick={goToLogin}>Log in</button>
            </div>
        </div>
    )
}

export default Landing
