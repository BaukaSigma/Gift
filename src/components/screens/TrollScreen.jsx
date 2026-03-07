import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TenorGif from '../TenorGif';

const taunts = ["Ну попробуй!", "Вжух! 💨", "Миимо! 😜", "Даже не надейся!", "Хаха! 🙃", "Ну всё, пока-пока!"];

export default function TrollScreen({ onNext }) {
    const [escapes, setEscapes] = useState(0);
    const [bubbleText, setBubbleText] = useState("");
    const [showCelebration, setShowCelebration] = useState(false);

    const noScale = Math.max(0, 1 - escapes * 0.16);
    const yesScale = 1 + escapes * 0.08;
    const noGone = noScale <= 0.05;

    const handleClickNo = (e) => {
        e.preventDefault();
        if (noGone) return;
        const newEscapes = escapes + 1;
        setEscapes(newEscapes);
        setBubbleText(taunts[Math.min(newEscapes - 1, taunts.length - 1)]);
    };

    const handleClickYes = () => {
        setShowCelebration(true);
    };

    if (showCelebration) {
        return (
            <motion.div
                className="screen-wrapper"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}
                >
                    <TenorGif postId="26958685" width={200} height={200} />
                    <h1 className="stroke-text title-font" style={{ fontSize: '2.2rem', textAlign: 'center' }}>
                        Я ТАК И ЗНАЛ! 🥰
                    </h1>
                    <motion.button
                        className="bubble-btn"
                        style={{ fontSize: '1.3rem', padding: '18px 44px' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNext}
                    >
                        К ФИНАЛУ
                    </motion.button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="screen-wrapper"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
            <h2 className="stroke-text title-font" style={{ fontSize: '1.6rem', marginBottom: '40px', textAlign: 'center', lineHeight: '1.3' }}>
                Обнаружен секретный сюрприз...<br /> Принять его? 🎁
            </h2>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                <motion.button
                    className="bubble-btn"
                    style={{ backgroundColor: '#A2E3C6', color: '#1B5E20', borderColor: '#4CAF50', padding: '18px 36px', fontSize: '1.4rem' }}
                    animate={{ scale: yesScale }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    whileTap={{ scale: yesScale * 0.9 }}
                    onClick={handleClickYes}
                >
                    ДА
                </motion.button>

                {!noGone && (
                    <motion.button
                        className="bubble-btn"
                        style={{
                            backgroundColor: '#FF8A80', color: '#B71C1C', borderColor: '#D32F2F',
                            padding: '18px 36px', fontSize: '1.4rem',
                            pointerEvents: noScale < 0.15 ? 'none' : 'auto'
                        }}
                        animate={{ scale: noScale, opacity: noScale }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        onClick={handleClickNo}
                    >
                        НЕТ
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {bubbleText && (
                    <motion.div
                        key={escapes}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="stroke-text"
                        style={{ fontSize: '1rem', marginTop: '24px', textAlign: 'center' }}
                    >
                        {bubbleText}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
