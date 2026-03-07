import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import TenorGif from '../TenorGif';

export default function FinalScreen() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !phone) return;

        setIsLoading(true);
        try {
            await fetch('https://formspree.io/f/xzdjzznj', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone })
            });
            setIsSubmitted(true);
        } catch (err) {
            // Still show success even if network fails
            setIsSubmitted(true);
        }
        setIsLoading(false);
    };

    const inputStyle = {
        padding: '16px 20px',
        borderRadius: '30px',
        border: '4px solid #FF1493',
        outline: 'none',
        fontSize: '1rem',
        fontFamily: '"Nunito", sans-serif',
        fontWeight: 'bold',
        color: '#FF1493',
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        width: '100%'
    };

    return (
        <motion.div
            className="screen-wrapper"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0, transition: { type: 'spring', damping: 15 } }}
        >
            {!isSubmitted ? (
                <>
                    <TenorGif postId="26958685" width={180} height={180} />

                    <h1 className="stroke-text title-font" style={{ fontSize: '2.5rem', textAlign: 'center', lineHeight: '1.2', marginTop: '16px', marginBottom: '12px' }}>
                        С 8 МАРТА! 🌸
                    </h1>

                    <p className="stroke-text" style={{ fontSize: '1rem', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5', fontFamily: '"Nunito", sans-serif' }}>
                        Желаю тебе улыбок, тепла и классного настроения!<br />
                        Пусть этот день будет особенным! 🌷
                    </p>

                    <p className="stroke-text" style={{ fontSize: '0.85rem', textAlign: 'center', marginBottom: '20px', opacity: 0.8, fontFamily: '"Nunito", sans-serif' }}>
                        Оставь свои контакты — тебя ждёт сюрприз! 🎁
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px' }}>
                        <input
                            type="email"
                            placeholder="Твоя почта 📧"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Номер телефона 📱"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={inputStyle}
                            required
                        />
                        <motion.button
                            type="submit"
                            className="bubble-btn"
                            style={{ marginTop: '8px' }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'ОТПРАВЛЯЮ...' : 'ОТПРАВИТЬ'}
                        </motion.button>
                    </form>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '40px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
                    <h2 className="stroke-text title-font" style={{ fontSize: '2rem', marginBottom: '16px', lineHeight: '1.4' }}>
                        Спасибо! 💖
                    </h2>
                    <p className="stroke-text" style={{ fontSize: '1.1rem', lineHeight: '1.6', fontFamily: '"Nunito", sans-serif' }}>
                        С праздником! 🌸✨
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
