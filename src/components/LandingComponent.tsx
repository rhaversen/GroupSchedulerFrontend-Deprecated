'use client'

import React from 'react'
import './LandingComponent.scss'
import Image from 'next/image'
import RaindateLogo from '@/components/ui/RaindateLogo'
import Head from 'next/head'
import Link from 'next/link'

const Landing: React.FC = () => {
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
                <Link href="/signup">
                    <button className="btn" id="signup">Sign up</button>
                </Link>
                <Link href="/login">
                    <button className="btn" id="login">Log in</button>
                </Link>
            </div>
        </div>
    )
}

export default Landing
