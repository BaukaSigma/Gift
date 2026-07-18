import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TenorGif from '../TenorGif';

const ICONS = ['🎨', '📚', '💖', '🖌️', '🍭', '🎀', '🌸', '⭐', '🧁', '🎉'];
const GAME_DURATION = 25; // seconds
const WIN_THRESHOLD = 20;

export default function MiniGameScreen({ onNext }) {
    const [phase, setPhase] = useState('intro'); // 'intro' | 'playing' | 'won' | 'lost'
    const containerRef = useRef(null);
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    const playerXRef = useRef(50);
    const [playerXVisual, setPlayerXVisual] = useState(50);

    const requestRef = useRef();
    const spawnIntervalRef = useRef();
    const timerRef = useRef();

    // Start game
    const startGame = () => {
        setPhase('playing');
        setScore(0);
        setItems([]);
        setTimeLeft(GAME_DURATION);
        playerXRef.current = 50;
        setPlayerXVisual(50);
    };

    // Timer countdown
    useEffect(() => {
        if (phase !== 'playing') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase]);

    // Check game over when time runs out
    useEffect(() => {
        if (phase === 'playing' && timeLeft <= 0) {
            if (score >= WIN_THRESHOLD) {
                setPhase('won');
            } else {
                setPhase('lost');
            }
        }
    }, [timeLeft, phase, score]);

    // Win immediately if score reaches threshold
    useEffect(() => {
        if (phase === 'playing' && score >= WIN_THRESHOLD) {
            setPhase('won');
            clearInterval(timerRef.current);
        }
    }, [score, phase]);

    // Spawning items
    useEffect(() => {
        if (phase !== 'playing') return;
        spawnIntervalRef.current = setInterval(() => {
            setItems(prev => [
                ...prev,
                { id: Date.now() + Math.random(), x: Math.random() * 80 + 10, y: -10, icon: ICONS[Math.floor(Math.random() * ICONS.length)] }
            ]);
        }, 900);
        return () => clearInterval(spawnIntervalRef.current);
    }, [phase]);

    // Game loop — slower fall speed
    const updateGame = () => {
        if (phase !== 'playing') return;
        setItems(prev => {
            let newItems = [];
            let caughtCount = 0;
            let pX = playerXRef.current;

            prev.forEach(item => {
                if (item.caught) return; // already counted, skip

                const newY = item.y + 0.6;
                const isColliding = newY > 80 && newY < 92 && Math.abs(item.x - pX) < 12;

                if (isColliding) {
                    caughtCount++;
                    // don't add to newItems — item disappears
                } else if (newY < 110) {
                    newItems.push({ ...item, y: newY });
                }
            });

            if (caughtCount > 0) {
                setScore(s => s + caughtCount);
            }
            return newItems;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    };

    useEffect(() => {
        if (phase === 'playing') {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const handlePointerMove = (e) => {
        if (!containerRef.current || phase !== 'playing') return;
        let clientX = e.clientX;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const boundedX = Math.max(5, Math.min(95, x));
        playerXRef.current = boundedX;
        setPlayerXVisual(boundedX);
    };

    // ===== INTRO SCREEN =====
    if (phase === 'intro') {
        return (
            <motion.div
                style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: '100%', maxWidth: '500px', height: '100vh',
                    padding: '40px 20px', margin: '0 auto', textAlign: 'center'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <TenorGif postId="16367837" width={160} height={160} />

                <h1 className="stroke-text title-font" style={{ fontSize: '2rem', marginTop: '24px', marginBottom: '16px' }}>
                    Мини-Игра!
                </h1>

                <div style={{
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '20px',
                    border: '3px solid #D86386',
                    padding: '20px 24px',
                    marginBottom: '32px',
                    boxShadow: '0 4px 0 #D86386',
                    maxWidth: '350px'
                }}>
                    <p style={{ color: '#D86386', fontFamily: '"Nunito", sans-serif', fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                        Двигай котика пальцем (или мышкой) и лови падающие предметы!
                        <br /><br />
                        Собери минимум <strong>{WIN_THRESHOLD} предметов</strong> до конца таймера, чтобы пройти дальше.
                        <br /><br />
                        Если не успеешь — придётся начать заново! Удачи! 🍀
                    </p>
                </div>

                <motion.button
                    className="bubble-btn"
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ width: '100%', maxWidth: '280px' }}
                >
                    НАЧАТЬ ИГРУ
                </motion.button>
            </motion.div>
        );
    }

    // ===== GAME SCREEN =====
    return (
        <div
            style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', touchAction: 'none' }}
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onTouchMove={handlePointerMove}
        >
            {/* HUD: Score + Timer */}
            <div style={{ position: 'absolute', top: '4vh', left: 0, right: 0, textAlign: 'center', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <h2 className="stroke-text title-font" style={{ fontSize: '1.6rem' }}>
                    Собери {WIN_THRESHOLD} предметов!
                </h2>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
                    <span className="stroke-text title-font" style={{ fontSize: '1.3rem' }}>
                        🎁 {score}/{WIN_THRESHOLD}
                    </span>
                    <span className="stroke-text title-font" style={{ fontSize: '1.3rem', color: timeLeft <= 5 ? '#FF4444' : '#FFFFFF' }}>
                        ⏱ {timeLeft}с
                    </span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '200px', height: '10px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <motion.div
                        style={{ height: '100%', backgroundColor: '#FF1493', borderRadius: '5px' }}
                        animate={{ width: `${Math.min((score / WIN_THRESHOLD) * 100, 100)}%` }}
                    />
                </div>
            </div>

            {/* Falling Items */}
            {items.map(item => (
                <div key={item.id} style={{
                    position: 'absolute', left: `${item.x}%`, top: `${item.y}%`,
                    fontSize: '3rem', transform: 'translateX(-50%)',
                    margin: 0, lineHeight: 1,
                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))'
                }}>
                    {item.icon}
                </div>
            ))}

            {/* Player Cat — bigger, bear hat cat emoji */}
            <motion.div
                style={{
                    position: 'absolute', bottom: '5%',
                    left: `${playerXVisual}%`,
                    transform: 'translateX(-50%)',
                    zIndex: 10, userSelect: 'none', lineHeight: 1,
                    fontSize: '4.5rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
            >
                🐻
            </motion.div>

            {/* WIN Overlay */}
            <AnimatePresence>
                {phase === 'won' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(255, 105, 180, 0.92)',
                            backdropFilter: 'blur(10px)', zIndex: 20, padding: '24px'
                        }}
                    >
                        <TenorGif postId="22501944" width={200} height={200} />
                        <h2 className="stroke-text title-font" style={{ fontSize: '2.2rem', textAlign: 'center', margin: '24px 0' }}>
                            МИССИЯ ВЫПОЛНЕНА! 🏆
                        </h2>
                        <p className="stroke-text" style={{ fontSize: '1.1rem', marginBottom: '24px' }}>
                            Собрано: {score} предметов
                        </p>
                        <motion.button className="bubble-btn" onClick={onNext} whileTap={{ scale: 0.95 }}>
                            ЧТО ДАЛЬШЕ?
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GAME OVER Overlay */}
            <AnimatePresence>
                {phase === 'lost' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(80, 20, 50, 0.92)',
                            backdropFilter: 'blur(10px)', zIndex: 20, padding: '24px'
                        }}
                    >
                        <div style={{ fontSize: '5rem', marginBottom: '16px' }}>😿</div>
                        <h2 className="stroke-text title-font" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '16px' }}>
                            GAME OVER
                        </h2>
                        <p className="stroke-text" style={{ fontSize: '1rem', marginBottom: '24px', textAlign: 'center' }}>
                            Собрано: {score}/{WIN_THRESHOLD}. Нужно больше стараться!
                        </p>
                        <motion.button
                            className="bubble-btn"
                            onClick={startGame}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ПОПРОБОВАТЬ ЕЩЕ РАЗ
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
