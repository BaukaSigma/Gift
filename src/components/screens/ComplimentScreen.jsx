import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import TenorGif from '../TenorGif';

const allCompliments = [
    "Ты как git push --force — тебя невозможно остановить",
    "Ты компилируешься с первого раза. Даже код так не умеет",
    "Если бы ты была ошибкой — ни один разработчик не захотел бы тебя фиксить",
    "Ты как 200 OK — всё идеально когда ты рядом",
    "Твой вайб настолько сильный, что у Stack Overflow закончились ответы",
    "Ты как localhost — с тобой всегда всё работает",
    "Даже ChatGPT не смог бы подобрать слова, чтобы описать твою крутость",
    "Ты как хороший README — всё сразу понятно и красиво",
    "Если бы харизму мерили в коммитах, у тебя был бы бесконечный streak",
    "Ты как dark theme — делаешь всё вокруг стильнее",
    "Ты настолько крутая, что серверы Google завидуют твоему аптайму",
    "У тебя нет багов, только фичи",
    "Ты как Ctrl+Z — с тобой любая ситуация становится лучше",
    "Если бы ты была алгоритмом, то O(1) — идеальная эффективность",
    "Ты как Wi-Fi в аэропорту — все хотят к тебе подключиться",
    "Твой уровень крутости вызывает buffer overflow",
    "Ты как sudo — у тебя доступ ко всему",
    "Даже Bitcoin не такой ценный, как твоё внимание",
    "Ты как npm install — добавляешь в жизнь всё самое нужное",
    "Если бы ты была API, у тебя было бы 10 миллиардов запросов в секунду",
    "Ты как VPN — с тобой весь мир открыт",
    "Твой код жизни написан без единого бага",
    "Ты как SSD в мире HDD — быстрее и круче всех",
    "Если бы существовал pip install харизма, это была бы ты",
    "Ты как merge без конфликтов — идеальное совпадение",
    "У тебя больше энергии, чем у новой батарейки MacBook",
    "Ты как 60 FPS — всё с тобой работает плавно",
    "Если бы классность измерялась в пикселях, ты была бы в 16K",
    "Ты как блокчейн — надёжная, прозрачная и на шаг впереди",
    "Скажи привет от всех серверов мира — ты их положила своей харизмой",
];

const hackerToasts = [
    "[SYSTEM] Комплимент #${n} загружен из секретной БД",
    "[ALERT] Уровень очаровательности превышен на ${n}00%!",
    "[LOG] Отправка розовых пакетов данных... OK",
    "[WARN] Сервер комплиментов перегревается!",
    "[DEBUG] cute_level = Integer.MAX_VALUE",
    "[INFO] Кот-оператор одобряет выбор! 🐱",
    "[SYS] Подключение к спутнику комплиментов...",
    "[OK] Дешифровка нового факта завершена",
    "[CRITICAL] Обнаружен неконтролируемый поток милоты",
    "[NET] Ping к серверу настроения: 1ms",
];

export default function ComplimentScreen({ onNext }) {
    const [clicks, setClicks] = useState(0);
    const [complimentIndex, setComplimentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [showSkip, setShowSkip] = useState(false);
    const [isHoveringBtn, setIsHoveringBtn] = useState(false);
    const toastId = useRef(0);

    // Typewriter effect
    useEffect(() => {
        const fullText = allCompliments[complimentIndex];
        let i = 0;
        setDisplayedText('');
        setIsTyping(true);

        const interval = setInterval(() => {
            i++;
            setDisplayedText(fullText.slice(0, i));
            if (i >= fullText.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 35);

        return () => clearInterval(interval);
    }, [complimentIndex]);

    // Fire confetti with pink hearts
    const fireConfetti = useCallback(() => {
        const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FFFFFF'];
        confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.7 },
            colors: colors,
            shapes: ['circle'],
            scalar: 1.2,
            gravity: 0.8,
            ticks: 150,
        });
    }, []);

    // Show toast
    const showToast = useCallback((clickNum) => {
        const template = hackerToasts[Math.floor(Math.random() * hackerToasts.length)];
        const text = template.replace('${n}', String(clickNum));
        const id = ++toastId.current;
        setToasts(prev => [...prev.slice(-2), { id, text }]); // keep max 3
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const handleMore = () => {
        const newClicks = clicks + 1;
        setClicks(newClicks);
        // Pick a random compliment, but avoid repeating the same one
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * allCompliments.length);
        } while (newIndex === complimentIndex && allCompliments.length > 1);
        setComplimentIndex(newIndex);
        fireConfetti();
        showToast(newClicks);

        if (newClicks >= 5 && !showSkip) {
            setShowSkip(true);
        }
    };

    return (
        <motion.div
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: '500px', height: '100vh',
                padding: '40px 16px 40px 16px',
                margin: '0 auto', position: 'relative'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Toast notifications in top-right */}
            <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px' }}>
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 60 }}
                            style={{
                                background: 'rgba(15, 15, 20, 0.85)',
                                border: '1px solid #FF69B4',
                                borderRadius: '10px',
                                padding: '10px 14px',
                                color: '#F9B2CB',
                                fontFamily: '"Courier New", monospace',
                                fontSize: '0.75rem',
                                boxShadow: '0 0 12px rgba(255,105,180,0.4)',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            {t.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Cat GIF with pulsation on button hover */}
            <motion.div
                animate={isHoveringBtn ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={isHoveringBtn ? { duration: 0.6, repeat: Infinity } : {}}
                style={{ marginBottom: '16px' }}
            >
                <TenorGif postId="3360365036046576665" width={200} height={200} />
            </motion.div>

            {/* Compliment text with typewriter effect */}
            <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', padding: '0 8px' }}>
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={complimentIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="stroke-text title-font"
                        style={{ fontSize: '1.5rem', textAlign: 'center' }}
                    >
                        {displayedText}
                        {isTyping && <span style={{ opacity: 0.7 }}>|</span>}
                    </motion.h2>
                </AnimatePresence>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '12px', marginTop: 'auto', marginBottom: '60px' }}>
                <motion.button
                    className="bubble-btn"
                    onClick={handleMore}
                    onPointerEnter={() => setIsHoveringBtn(true)}
                    onPointerLeave={() => setIsHoveringBtn(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ width: '100%', maxWidth: '300px' }}
                >
                    ЕЩЕ ФАКТОВ!
                </motion.button>

                {/* Skip button — appears after 5 clicks with glitch animation */}
                <AnimatePresence>
                    {showSkip && (
                        <motion.button
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{
                                opacity: [0, 1, 0.7, 1, 0.8, 1],
                                scaleX: [0, 1.1, 0.95, 1.05, 0.98, 1],
                                x: [0, -3, 3, -2, 1, 0]
                            }}
                            transition={{ duration: 0.6 }}
                            onClick={onNext}
                            style={{
                                background: 'transparent',
                                border: '2px solid rgba(255,255,255,0.6)',
                                borderRadius: '20px',
                                padding: '10px 28px',
                                color: '#FFFFFF',
                                fontFamily: '"Fredoka", sans-serif',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                textShadow: '0 0 8px rgba(255,20,147,0.6)',
                                boxShadow: '0 0 10px rgba(255,105,180,0.3)',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}
                        >
                            Перейти дальше
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
