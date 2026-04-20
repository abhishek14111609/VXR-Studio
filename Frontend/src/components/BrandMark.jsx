import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.jpeg';

const BrandMark = ({ to = '/', className = '', compact = false }) => {
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