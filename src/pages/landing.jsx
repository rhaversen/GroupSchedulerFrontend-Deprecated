import React from 'react';
import './landing.scss';

function Landing () {
    return (
        <div className="container">
        <img
            className="background-image"
            src="landing_lake.webp"
            alt="Whoops, it looks like something went wrong with loading this page. Please contact us so we can fix the error"
            draggable="false"
        />
        <div className="overlay-text">Your Text Here</div>
      </div>
    );
  };
  

export default Landing;
