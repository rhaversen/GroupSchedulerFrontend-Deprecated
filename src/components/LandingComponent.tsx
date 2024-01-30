'use client'

import React from 'react'
import './LandingComponent.scss'
import Image from 'next/image'
import RaindateLogo from '@/components/ui/svg/RaindateLogo'
import Head from 'next/head'
import Link from 'next/link'
import { caveat, fredoka } from '@/fonts'

const Landing: React.FC = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <Head>
                <title>Raindate - Find the Time to Do Some Things</title>
            </Head>

            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 w-[250px] h-auto">
                <RaindateLogo />
            </div>
            <div className="black-bar"></div> {/* Retain SCSS for complex gradient */}
            <Image
                src="/landing/landing_lake.webp"
                alt="A calm lake with rain and a golden stone creating ripples, against hills and a cloudy sky."
                draggable="false"
                className="object-cover w-full h-full"
                width='1920'
                height='1080'
                quality={100}
            />
            <h1 className={`${caveat.className} font-bold absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-w-full text-5xl text-center text-blue-800 whitespace-nowrap`}>
                Find the Time <br/> to Do Some Things
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center w-full">
                <Link href="/signup">
                    <button className={`${fredoka.className} text-lg font-fredoka font-bold bg-blue-800 text-white py-2.5 px-12 m-2.5 rounded-lg cursor-pointer transition duration-300`}>
                        Sign up
                    </button>
                </Link>
                <Link href="/login">
                    <button className={`${fredoka.className} text-lg font-fredoka font-bold bg-blue-800 text-white py-2.5 px-12 m-2.5 rounded-lg cursor-pointer transition duration-300`}>
                        Log in
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Landing
