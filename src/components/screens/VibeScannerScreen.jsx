import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TenorGif from '../TenorGif';

const logsToPrint = [
    { text: "> [08:03:01] Подключение к нейросети 'CuteCore v2.0'...", delay: 800 },
    { text: "> [08:03:02] Установка защищенного SSL-канала...", delay: 600 },
    { text: "> [08:03:03] Канал установлен. Пинг 1ms.", delay: 500 },
    { text: "> [08:03:04] Поиск субъекта в базе данных \"Best Girls\"...", delay: 1200 },
    { text: "> [08:03:05] Сканирование архивов...", delay: 1000 },
    { text: "> [08:03:06] Анализ сопоставлений по фото...", delay: 1500 },
    { text: "> [08:03:08] Найдено 100% совпадение: Пользователь_ID_777", delay: 800 },
    { text: "> [08:03:09] Загрузка профиля Мадины...", delay: 1200 },
    { text: "> [08:03:10] Анализ уровня классности... [######......] 45%", delay: 900 },
    { text: "> [08:03:11] Анализ уровня классности... [############] 92%", delay: 900 },
    { text: "> [08:03:12] Анализ уровня классности... [################] 100%", delay: 1000 },
    { text: "> [08:03:13] ВНИМАНИЕ: Зашкаливающая эстетика!", delay: 1200, color: '#FFB6C1', glow: true },
    { text: "> [08:03:14] ОШИБКА: Слишком горячо!", delay: 1500, color: '#FF9999', glow: true },
    { text: "> [08:03:15] Принудительное игнорирование ошибки...", delay: 1000 },
    { text: "> [08:03:16] Подготовка секретного сюрприза... СКОМПИЛИРОВАНО.", delay: 1200 },
    { text: "> [08:03:17] ТРЕБУЕТСЯ БИОМЕТРИЧЕСКОЕ ПОДТВЕРЖДЕНИЕ.", delay: 1500, glow: true }
];

/* SVG cloud bubble */
function ThoughtCloud({ text }) {
    return (
        <div style={{ position: 'relative', width: '200px', height: '80px' }}>
            <svg width="200" height="80" viewBox="-5 -15 230 100">
                <ellipse cx="65" cy="18" rx="35" ry="18" fill="#FFF" stroke="#D86386" strokeWidth="2.5" />
                <ellipse cx="110" cy="12" rx="40" ry="22" fill="#FFF" stroke="#D86386" strokeWidth="2.5" />
                <ellipse cx="155" cy="18" rx="35" ry="18" fill="#FFF" stroke="#D86386" strokeWidth="2.5" />
                <ellipse cx="110" cy="38" rx="100" ry="28" fill="#FFF" stroke="#D86386" strokeWidth="2.5" />
                {/* White fill to clean internal lines */}
                <ellipse cx="110" cy="35" rx="95" ry="24" fill="#FFF" />
                <ellipse cx="65" cy="24" rx="30" ry="14" fill="#FFF" />
                <ellipse cx="110" cy="18" rx="35" ry="16" fill="#FFF" />
                <ellipse cx="155" cy="24" rx="30" ry="14" fill="#FFF" />
                {/* Tail bubbles going down-left toward the cat */}
                <circle cx="40" cy="68" r="6" fill="#FFF" stroke="#D86386" strokeWidth="2" />
                <circle cx="25" cy="76" r="3.5" fill="#FFF" stroke="#D86386" strokeWidth="1.5" />
            </svg>
            <div style={{
                position: 'absolute', top: '6px', left: '15px', right: '15px', bottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                color: '#D86386', fontFamily: '"Nunito", sans-serif', fontWeight: 'bold',
                fontSize: '0.65rem', lineHeight: '1.2'
            }}>
                {text}
            </div>
        </div>
    );
}

export default function VibeScannerScreen({ onNext }) {
    const [logs, setLogs] = useState([]);
    const [logsFinished, setLogsFinished] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [catThought, setCatThought] = useState("Проверяем систему... 🐾");
    const terminalRef = useRef(null);

    useEffect(() => {
        let currentLog = 0;
        let timeout;
        const printNext = () => {
            if (currentLog < logsToPrint.length) {
                const log = logsToPrint[currentLog];
                setLogs(prev => [...prev, log]);
                if (currentLog === 4) setCatThought("Идет поиск... 🔍");
                else if (currentLog === 8) setCatThought("Ого, сколько данных! 📁");
                else if (currentLog === 12) setCatThought("Слишком мило! 🙀");
                else if (currentLog === 15) setCatThought("Отсканируй пальчик! 👇");
                currentLog++;
                timeout = setTimeout(printNext, log.delay);
            } else {
                setLogsFinished(true);
            }
        };
        timeout = setTimeout(printNext, 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [logs]);

    useEffect(() => {
        let interval;
        if (isPressing && !success && logsFinished) {
            if (navigator.vibrate) try { navigator.vibrate(30); } catch (e) { }
            interval = setInterval(() => {
                setProgress(p => {
                    const newP = p + (100 / 30);
                    if (newP >= 100) { setSuccess(true); return 100; }
                    return newP;
                });
            }, 100);
        } else {
            if (!success) setProgress(0);
        }
        return () => clearInterval(interval);
    }, [isPressing, success, logsFinished]);

    useEffect(() => {
        if (success) {
            setCatThought("Доступ разрешен! ✨");
            setLogs(prev => [...prev, { text: "> [08:03:20] ЛИЧНОСТЬ ПОДТВЕРЖДЕНА. ДОСТУП РАЗРЕШЕН. 🚀", color: '#00FF00', glow: true }]);
            if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch (e) { }
            setTimeout(() => onNext(), 2500);
        }
    }, [success, onNext]);

    return (
        <motion.div
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: '500px', height: '100vh',
                padding: '20px 16px 24px 16px',
                margin: '0 auto'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* ===== ROW 1: Cat + Cloud ===== */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                width: '100%', marginBottom: '10px', position: 'relative'
            }}>
                <TenorGif postId="16367837" width={150} height={150} />

                <div style={{ marginLeft: '8px', marginTop: '-10px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={catThought}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <ThoughtCloud text={catThought} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ===== ROW 2: Title ===== */}
            <h2 className="title-font" style={{
                fontSize: '1rem', color: '#FFFFFF',
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px #FF1493',
                textAlign: 'center', marginBottom: '6px'
            }}>
                Инициализация протокола доступа...
            </h2>

            {/* ===== ROW 3: Terminal ===== */}
            <div className="terminal-window" ref={terminalRef} style={{ flexShrink: 0, marginBottom: 'auto', height: '170px' }}>
                <AnimatePresence>
                    {logs.map((log, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="terminal-text"
                            style={{
                                color: log.color || '#F9B2CB',
                                textShadow: log.glow ? `0 0 8px ${log.color || '#F9B2CB'}` : 'none',
                                fontWeight: log.glow ? 'bold' : 'normal'
                            }}
                        >
                            {log.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ===== ROW 4: Scanner pinned to the very bottom ===== */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 'auto', paddingTop: '16px' }}>
                <AnimatePresence>
                    {logsFinished && (
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <div
                                onPointerDown={() => setIsPressing(true)}
                                onPointerUp={() => setIsPressing(false)}
                                onPointerLeave={() => setIsPressing(false)}
                                onContextMenu={(e) => e.preventDefault()}
                                style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', touchAction: 'none', marginBottom: '8px' }}
                            >
                                <motion.div
                                    animate={isPressing ? { scale: 0.9 } : { scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{
                                        width: '70px', height: '70px', borderRadius: '50%',
                                        backgroundColor: 'rgba(255, 105, 180, 0.3)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        boxShadow: '0 0 25px rgba(255, 105, 180, 0.6)'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px #FFF)' }}>
                                        <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" />
                                        <path d="M5 12c0-3.87 3.13-7 7-7s7 3.13 7 7" />
                                        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4" />
                                        <path d="M11 12v3" /><path d="M12 15h.01" /><path d="M12 19h.01" />
                                        <path d="M15 12v3" /><path d="M15 19v-2" />
                                        <path d="M9 12v3" /><path d="M9 19v-2" />
                                        <path d="M18 12c0 2-1 4-2 5" /><path d="M6 12c0 2 1 4 2 5" />
                                    </svg>
                                </motion.div>
                                <svg style={{ position: 'absolute', top: '-10px', left: '-10px', width: '90px', height: '90px', pointerEvents: 'none', transform: 'rotate(-90deg)' }}>
                                    <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                                    <motion.circle cx="45" cy="45" r="40" fill="none" stroke="#FF1493" strokeWidth="5" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 - (progress / 100) * 251.2} style={{ filter: 'drop-shadow(0 0 5px #FF1493)' }} />
                                </svg>
                            </div>
                            <p className="title-font" style={{ fontSize: '0.55rem', color: '#FFF', opacity: isPressing ? 1 : 0.5, textShadow: '0 0 5px rgba(255,105,180,0.8)', textAlign: 'center', letterSpacing: '0.5px' }}>
                                удерживай для сканирования
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
