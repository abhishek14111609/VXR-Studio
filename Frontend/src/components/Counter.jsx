import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Counter = ({ end = 100, duration = 2, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration * 100);
        const timer = setInterval(() => {
            start += increment;
            if (start > end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 10);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <span>
            {prefix}
            {count}
            {suffix}
        </span>
    );
};

export default Counter;
