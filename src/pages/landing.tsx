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
                    alt="A serene lake representing peace and tranquility, perfect for planning your next event."
                    draggable="false"
                />
                <div className="overlay-text">Your Text Here</div>
            </div>
        </div>
    )
}

export default Landing
