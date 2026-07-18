import React from 'react';
import { motion } from 'framer-motion';
import TenorGif from '../TenorGif';

export default function WelcomeScreen({ onNext }) {
    return (
        <motion.div
            className="screen-wrapper"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.6, duration: 0.8 } }}
            exit={{ scale: 0.8, opacity: 0 }}
        >
            <TenorGif
                postId="15143463"
                aspectRatio={1}
                link="https://tenor.com/view/mochi-mochi-hello-white-mochi-mochi-mochi-mochi-hello-hello-wave-gif-15143463"
                text="Mochi Mochi Hello White Hello Sticker"
            />

            <h1 className="stroke-text" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                Привет, Рая! 🌸
            </h1>

            <p className="stroke-text pangolin-font" style={{ fontSize: '1.4rem', marginBottom: '32px' }}>
                Я приготовил для тебя кое-что особенное... Готова к розовой магии? ✨
            </p>

            <motion.button
                className="bubble-btn"
                onClick={onNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                ПОГНАЛИ!
            </motion.button>
        </motion.div>
    );
}
