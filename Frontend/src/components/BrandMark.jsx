import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.jpeg';
import logoWordmark from '../assets/img/logo1.JPEG';

const BrandMark = ({ to = '/', className = '', compact = false, variant = 'default' }) => {
    if (variant === 'wordmark') {
        return (
            <Link to={to} className={`inline-flex items-center ${className}`.trim()} aria-label="VXR Media House">
                <img
                    src={logoWordmark}
                    alt="VXR Media House"
                    className={`${compact ? 'h-11 md:h-13 max-w-56 md:max-w-72' : 'h-16 md:h-18 max-w-80'} w-auto object-contain rounded-lg drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]`}
                />
            </Link>
        );
    }

    return (
        <Link to={to} className={`flex items-center gap-3 ${className}`.trim()}>
            <img
                src={logo}
                alt="VXR Media House"
                className={`rounded-2xl object-cover shadow-lg ${compact ? 'h-11 w-11' : 'h-14 w-14'}`}
            />
            <div className="leading-none">
                <div className={`${compact ? 'text-lg' : 'text-2xl'} font-bold tracking-tighter text-white`}>
                    VXR
                </div>
                <div className="text-[0.65rem] uppercase tracking-[0.45em] text-gray-400 mt-1">
                    Media House
                </div>
            </div>
        </Link>
    );
};

export default BrandMark;