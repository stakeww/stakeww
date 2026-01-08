import { useState, useEffect } from "react";
import { useCreatePrediction } from "@/hooks/use-predictions";
import { MinesGrid } from "@/components/MinesGrid";
import { Loader2, Dices } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import stakeLogo from "@assets/IMG_1152_1767458795544.png";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function MinesBot() {
  const [minesCount, setMinesCount] = useState<number>(3);
  const [predictedSpots, setPredictedSpots] = useState<number[]>([]);
  const { mutate: getPrediction, isPending } = useCreatePrediction();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [predictionKey, setPredictionId] = useState(0);
  
  const [stats, setStats] = useState({
    online: Math.floor(Math.random() * (1450 - 1100 + 1)) + 1100,
    signals: Math.floor(Math.random() * (8500 - 7200 + 1)) + 7200
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        online: prev.online + (Math.random() > 0.5 ? 1 : -1),
        signals: prev.signals + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [isTelegramJoined, setIsTelegramJoined] = useState(() => {
    return localStorage.getItem("telegram_joined") === "true";
  });
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("mines_bot_registered") === "true";
  });
  const [stakeId, setStakeId] = useState(() => {
    return localStorage.getItem("mines_bot_stake_id") || "";
  });
  const [isChecking, setIsChecking] = useState(false);
  const [showIdHint, setShowIdHint] = useState(false);

  const [lang, setLang] = useState<"RU" | "EN">("EN");

  const t = {
    RU: {
      regRequired: "РЕГИСТРАЦИЯ И ПОДПИСКА",
      regDesc: "Для доступа к сигналам подпишитесь на наш Telegram и введите ваш Stake ID.",
      openStake: "ПОДПИСАТЬСЯ НА TELEGRAM",
      enterId: "ВВЕДИТЕ ВАШ STAKE ID",
      whereToFind: "Где найти?",
      verify: "ПРОВЕРИТЬ И НАЧАТЬ",
      verifying: "ПРОВЕРКА...",
      signalsToday: "Сигналов сегодня",
      analyzing: "АНАЛИЗ...",
      getSignal: "GET SIGNAL",
      calculating: "АНАЛИЗ...",
      mines: "Мины",
      recentActivity: "ПОСЛЕДНЯЯ АКТИВНОСТЬ",
      hint1: "1. Перейдите в Настройки на Stake.",
      hint2: "2. Откройте вкладку Общие.",
      hint3: "3. Ваш ID — это имя пользователя (вверху).",
      protected: "Защищено системой Stake Affiliate",
      error: "Ошибка",
      enterStakeId: "Пожалуйста, введите ваш Stake ID",
      tgRequired: "Пожалуйста, сначала подпишитесь на Telegram канал",
      success: "Успех",
      regVerified: "Регистрация подтверждена! Доступ разрешен.",
      verifError: "Ошибка верификации",
      idNotFound: "ID не найден в нашей партнерской базе.",
      initializing: "Инициализация системы",
      aiActive: "AI ПРОГНОЗ АКТИВЕН",
      winSignal: "ВЫИГРЫШ",
      minesRange: "1-24 мины",
      selectMinesPlaceholder: "Выберите кол-во мин",
      notAffiliated: "© 2024 MinesPredictor AI. Не аффилировано со Stake.com",
      subscribed: "✓ ПОДПИСАНО",
      serverSeed: "Server Seed (Hashed)",
      howToGet: "Как получить?",
      seedHint1: "1. Перейдите в Fairness на Stake.",
      seedHint2: "2. Выберите вкладку Next Seed.",
      seedHint3: "3. Скопируйте Server Seed (Hashed).",
      inputRequired: "Ввод обязателен",
      inputDesc: "Пожалуйста, введите Server Seed (Hashed) для синхронизации AI.",
      validationError: "Ошибка валидации",
      invalidSeedFormat: "Неверный формат Server Seed. Ожидается 64-значный HEX код.",
      fairness: "Контроль честности"
    },
    EN: {
      regRequired: "REGISTRATION & SUBSCRIPTION",
      regDesc: "To access signals, subscribe to our Telegram and enter your Stake ID.",
      openStake: "SUBSCRIBE TO TELEGRAM",
      enterId: "ENTER YOUR STAKE ID",
      whereToFind: "Where to find?",
      verify: "VERIFY & START",
      verifying: "VERIFYING...",
      signalsToday: "Signals Today",
      analyzing: "ANALYZING...",
      getSignal: "GET SIGNAL",
      calculating: "ANALYZING...",
      mines: "Mines",
      recentActivity: "RECENT ACTIVITY",
      hint1: "1. Go to Settings on Stake.",
      hint2: "2. Open General tab.",
      hint3: "3. Your ID is your Username (shown at the top).",
      protected: "Protected by Stake Affiliate System",
      error: "Error",
      enterStakeId: "Please enter your Stake ID",
      tgRequired: "Please subscribe to our Telegram channel first",
      success: "Success",
      regVerified: "Registration verified! Access granted.",
      verifError: "Verification Error",
      idNotFound: "ID not found in our database.",
      initializing: "Initializing System",
      aiActive: "AI PREDICTION ACTIVE",
      winSignal: "WIN SIGNAL",
      minesRange: "1-24 mines",
      selectMinesPlaceholder: "Select mines",
      notAffiliated: "© 2024 MinesPredictor AI. Not affiliated with Stake.com",
      subscribed: "✓ SUBSCRIBED",
      serverSeed: "Server Seed (Hashed)",
      howToGet: "How to get?",
      seedHint1: "1. Go to Fairness on Stake.",
      seedHint2: "2. Select Next Seed tab.",
      seedHint3: "3. Copy Server Seed (Hashed).",
      inputRequired: "Input Required",
      inputDesc: "Please enter your Server Seed (Hashed) to synchronize AI.",
      validationError: "Validation Error",
      invalidSeedFormat: "Invalid Server Seed format. 64-character HEX code expected.",
      fairness: "Provably Fair Control System"
    }
  };

  const handleJoinTelegram = () => {
    window.open("https://t.me/+LcqojtT8Y302NzZi", "_blank");
    localStorage.setItem("telegram_joined_clicked", "true");
  };

  const handleCheckRegistration = () => {
    if (!stakeId.trim()) {
      toast({
        title: t[lang].error,
        description: t[lang].enterStakeId,
        variant: "destructive",
      });
      return;
    }

    const hasClickedJoin = localStorage.getItem("telegram_joined_clicked") === "true";
    if (!hasClickedJoin) {
      toast({
        title: t[lang].error,
        description: t[lang].tgRequired,
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      localStorage.setItem("mines_bot_registered", "true");
      localStorage.setItem("mines_bot_stake_id", stakeId);
      localStorage.setItem("telegram_joined", "true");
      setIsTelegramJoined(true);
      setIsRegistered(true);
      setIsChecking(false);
      toast({
        title: t[lang].success,
        description: t[lang].regVerified,
      });
    }, 2000);
  };

  const [serverSeed, setServerSeed] = useState("");
  const [showSeedHint, setShowSeedHint] = useState(false);

  const handlePredict = () => {
    if (!serverSeed.trim()) {
      toast({
        title: t[lang].inputRequired,
        description: t[lang].inputDesc,
        variant: "destructive",
      });
      return;
    }

    // Realistic validation for SHA-256 hashed seed (64 hex chars)
    const isValidFormat = /^[a-f0-9]{64}$/i.test(serverSeed.trim());
    if (!isValidFormat) {
      toast({
        title: t[lang].validationError,
        description: t[lang].invalidSeedFormat,
        variant: "destructive",
      });
      return;
    }

    setPredictedSpots([]);
    setPredictionId(prev => prev + 1);
    setStats(prev => ({ ...prev, signals: prev.signals + 1 }));
    getPrediction(minesCount, {
      onSuccess: (data) => {
        setPredictedSpots(data.predictedSpots);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00e701", "#ffffff", "#00ff00"]
        });
      },
      onError: (error) => {
        toast({
          title: t[lang].error,
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const mineOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  const [recentSignals, setRecentSignals] = useState<{id: string, user: string, mines: number, time: string}[]>([]);

  useEffect(() => {
    const names = ["User", "Player", "Lucky", "Stake", "Mines"];
    const interval = setInterval(() => {
      const newSignal = {
        id: Math.random().toString(36).substr(2, 9),
        user: `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 9999)}`,
        mines: Math.floor(Math.random() * 5) + 1,
        time: "Just now"
      };
      setRecentSignals(prev => [newSignal, ...prev].slice(0, 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setLang("RU")} className={`text-[10px] font-bold px-2 py-1 rounded ${lang === "RU" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>RU</button>
          <button onClick={() => setLang("EN")} className={`text-[10px] font-bold px-2 py-1 rounded ${lang === "EN" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>EN</button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-[#1a2c38] rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col items-center gap-6 text-center"
        >
          <img 
            src={stakeLogo} 
            alt="Logo" 
            className="h-16 w-auto object-contain mb-2"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-black text-white tracking-tight uppercase">{t[lang].regRequired}</h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              {t[lang].regDesc}
            </p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleJoinTelegram}
              className={`
                w-full h-12 rounded-md font-display font-bold text-sm tracking-wide
                transition-all flex items-center justify-center gap-2
                ${isTelegramJoined 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "bg-[#24A1DE] text-white hover:brightness-110 shadow-[0_4px_0_0_#1d82b3] active:translate-y-[2px] active:shadow-none"}
              `}
            >
              {isTelegramJoined ? t[lang].subscribed : t[lang].openStake}
            </button>

            <div className="space-y-2 text-left relative">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {t[lang].enterId}
                </label>
                <button 
                  onClick={() => setShowIdHint(!showIdHint)}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                >
                  {t[lang].whereToFind}
                </button>
              </div>

              <AnimatePresence>
                {showIdHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#0f212e] p-3 rounded-md border border-primary/20 mb-2 text-[11px] text-white/70 space-y-2">
                      <p>{t[lang].hint1}</p>
                      <p>{t[lang].hint2}</p>
                      <p>{t[lang].hint3}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input 
                type="text"
                value={stakeId}
                onChange={(e) => setStakeId(e.target.value)}
                placeholder="Example: User123"
                className="w-full h-12 bg-[#0f212e] border border-[#2f4553] rounded-md px-4 text-white font-semibold focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              onClick={handleCheckRegistration}
              disabled={isChecking}
              className="
                w-full h-14 rounded-md font-display font-black text-lg tracking-wide
                bg-primary text-primary-foreground
                hover:brightness-110 active:scale-[0.98]
                shadow-[0_4px_0_0_#00b500] active:shadow-none active:translate-y-[4px]
                transition-all duration-150 ease-out
                flex items-center justify-center gap-2
              "
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t[lang].verifying}
                </>
              ) : (
                t[lang].verify
              )}
            </button>
          </div>
          
          <p className="text-[9px] text-muted-foreground/40 uppercase font-bold tracking-[0.2em]">
            {t[lang].protected}
          </p>
        </motion.div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={stakeLogo} 
                alt="Logo" 
                className="w-16 h-16 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white font-display font-black text-2xl tracking-tighter">MINES BOT</h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-1 bg-primary rounded-full w-48"
            />
            <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mt-2">{t[lang].initializing}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-start sm:justify-center py-4 sm:py-8 px-4 font-sans safe-area-inset">
      <div className="w-full max-w-[440px] flex flex-col gap-4 sm:gap-6">
        <header className="flex items-center justify-between px-2 py-2 sm:py-4 mb-1 sm:mb-2">
          <div className="flex items-center gap-4">
            <img 
              src={stakeLogo} 
              alt="Mines Bot Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
              style={{ 
                filter: 'brightness(0) invert(1) drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) drop-shadow(-1px 1px 0px black)' 
              }}
            />
            <div className="h-6 sm:h-8 w-[2px] bg-[#2f4553] rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-sm font-bold text-muted-foreground leading-none">MINES</span>
              <span className="text-[10px] sm:text-sm font-bold text-white leading-none">BOT</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#213743] border border-white/5 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-black text-white font-mono tracking-tighter">
                  {stats.online}
                </span>
              </div>
              <div className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {t[lang].signalsToday}: {stats.signals}
              </div>
            </div>
          </div>
        </header>

        <div className="bg-[#1a2c38] p-1 sm:p-2 rounded-xl shadow-2xl border border-white/5 relative group">
          <div className="absolute top-2 left-2 z-10 flex gap-1">
            <button onClick={() => setLang("RU")} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${lang === "RU" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>RU</button>
            <button onClick={() => setLang("EN")} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${lang === "EN" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>EN</button>
          </div>
          <div className="absolute -top-3 -right-3 z-10 bg-primary text-primary-foreground text-[10px] font-black px-2 py-1 rounded shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
            AI POWERED
          </div>
          <div className="relative">
              <MinesGrid key={predictionKey} predictedSpots={predictedSpots} isAnimating={isPending} />
              <AnimatePresence>
                {isPending && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f212e]/90 backdrop-blur-md rounded-xl overflow-hidden"
                  >
                     <div className="relative flex flex-col items-center gap-4">
                       <div className="w-24 h-24 relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
                          />
                          <div className="absolute inset-4 flex items-center justify-center">
                            <motion.div
                              animate={{ scale: [0.8, 1.1, 0.8] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                               <img src={stakeLogo} alt="Loading" className="w-12 h-12 object-contain opacity-50" />
                            </motion.div>
                          </div>
                       </div>
                       <motion.p
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-primary font-display font-black tracking-widest text-sm"
                       >
                          {t[lang].analyzing}
                       </motion.p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#213743] rounded-2xl p-6 flex flex-col gap-5 shadow-2xl border border-white/10">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-white/90">{t[lang].mines}</label>
              <span className="text-xs text-muted-foreground font-medium">{t[lang].minesRange}</span>
            </div>
            
            <Select 
              value={minesCount.toString()} 
              onValueChange={(val) => setMinesCount(parseInt(val))}
              disabled={isPending}
            >
              <SelectTrigger className="h-12 bg-[#0f212e] border-[#2f4553] text-white font-semibold focus:ring-primary/20 focus:border-primary">
                <SelectValue placeholder={t[lang].selectMinesPlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-[#0f212e] border-[#2f4553] text-white max-h-[300px]">
                {mineOptions.map((num) => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()}
                    className="focus:bg-[#2f4553] focus:text-white"
                  >
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                  {t[lang].serverSeed}
                </label>
                <button 
                  onClick={() => setShowSeedHint(!showSeedHint)}
                  className="text-[10px] font-bold text-primary hover:underline uppercase"
                >
                  {t[lang].howToGet}
                </button>
              </div>
              
              <AnimatePresence>
                {showSeedHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#0f212e] p-3 rounded-md border border-primary/20 mb-2 text-[11px] text-white/70 space-y-2">
                      <p>{t[lang].seedHint1}</p>
                      <p>{t[lang].seedHint2}</p>
                      <p>{t[lang].seedHint3}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input 
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                placeholder="Example: 9b6542f8ad86..."
                className="w-full h-11 bg-[#0f212e] border border-[#2f4553] rounded-md px-4 text-white text-xs font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-widest">
                {t[lang].aiActive}
              </p>
            </div>

            <button
              onClick={handlePredict}
              disabled={isPending}
              className="
                w-full h-14 rounded-md font-display font-black text-lg tracking-wide
                bg-primary text-primary-foreground
                hover:brightness-110 active:scale-[0.98]
                shadow-[0_4px_0_0_#00b500] active:shadow-none active:translate-y-[4px]
                transition-all duration-150 ease-out
                flex items-center justify-center gap-2
                relative overflow-hidden group
              "
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t[lang].calculating}
                </>
              ) : (
                t[lang].getSignal
              )}
            </button>
          </div>

          <div className="mt-2 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest text-center">
                {t[lang].recentActivity}
              </span>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {recentSignals.map((signal) => (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-[#0f212e] p-2 rounded border border-white/5 flex justify-between items-center"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white font-bold">{signal.user}</span>
                        <span className="text-[8px] text-muted-foreground uppercase">{t[lang].mines}: {signal.mines}</span>
                      </div>
                      <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{t[lang].winSignal}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center border-t border-white/5 pt-4">
               <div className="flex flex-col items-center gap-3">
                 <div className="flex items-center gap-2 text-[10px] text-[#2f4553] font-mono font-bold tracking-widest uppercase opacity-50">
                    <span>{t[lang].fairness}</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 w-auto" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 w-auto" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Bitcoin" className="h-4 w-auto" />
                 </div>
                 <p className="text-[9px] text-muted-foreground/30 font-medium">{t[lang].notAffiliated}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
