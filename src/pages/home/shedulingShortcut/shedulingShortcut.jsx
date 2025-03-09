import React from 'react';
import './shedulingShortcut.css';
import IMG from "./assets/image (3).webp";
import { Parallax } from 'react-parallax';

const Shortcut = () => {
    return (
        <Parallax
            bgImage={IMG}
            strength={300}
            bgImageStyle={{ minHeight: "100vh" }}
        >
            <div className="Shortcut-container">
                <div className="Shortcut-content">
                    
                </div>
            </div>
        </Parallax>
    );
}

export default Shortcut;
