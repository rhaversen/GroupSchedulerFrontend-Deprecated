import React from 'react'
import './landing.scss'
import Image from 'next/image'

function Landing (): JSX.Element {
    return (
        <div>
            <div className="container">
                <Image
                    className="background-image"
                    src="landing_lake.webp"
                    alt="Whoops, looks like something went wrong, please reload the page. If the problem persists, please contact support."
                    draggable="false"
                />
                <div className="overlay-text">Your Text Here</div>
            </div>
        </div>
    )
}

export default Landing
