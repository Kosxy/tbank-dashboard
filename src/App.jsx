import { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area,
  ReferenceDot, LineChart, Line, ReferenceLine
} from "recharts";
import {
  TrendingUp, TrendingDown, MessageSquare, CheckCircle2, AlertCircle, ChevronRight,
  ArrowLeft, ExternalLink, Lightbulb
} from "lucide-react";

// 1) NPS BAR — monthly with source breakdown + detail for popup
const npsMonthly = [
  { name: "Окт", pos: 62, neg: 18, total: 80,
    sources: { "Banki.ru": { pos: 28, neu: 12, neg: 8 }, "Sravni.ru": { pos: 20, neu: 5, neg: 6 }, "Klerk.ru": { pos: 10, neu: 2, neg: 3 }, "Otzovik": { pos: 4, neu: 0, neg: 1 } },
    avgRating: 3.9, topThemes: ["Скорость одобрения", "Ставки выше ожиданий", "Удобство приложения"],
    quote: "Кредит одобрили, условия достаточно хорошие, но ставка в месяц — будьте внимательны.",
    negQuote: "Ставки высокие и поддержка по телефону — это не всегда удобно.",
    growthPoint: "Указывать ПСК (полную стоимость кредита) в годовых на этапе предложения, чтобы снизить разочарование клиентов после оформления.",
    event: "КС на уровне 17%", delta: null },
  { name: "Ноя", pos: 68, neg: 15, total: 83,
    sources: { "Banki.ru": { pos: 30, neu: 10, neg: 6 }, "Sravni.ru": { pos: 22, neu: 4, neg: 5 }, "Klerk.ru": { pos: 12, neu: 1, neg: 3 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.1, topThemes: ["Онлайн-оформление", "Персональный менеджер", "Досрочное погашение"],
    quote: "Единственный банк, одобривший кредит бизнесу младше 6 месяцев без залога.",
    negQuote: "Кредитный менеджер подвис, долго ждал ответа. Персональный его поторопил.",
    growthPoint: "Ввести SLA на ответ кредитного менеджера (например, 30 мин) с автоэскалацией на персонального менеджера.",
    event: "КС снижена до 16.5%", delta: null },
  { name: "Дек", pos: 70, neg: 13, total: 83,
    sources: { "Banki.ru": { pos: 31, neu: 9, neg: 5 }, "Sravni.ru": { pos: 23, neu: 4, neg: 4 }, "Klerk.ru": { pos: 11, neu: 2, neg: 3 }, "Otzovik": { pos: 5, neu: 0, neg: 1 } },
    avgRating: 4.2, topThemes: ["Markswebb BIBR 2025", "Кредитная линия", "Интеграция с 1С"],
    quote: "Оборотная кредитная линия — как кредитная карта, но для бизнеса. Очень удобно.",
    negQuote: "Взял оборотный кредит — дали нормальный процент, но помимо кредитного договора куча доп. бумаг.",
    growthPoint: "Сократить пакет документов для оборотного кредита — клиенты ожидают полностью цифровой процесс без бумаг.",
    event: "Markswebb BIBR 2025 — Т-Банк 6-е место", delta: null },
  { name: "Янв", pos: 72, neg: 12, total: 84,
    sources: { "Banki.ru": { pos: 32, neu: 8, neg: 5 }, "Sravni.ru": { pos: 24, neu: 4, neg: 4 }, "Klerk.ru": { pos: 12, neu: 1, neg: 2 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.2, topThemes: ["Скорость выдачи", "Овердрафт урезан", "Минимум документов"],
    quote: "Подала заявку через приложение. Деньги перевели на расчётный счёт за пару часов.",
    negQuote: "Овердрафт урезали в несколько раз без предупреждения при пересмотре лимита.",
    growthPoint: "Уведомлять клиента за 7 дней до пересмотра лимита овердрафта с объяснением причин и рекомендациями по увеличению оборотов.",
    event: "КС снижена до 16%", delta: null },
  { name: "Фев", pos: 74, neg: 11, total: 85,
    sources: { "Banki.ru": { pos: 33, neu: 8, neg: 4 }, "Sravni.ru": { pos: 25, neu: 4, neg: 4 }, "Klerk.ru": { pos: 12, neu: 1, neg: 2 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.3, topThemes: ["КС снижена", "Автоскоринг оборотов", "Проверка контрагентов"],
    quote: "Вбиваешь ИНН — банк сразу показывает светофор. Спасло от перевода мошенникам.",
    negQuote: "Отказ без объяснения причин, хотя кредитная история идеальная. Странный скоринг.",
    growthPoint: "Добавить экран с причиной отказа и рекомендациями: что улучшить для повторной заявки (обороты, срок ведения бизнеса).",
    event: "КС снижена до 15.5%", delta: null },
  { name: "Мар", pos: 78, neg: 10, total: 88,
    sources: { "Banki.ru": { pos: 35, neu: 7, neg: 4 }, "Sravni.ru": { pos: 26, neu: 4, neg: 3 }, "Klerk.ru": { pos: 13, neu: 1, neg: 2 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.4, topThemes: ["Досрочное погашение", "Скорость", "Ставка в месяц"],
    quote: "Кредит на 9 месяцев, закрыла за 7. За досрочное погашение Т-Банк не берёт комиссию.",
    negQuote: "Обещают решение от 2 минут. По факту: перезвонили, уточнили, проверили — ушёл час.",
    growthPoint: "Разделить маркетинговое «от 2 минут» и реальный SLA. В приложении показывать прогресс-бар заявки с этапами и ETA.",
    event: "КС снижена до 15%", delta: null },
  { name: "Апр", pos: 80, neg: 8, total: 88,
    sources: { "Banki.ru": { pos: 36, neu: 7, neg: 3 }, "Sravni.ru": { pos: 27, neu: 4, neg: 3 }, "Klerk.ru": { pos: 13, neu: 1, neg: 1 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.5, topThemes: ["Полностью онлайн", "Кофемашина за 2 часа", "Контрагенты"],
    quote: "Кофемашина сломалась перед сезоном — 420к. Деньги на счёт за пару часов.",
    negQuote: "Плохая КИ была 8 лет назад, не в Т-Банке. Всё равно отказывают или дают бешеный процент.",
    growthPoint: "Внедрить «второй шанс» для клиентов со старыми проблемами в КИ: учитывать давность и текущие обороты в Т-Банке.",
    event: "ЦБ снизил КС до 14.5% (24 апр)", delta: null },
  { name: "Май", pos: 76, neg: 14, total: 90,
    sources: { "Banki.ru": { pos: 1, neu: 0, neg: 2 }, "Sravni.ru": { pos: 34, neu: 3, neg: 1 }, "Klerk.ru": { pos: 12, neu: 1, neg: 2 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.4, topThemes: ["Поддержка по кредитной линии", "Списания по оборотному кредиту", "Договорённости с банком"],
    quote: "Менеджер оперативно разобрался с начислением по кредитной линии и помог снять спорный вопрос.",
    negQuote: "Клиенты жалуются на непонятные списания и расхождение устных договорённостей с фактическими условиями.",
    growthPoint: "Собрать отдельный сценарий «разбор начислений» в чате: выписка, причина списания, ответственный менеджер и срок решения в одном экране.",
    event: "Banki.ru: 4.50 и 5-е место", delta: null },
  { name: "Июн", pos: 79, neg: 11, total: 90,
    sources: { "Banki.ru": { pos: 0, neu: 1, neg: 1 }, "Sravni.ru": { pos: 36, neu: 2, neg: 1 }, "Klerk.ru": { pos: 13, neu: 1, neg: 1 }, "Otzovik": { pos: 4, neu: 1, neg: 1 } },
    avgRating: 4.5, topThemes: ["97% рекомендуют на Sravni.ru", "КС 14.5% на 16 июня", "Ожидание заседания ЦБ"],
    quote: "Sravni.ru фиксирует 4.86 из 5 и 97% рекомендаций по бизнес-отзывам Т-Банка.",
    negQuote: "В кредитных отзывах Banki.ru сохраняются претензии к овердрафту, платежам и прозрачности условий.",
    growthPoint: "Перед заседанием ЦБ 19 июня обновить калькулятор ставки: показать клиенту текущую КС, прогноз и диапазон переплаты по продукту.",
    event: "КС 14.5% на 16 июн", delta: null },
];

// 2) AREA CHART with event markers
const dynamics2024_2026 = [
  { name: "Q1 24", positive: 45, event: null },
  { name: "Q2 24", positive: 42, event: null },
  { name: "Q3 24", positive: 38, event: null },
  { name: "Q4 24", positive: 44, event: "КС 21%" },
  { name: "Q1 25", positive: 50, event: null },
  { name: "Q2 25", positive: 58, event: "КС↓20%" },
  { name: "Q3 25", positive: 65, event: null },
  { name: "Q4 25", positive: 70, event: "BIBR" },
  { name: "Q1 26", positive: 76, event: "КС↓15%" },
  { name: "Q2 26", positive: 79, forecast: 79, event: "КС 14.5%" },
  { name: "Q3 26", positive: null, forecast: 81, event: null },
  { name: "Q4 26", positive: null, forecast: 84, event: null },
];

// 3) RADAR — 3 banks for clarity
const radarData = [
  { subject: "Скорость", tbank: 9.5, tochka: 9.0, sber: 7.0, alfa: 8.5, fullMark: 10 },
  { subject: "UI/UX", tbank: 9.2, tochka: 9.5, sber: 7.8, alfa: 9.0, fullMark: 10 },
  { subject: "Ставки", tbank: 6.8, tochka: 7.0, sber: 8.5, alfa: 7.8, fullMark: 10 },
  { subject: "Лимиты", tbank: 8.5, tochka: 7.5, sber: 9.5, alfa: 8.8, fullMark: 10 },
  { subject: "Без залога", tbank: 9.5, tochka: 9.0, sber: 6.0, alfa: 8.0, fullMark: 10 },
];

// 4) KEY FACTORS — horizontal bars
const keyFactors = [
  { label: "Скорость и онлайн-процесс", pct: 36, color: "#FFDD2D" },
  { label: "Поддержка по кредиту", pct: 24, color: "#A855F7" },
  { label: "Прозрачность условий", pct: 22, color: "#22C55E" },
  { label: "Списания и овердрафт", pct: 18, color: "#EF4444" },
];

// Variants to reduce "broken dash" artifact on forecast lines:
// "bridge"  - small dash offset + rounded caps to hide clipped segment start
// "rounded" - rounded dash caps and joins
// "dense"   - denser dash pattern
const FORECAST_DASH_FIX_MODE = "bridge";

const forecastDashStyle = FORECAST_DASH_FIX_MODE === "dense"
  ? { strokeDasharray: "3 3", strokeLinecap: "round", strokeLinejoin: "round" }
  : FORECAST_DASH_FIX_MODE === "rounded"
    ? { strokeDasharray: "6 4", strokeLinecap: "round", strokeLinejoin: "round" }
    : { strokeDasharray: "6 4", strokeLinecap: "round", strokeLinejoin: "round", strokeDashoffset: -2 };

const timelineEvents = [
  { date: "Q4 2024", title: "Пик ключевой ставки 21%", desc: "Максимальная КС за всю историю. Резкий рост стоимости кредитов МСБ, падение спроса.", type: "negative" },
  { date: "Q2 2025", title: "Начало цикла снижения КС", desc: "ЦБ начал снижение с 21% до 20%. Возобновление спроса на кредитование бизнеса.", type: "positive" },
  { date: "Q4 2025", title: "Markswebb BIBR 2025", desc: "Т-Банк — 6-е место среди интернет-банков для бизнеса. Лидеры: ПСБ, Альфа, Точка.", type: "positive" },
  { date: "Q1 2026", title: "КС снижена до 15%", desc: "Два снижения подряд: до 15.5% в феврале и 15% в марте. Кредиты МСБ дешевеют.", type: "positive" },
  { date: "Q2 2026", title: "КС 14.5% на 16 июня", desc: "После решения 24 апреля ключевая ставка держится на уровне 14.5%. Следующее заседание ЦБ запланировано на 19 июня 2026 года.", type: "positive" },
  { date: "Q3-Q4 2026", title: "Прогноз по КС: 13.5% -> 12%", desc: "SberCIB в обновлении от 10 июня ожидает базовую траекторию: 13.5% в июле-августе, 13% в сентябре, 12.5% в октябре-ноябре и 12% в декабре.", type: "forecast" },
];

const sourcesData = [
  { id: 1, name: "Markswebb Business Internet Banking Rank 2025", type: "Рейтинг UX интернет-банков", link: "https://www.markswebb.ru/report/business-internet-banking-rank-2025/", date: "Дек 2025" },
  { id: 2, name: "Markswebb Mobile Banking Rank 2025", type: "Рейтинг мобильных банков", link: "https://www.markswebb.ru/report/mobile-banking-rank-2025/", date: "Янв 2026" },
  { id: 3, name: "ЦБ РФ: Ключевая ставка", type: "Денежно-кредитная политика", link: "https://www.cbr.ru/hd_base/keyrate/", date: "16 июн 2026" },
  { id: 4, name: "Sravni.ru: Отзывы о бизнесе Т-Банка", type: "Агрегированные отзывы", link: "https://www.sravni.ru/bank/t-bank/biznes/otzyvy/", date: "16 июн 2026" },
  { id: 5, name: "Banki.ru: Отзывы о кредитовании бизнеса Т-Банка", type: "Отзывы клиентов", link: "https://www.banki.ru/services/responses/bank/tcs/product/businesscredits/", date: "16 июн 2026" },
  { id: 6, name: "SberCIB: Прогноз ключевой ставки на 2026", type: "Аналитический прогноз", link: "https://sbercib.ru/publication/prognoz-klyuchevoi-stavki-na-2026-god", date: "10 июн 2026" },
  { id: 7, name: "Т-Банк: кредиты для малого бизнеса", type: "Продуктовые условия", link: "https://www.tbank.ru/business/credit/", date: "Июн 2026" },
  { id: 8, name: "Sravni.ru: кредиты для бизнеса Т-Банка", type: "Сравнение условий", link: "https://www.sravni.ru/biznes-kredity/bank/t-bank/", date: "Июн 2026" },
];

const reviews = [
  { id: 1, author: "Кредитная линия", text: "Позитивный сигнал мая: менеджер быстро разобрался с начислением по кредитной линии и помог клиенту снять спорный вопрос.", rating: 5, date: "01 Май 2026" },
  { id: 2, author: "Оборотный кредит", text: "Свежая зона риска: клиент описывает непонятные списания и просит более детальную выписку по каждому начислению.", rating: 1, date: "29 Май 2026" },
  { id: 3, author: "Бизнес-клиент", text: "В мае появились жалобы на расхождение договорённостей и фактических действий банка при сложностях с погашением.", rating: 1, date: "24 Май 2026" },
  { id: 4, author: "Платёж по кредиту", text: "Повторяется тема платежей: клиенту не хватило ясной инструкции, как корректно провести погашение при блокировке счёта.", rating: 1, date: "30 Апр 2026" },
  { id: 5, author: "Овердрафт", text: "Позитивный кейс: специалист предложил временную индивидуальную льготу по овердрафту, что снизило напряжение клиента.", rating: 5, date: "23 Апр 2026" },
  { id: 6, author: "Овердрафт", text: "Негативный кейс: клиент не понял условия овердрафта и ожидал более прямого отказа от продукта внутри сервиса.", rating: 1, date: "23 Апр 2026" },
  { id: 7, author: "Кредитный лимит", text: "Критичный сигнал: клиент спорит с фактом оформления крупного кредитного лимита и просит понятные доказательства согласия.", rating: 1, date: "22 Апр 2026" },
  { id: 8, author: "Кредитные каникулы", text: "Часть отзывов связана с реструктуризацией и кредитными каникулами: клиентам нужен прозрачный маршрут обращения.", rating: 1, date: "14 Апр 2026" },
  { id: 9, author: "Sravni.ru", text: "На общем бизнес-профиле Т-Банка сохраняется высокий фон лояльности: рейтинг 4.86 из 5 и 97% рекомендаций.", rating: 5, date: "16 Июн 2026" },
];

const Card = ({ children, className = "", style, ...props }) => (
  <div
    className={`ui-card border rounded-3xl p-6 shadow-2xl ${className}`}
    style={{ backgroundColor: "#1C1C1E", borderColor: "#374151", ...style }}
    {...props}
  >
    {children}
  </div>
);

const InfoPopup = ({ text, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={onClose}>
    <div className="relative w-full max-w-md rounded-2xl p-6" style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151" }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: "#2C2C2E", color: "#9CA3AF" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
      >✕</button>
      <h4 className="text-sm font-semibold mb-3" style={{ color: "#FFDD2D" }}>Как рассчитывается</h4>
      <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>{text}</p>
    </div>
  </div>
);

const CardHeader = ({ title, subtitle, methodology }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>{subtitle}</p>}
      </div>
      {methodology && (
        <>
          <button onClick={() => setShowInfo(true)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
            style={{ backgroundColor: "#2C2C2E", color: "#6B7280" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FFDD2D"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6B7280"; }}
          >?</button>
          {showInfo && <InfoPopup text={methodology} onClose={() => setShowInfo(false)} />}
        </>
      )}
    </div>
  );
};

const StarIcon = ({ filled }) => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ fill: filled ? "#FFDD2D" : "none", color: filled ? "#FFDD2D" : "#374151" }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const monthFull = { "Окт": "Октябрь", "Ноя": "Ноябрь", "Дек": "Декабрь", "Янв": "Январь", "Фев": "Февраль", "Мар": "Март", "Апр": "Апрель", "Май": "Май", "Июн": "Июнь" };

const tooltipStyle = { backgroundColor: "#1C1C1E", borderColor: "#333", borderRadius: "8px", color: "#fff", fontSize: "12px" };
const chartInitialDimensions = {
  compact: { width: 1, height: 140 },
  standard: { width: 1, height: 280 },
  radar: { width: 1, height: 320 },
};

// Custom annotation label for area chart events
const EventLabel = ({ viewBox, value }) => {
  if (!value) return null;
  const rawX = Number.isFinite(viewBox?.cx)
    ? viewBox.cx
    : Number.isFinite(viewBox?.x)
      ? viewBox.x + (Number.isFinite(viewBox?.width) ? viewBox.width / 2 : 0)
      : 0;
  const rawY = Number.isFinite(viewBox?.cy)
    ? viewBox.cy
    : Number.isFinite(viewBox?.y)
      ? viewBox.y + (Number.isFinite(viewBox?.height) ? viewBox.height / 2 : 0)
      : 0;
  const anchorX = Math.round(rawX);
  const anchorY = Math.round(rawY);
  const w = Math.max(56, Math.ceil(value.length * 6.5 + 12));
  const badgeY = -44;
  const badgeHeight = 16;
  const guideTop = -26;
  const guideBottomOffset = -4;
  const guideHeight = Math.abs(guideTop - guideBottomOffset);
  const badgeX = -Math.round(w / 2);
  return (
    <g transform={`translate(${anchorX}, ${anchorY})`}>
      <rect x={-1} y={guideTop} width={2} height={guideHeight} rx={1} fill="#FFDD2D" />
      <rect
        x={badgeX}
        y={badgeY}
        width={w}
        height={badgeHeight}
        rx={4}
        fill="#2C2C2E"
        stroke="#4B5563"
        strokeWidth={0.5}
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.55))" }}
      />
      <text x={0} y={-31} textAnchor="middle" fill="#FFDD2D" fontSize={9} fontWeight="600">{value}</text>
    </g>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState("main");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const hoveredBarIndex = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const doc = document.documentElement;
      const bottomDistance = doc.scrollHeight - (scrollY + window.innerHeight);
      setShowScrollTop(bottomDistance <= 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderSourcesView = () => (
    <div className="space-y-6">
      <button onClick={() => setActiveView("main")}
        className="flex items-center gap-2 text-sm mb-4" style={{ color: "#9CA3AF" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#FFDD2D"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
      ><ArrowLeft className="w-4 h-4" /> Назад к сводке</button>
      <Card>
        <CardHeader title="Источники данных" subtitle="Полный список исследований и метрик, использованных в дашборде" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm" style={{ borderBottom: "1px solid #374151", color: "#6B7280" }}>
                <th className="pb-3 font-medium px-4">Название источника</th>
                <th className="pb-3 font-medium px-4">Тип данных</th>
                <th className="pb-3 font-medium px-4">Период</th>
                <th className="pb-3 font-medium px-4 text-right">Ссылка</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sourcesData.map((src) => (
                <tr key={src.id} style={{ borderBottom: "1px solid rgba(55,65,81,0.5)" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(44,44,46,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <td className="py-4 px-4" style={{ color: "#E5E7EB" }}>{src.name}</td>
                  <td className="py-4 px-4" style={{ color: "#9CA3AF" }}>{src.type}</td>
                  <td className="py-4 px-4" style={{ color: "#9CA3AF" }}>{src.date}</td>
                  <td className="py-4 px-4 text-right">
                    <a href={src.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-end gap-1" style={{ color: "#FFDD2D" }}>
                      Перейти <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="app-shell min-h-screen p-4 md:p-8 overflow-x-hidden" style={{ color: "#E5E7EB" }}>
      <div className="max-w-7xl mx-auto space-y-7 md:space-y-8">

        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-center mb-10"
          style={{ background: "transparent", border: "none", boxShadow: "none", borderRadius: 0, padding: 0 }}
        >
          <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
            <rect width="40" height="40" rx="10" fill="#FFDD2D" />
            <path d="M13 14H27V18H22V27H18V18H13V14Z" fill="#000000" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">Аналитика репутации кредитов для бизнеса Т-Банка</h1>
          <p className="mt-3 mb-5 max-w-2xl leading-relaxed" style={{ color: "#9CA3AF" }}>Комплексный анализ репутации, сравнение с рынком и историческая динамика</p>
          <div className="flex items-center gap-3">
            <div className="px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2.5" style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151", color: "#D1D5DB" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22C55E", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22C55E" }}></span>
              </span>
              Июнь 2026
            </div>
            <button onClick={() => setActiveView("sources")}
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5"
              style={{ backgroundColor: "#2C2C2E", border: "1px solid #374151", color: "#D1D5DB" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FFDD2D"; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#2C2C2E"; e.currentTarget.style.color = "#D1D5DB"; }}
            ><ExternalLink className="w-3.5 h-3.5" /> Источники</button>
          </div>
        </div>

        {activeView === "sources" ? renderSourcesView() : (
          <>
            {/* ═══ SECTION 1: Top Metrics ═══ */}
            <div className="grid gap-6 grid-top-3">

              {/* NPS Card — clickable bars with detail popup */}
              <Card className="col-span-1">
                <CardHeader title="Индекс Лояльности (NPS)" subtitle="Q1-Q2 2026"
                  methodology="Прокси NPS строится по доле позитивных и негативных упоминаний в отзывах. Актуальные внешние ориентиры на 16.06.2026: Sravni.ru — 519 отзывов, 4.86 из 5 и 97% рекомендаций; Banki.ru — 20 707 отзывов, оценка 4.50 и 5-е место в народном рейтинге." />
                <div className="mt-2">
                  <div className="text-4xl font-bold text-white">97%</div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="flex items-center px-2 py-0.5 rounded" style={{ color: "#22C55E", backgroundColor: "rgba(34,197,94,0.1)" }}>
                      <TrendingUp className="w-4 h-4 mr-1" />4.86/5
                    </span>
                    <span style={{ color: "#6B7280" }}>рекомендуют на Sravni.ru</span>
                  </div>
                </div>
                <div className="nps-chart-wrap mt-5 w-full" style={{ height: "140px", cursor: "pointer" }}
                  onClick={() => { if (hoveredBarIndex.current !== null) setSelectedMonth(npsMonthly[hoveredBarIndex.current]); }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialDimensions.compact}>
                    <BarChart data={npsMonthly} margin={{ top: 5, right: 0, left: -25, bottom: 0 }} barGap={2}
                      onMouseMove={(state) => { if (state && state.activeTooltipIndex != null) hoveredBarIndex.current = state.activeTooltipIndex; }}
                      onMouseLeave={() => { hoveredBarIndex.current = null; }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4B5563", fontSize: 10 }} domain={[0, 100]} ticks={[0, 50, 100]} />
                      <Tooltip cursor={{ fill: "#2C2C2E" }} contentStyle={tooltipStyle} formatter={(v, n) => [v + "%", n === "pos" ? "Позитив" : "Негатив"]} />
                      <Bar dataKey="pos" fill="#FFDD2D" radius={[3, 3, 0, 0]} barSize={14} activeBar={false} />
                      <Bar dataKey="neg" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={14} opacity={0.5} activeBar={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-4 text-xs" style={{ color: "#9CA3AF" }}>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FFDD2D" }}></div> Позитив</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444", opacity: 0.5 }}></div> Негатив</div>
                  </div>
                  <span className="text-xs" style={{ color: "#4B5563" }}>Нажмите на бар ↑</span>
                </div>
              </Card>

              {/* Key Factors — HORIZONTAL BARS */}
              <Card className="col-span-1">
                <CardHeader title="Ключевые факторы" subtitle="О чем пишут клиенты"
                  methodology="Тематическая классификация свежих кредитных отзывов Banki.ru и агрегированных бизнес-отзывов Sravni.ru. Проценты показывают долю темы в текущей ручной разметке сигналов: скорость/онлайн, поддержка, прозрачность условий, списания и овердрафт." />
                <div className="relative w-full flex items-center justify-center mt-4" style={{ height: "256px" }}>
                  <div className="absolute flex flex-col items-center justify-center z-10"
                    style={{ top: "16px", left: "50%", transform: "translateX(-50%)", width: "128px", height: "128px", borderRadius: "50%", backgroundColor: "rgba(255,221,45,0.15)", border: "1px solid rgba(255,221,45,0.4)" }}>
                    <span className="text-2xl font-bold" style={{ color: "#FFDD2D" }}>{keyFactors[0].pct}%</span>
                    <span className="text-xs mt-1 text-center leading-tight" style={{ color: "#FFDD2D" }}>Скорость<br />онлайн</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ top: "40px", right: "12px", width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.4)" }}>
                    <span className="text-xl font-bold" style={{ color: "#A855F7" }}>{keyFactors[1].pct}%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#A855F7" }}>Поддержка</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ bottom: "24px", right: "40px", width: "84px", height: "84px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}>
                    <span className="text-lg font-bold" style={{ color: "#22C55E" }}>{keyFactors[2].pct}%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#22C55E" }}>Условия</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ bottom: "40px", left: "24px", width: "68px", height: "68px", borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)" }}>
                    <span className="text-base font-bold" style={{ color: "#EF4444" }}>{keyFactors[3].pct}%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#EF4444" }}>Овердрафт</span>
                  </div>
                </div>
              </Card>

              {/* Approval Gauge */}
              <Card className="col-span-1 flex flex-col justify-between">
                <CardHeader title="Одобряемость" subtitle="По отзывам МСБ-клиентов"
                  methodology="Доля клиентов, упомянувших успешное получение кредита, среди всех отзывов о кредитовании бизнеса на Banki.ru и Sravni.ru (2024–2026)." />
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="relative" style={{ width: "240px" }}>
                    <svg viewBox="0 0 200 120" className="w-full">
                      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#2C2C2E" strokeWidth="16" strokeLinecap="round" />
                      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#FFDD2D" strokeWidth="16" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="37.68" />
                      <circle cx="152" cy="38" r="6" fill="#1C1C1E" stroke="#FFDD2D" strokeWidth="3" />
                    </svg>
                    <div className="absolute flex flex-col items-center" style={{ bottom: "0", left: "50%", transform: "translateX(-50%)" }}>
                      <span className="text-3xl font-bold text-white">85.4%</span>
                      <span className="text-sm mt-1" style={{ color: "#6B7280" }}>от всех заявок</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ═══ SECTION 2: NPS Trend with ANNOTATIONS ═══ */}
            <div className="space-y-4 pt-4">
              <Card style={{ height: "400px" }}>
                <CardHeader title="Тренд NPS (Q1 2024 — Q4 2026)" subtitle="Факт + прогноз (пунктир)"
                  methodology="Ось Y — доля позитивных отзывов (%) за квартал. Маркеры: пик КС 21% (Q4 24), начало снижения (Q2 25), Markswebb BIBR (Q4 25), КС 15% (Q1 26) и текущие 14.5% на 16.06.2026. Прогноз Q3-Q4 скорректирован консервативнее из-за свежих негативных кредитных отзывов Banki.ru." />
                <div className="w-full mt-4" style={{ height: "280px" }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialDimensions.standard}>
                    <AreaChart data={dynamics2024_2026} margin={{ top: 34, right: 24, left: 12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFDD2D" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FFDD2D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3A3A3D" strokeOpacity={0.85} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v + "%", "Позитив"]} />
                      <Area type="monotone" dataKey="positive" stroke="#FFDD2D" strokeWidth={3} fillOpacity={1} fill="url(#colorPos)" dot={false} connectNulls={false} />
                      <Area type="monotone" dataKey="forecast" stroke="#FFDD2D" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" fillOpacity={0} dot={false} connectNulls />
                      {dynamics2024_2026.filter(d => d.event).map((d, i) => (
                        <ReferenceDot key={i} x={d.name} y={d.positive} r={5} fill="#FFDD2D" stroke="#1C1C1E" strokeWidth={2}
                          label={<EventLabel value={d.event} />} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid gap-4 grid-timeline">
                {timelineEvents.map((ev, idx) => (
                  <Card key={idx} className="p-5 flex flex-col justify-between" style={{ borderRadius: "16px", borderColor: "rgba(55,65,81,0.6)", backgroundColor: "rgba(28,28,30,0.8)", backdropFilter: "blur(8px)" }}>
                    <div>
                      <div className="text-xs font-bold mb-2" style={{ color: "#6B7280" }}>{ev.date}</div>
                      <h4 className="text-base font-semibold mb-2" style={{ color: ev.type === "positive" ? "#22C55E" : ev.type === "forecast" ? "#FFDD2D" : "#EF4444" }}>{ev.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{ev.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* ═══ SECTION 3: CLEANER Radar & Pros/Cons ═══ */}
            <div className="grid gap-6 pt-4 grid-two-col">
              <Card className="col-span-1 flex flex-col">
                <CardHeader title="Радар конкурентоспособности" subtitle="Т-Банк vs Сбербанк vs Точка vs Альфа"
                  methodology="Оценки 0–10 по 5 параметрам кредитования МСБ. Источники: Markswebb BIBR 2025 (UX, скорость), tbank.ru/sber.ru/tochka.ru (ставки, лимиты, онлайн-процесс оформления кредита без визита в офис)." />
                <div className="flex-1 w-full" style={{ height: "320px", minHeight: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialDimensions.radar}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#D1D5DB", fontSize: 12, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Т-Банк" dataKey="tbank" stroke="#FFDD2D" fill="#FFDD2D" fillOpacity={0.35} strokeWidth={2} />
                      <Radar name="Сбер" dataKey="sber" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} strokeWidth={1.5} />
                      <Radar name="Точка" dataKey="tochka" stroke="#A855F7" fill="#A855F7" fillOpacity={0.1} strokeWidth={1.5} />
                      <Radar name="Альфа" dataKey="alfa" stroke="#EF4444" fill="#EF4444" fillOpacity={0.08} strokeWidth={1.5} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs" style={{ color: "#9CA3AF" }}>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FFDD2D" }}></div> Т-Банк</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }}></div> Сбер</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#A855F7" }}></div> Точка</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }}></div> Альфа</div>
                </div>
              </Card>

              <Card className="col-span-1">
                <CardHeader title="Преимущества и зоны роста" subtitle="Факторный анализ"
                  methodology="Выводы на основе: Markswebb BIBR 2025 (6-е место, 67.4 балла), Sravni.ru (519 отзывов, 97% рекомендаций), Banki.ru (20 707 отзывов, 4.50 и 5-е место), продуктовые страницы tbank.ru." />
                <div className="space-y-5 mt-6">
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-3 text-sm" style={{ color: "#22C55E" }}><TrendingUp className="w-4 h-4" /> Сильные стороны</h4>
                    <ul className="space-y-2">
                      {["Кредит до 30 млн ₽ полностью онлайн — без визита в офис, решение от 2 минут.",
                        "Овердрафт, оборотный кредит, кредитная линия, кредит под госконтракт — всё в одном приложении.",
                        "Автоматическое подтягивание оборотов из других банков при скоринге.",
                        "Одобрение бизнесу младше 6 месяцев без залога — уникально на рынке."
                      ].map((text, i) => (
                        <li key={i} className="flex gap-2 text-xs p-2.5 rounded-xl" style={{ color: "#D1D5DB", backgroundColor: "rgba(44,44,46,0.4)", border: "1px solid #374151" }}>
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#22C55E" }} /> {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-3 text-sm" style={{ color: "#EF4444" }}><TrendingDown className="w-4 h-4" /> Зоны отставания</h4>
                    <ul className="space-y-2">
                      {["Ставка указана в месяц — клиенты путают с годовой (от 1% до 4.99%/мес).",
                        "Свежие отзывы Banki.ru показывают боль вокруг списаний, овердрафта и доказательств согласия на кредитный лимит.",
                        "6-е место в BIBR 2025 — отставание от ПСБ, Альфа и Точки по UX.",
                        "Непрозрачность отказов: часть клиентов получают отказ без объяснения причин."
                      ].map((text, i) => (
                        <li key={i} className="flex gap-2 text-xs p-2.5 rounded-xl" style={{ color: "#D1D5DB", backgroundColor: "rgba(44,44,46,0.4)", border: "1px solid #374151" }}>
                          <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} /> {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3 items-start mt-2 p-4 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.28)" }}>
                    <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#22C55E" }} />
                    <div>
                      <h5 className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "#22C55E" }}>Ключевой инсайт</h5>
                      <p className="text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>
                        Высокая общая лояльность на Sravni.ru сохраняется, но свежие кредитные отзывы Banki.ru смещают приоритеты: скорость уже не перекрывает непрозрачные списания и спорные условия. Главный продуктовый рычаг на июнь — не только быстро выдать кредит, но и объяснить клиенту ставку, лимит, платежи и сценарий отказа до подписания.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* ═══ SECTION 4: Forecasts & Market ═══ */}
            <div className="space-y-6 pt-4">
              <div className="pl-2 mb-2">
                <h3 className="text-lg font-semibold text-white">Прогнозы и рынок</h3>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Как снижение ключевой ставки повлияет на кредитование МСБ</p>
              </div>

              {/* KS forecast chart */}
              <Card>
                <CardHeader title="Прогноз ключевой ставки → стоимость кредитов" subtitle="Базовый сценарий SberCIB"
                  methodology="Факт: по данным ЦБ РФ на 16.06.2026 ключевая ставка составляет 14.5% годовых. Прогноз: базовый сценарий SberCIB Investment Research от 10.06.2026 — 14% в июне, 13.5% в июле-августе, 13% в сентябре, 12.5% в октябре-ноябре и 12% в декабре. Ставка Т-Банка оценена как КС + 5–8%." />
                <div className="w-full mt-4" style={{ height: "280px" }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={chartInitialDimensions.standard}>
                    <LineChart data={[
                      { name: "Q3 24", ks: 18, tbank: null },
                      { name: "Q4 24", ks: 21, tbank: null },
                      { name: "Q1 25", ks: 21, tbank: null },
                      { name: "Q2 25", ks: 20, tbank: null },
                      { name: "Q3 25", ks: 17, tbank: null },
                      { name: "Q4 25", ks: 16, tbank: null },
                      { name: "Q1 26", ks: 15, tbank: null },
                      { name: "Q2 26", ks: 14.5, tbank: null },
                      { name: "Q3 26", ks: null, ksForecast: 13.5, tbank: null, tbankForecast: 20 },
                      { name: "Q4 26", ks: null, ksForecast: 12, tbank: null, tbankForecast: 18 },
                    ]} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3A3A3D" strokeOpacity={0.85} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} domain={[8, 24]} unit="%" />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => v ? v + "%" : "—"} />
                      <ReferenceLine x="Q3 26" stroke="#374151" strokeDasharray="3 3" label={{ value: "прогноз →", fill: "#6B7280", fontSize: 10, position: "top" }} />
                      <Line type="monotone" dataKey="ks" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4, fill: "#22C55E" }} name="КС (факт)" connectNulls={false} />
                      <Line type="monotone" dataKey="ksForecast" stroke="#22C55E" strokeWidth={2} {...forecastDashStyle} dot={{ r: 3, fill: "#22C55E", strokeDasharray: "0" }} name="КС (прогноз)" connectNulls={false} />
                      <Line type="monotone" dataKey="tbankForecast" stroke="#FFDD2D" strokeWidth={2} {...forecastDashStyle} dot={{ r: 3, fill: "#FFDD2D", strokeDasharray: "0" }} name="Ставка Т-Банка (прогноз)" connectNulls={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: "#9CA3AF" }}>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-0.5" style={{ backgroundColor: "#22C55E" }}></div> КС факт</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-0.5" style={{ backgroundColor: "#22C55E", opacity: 0.5, borderTop: "1px dashed #22C55E" }}></div> КС прогноз</div>
                  <div className="flex items-center gap-1.5"><div className="w-4 h-0.5" style={{ backgroundColor: "#FFDD2D", opacity: 0.5, borderTop: "1px dashed #FFDD2D" }}></div> Ставка Т-Банка (прогноз)</div>
                </div>
              </Card>

              {/* Product comparison table */}
              <Card>
                <CardHeader title="Условия кредитования МСБ: сравнение" subtitle="По данным на июнь 2026"
                  methodology="Данные с официальных сайтов и агрегаторов: tbank.ru, sberbank.ru, tochka.com, alfabank.ru, Sravni.ru. Ставки — минимальные заявленные или агрегированные. Фактическая ставка зависит от скоринга, оборотов и залога." />
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #374151" }}>
                        <th className="pb-3 pr-4 font-medium" style={{ color: "#6B7280" }}>Параметр</th>
                        <th className="pb-3 px-3 font-medium text-center" style={{ color: "#FFDD2D" }}>Т-Банк</th>
                        <th className="pb-3 px-3 font-medium text-center" style={{ color: "#22C55E" }}>Сбер</th>
                        <th className="pb-3 px-3 font-medium text-center" style={{ color: "#A855F7" }}>Точка</th>
                        <th className="pb-3 px-3 font-medium text-center" style={{ color: "#EF4444" }}>Альфа</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { param: "Макс. сумма", tbank: "15 млн ₽", sber: "200 млн ₽", tochka: "30 млн ₽", alfa: "30 млн ₽" },
                        { param: "Ставка (год.)", tbank: "от 12%/год*", sber: "от 11%", tochka: "от 14.5%", alfa: "от 13.5%" },
                        { param: "Срок", tbank: "до 12 мес", sber: "до 15 лет", tochka: "до 36 мес", alfa: "до 60 мес" },
                        { param: "Без залога", tbank: "✓ до 10 млн", sber: "✓ до 5 млн", tochka: "✓ до 15 млн", alfa: "✓ до 10 млн" },
                        { param: "Решение", tbank: "от 2 мин", sber: "от 1 мин", tochka: "от 10 мин", alfa: "от 5 мин" },
                        { param: "Мин. срок бизнеса", tbank: "нет**", sber: "от 6 мес", tochka: "от 6 мес", alfa: "от 6 мес" },
                        { param: "Онлайн 100%", tbank: "✓", sber: "частично", tochka: "✓", alfa: "✓" },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(55,65,81,0.3)" }}>
                          <td className="py-3 pr-4 font-medium" style={{ color: "#D1D5DB" }}>{row.param}</td>
                          <td className="py-3 px-3 text-center" style={{ color: "#E5E7EB" }}>{row.tbank}</td>
                          <td className="py-3 px-3 text-center" style={{ color: "#9CA3AF" }}>{row.sber}</td>
                          <td className="py-3 px-3 text-center" style={{ color: "#9CA3AF" }}>{row.tochka}</td>
                          <td className="py-3 px-3 text-center" style={{ color: "#9CA3AF" }}>{row.alfa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 space-y-1 text-xs" style={{ color: "#4B5563" }}>
                    <p>* Т-Банк указывает ставку в месяц (1–4.99%), здесь пересчитано в годовые</p>
                    <p>** По отзывам, Т-Банк одобряет кредиты бизнесу младше 6 месяцев</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* ═══ SECTION 5: Reviews ═══ */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4 pl-2">
                <h3 className="text-lg font-semibold text-white">Последние отзывы</h3>
                <a href="https://www.banki.ru/services/responses/bank/tcs/product/businesscredits/?is_countable=on" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium cursor-pointer" style={{ color: "#9CA3AF" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#FFDD2D"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
                >Все отзывы <ChevronRight className="w-4 h-4" /></a>
              </div>
              <div className="grid gap-4 grid-reviews">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 p-4"
                    style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151", borderRadius: "16px" }}
                  >
                    <div className="p-2 rounded-xl" style={{ backgroundColor: review.rating >= 4 ? "rgba(255,221,45,0.1)" : "#1F2937", color: review.rating >= 4 ? "#FFDD2D" : "#9CA3AF" }}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-white">{review.author}</span>
                        <span style={{ fontSize: "10px", color: "#6B7280" }}>{review.date}</span>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#9CA3AF" }}>{review.text}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < review.rating} />))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-[10px] uppercase tracking-wider font-semibold pt-16 pb-8 select-none" style={{ color: "#333333" }}>
              Источник: Markswebb BIBR/MBR 2025, ЦБ РФ, SberCIB, Sravni.ru, Banki.ru, Klerk.ru (2024–2026)
            </div>
          </>
        )}
      </div>

      {/* Month detail popup — rendered at root level */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.75)" }} onClick={() => setSelectedMonth(null)}>
          <div className="relative w-full max-w-2xl rounded-2xl p-6 overflow-y-auto" style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMonth(null)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: "#2C2C2E", color: "#9CA3AF" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
            >✕</button>

            <div className="flex items-center gap-3 mb-5">
              <div className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ backgroundColor: "#FFDD2D", color: "#000" }}>{monthFull[selectedMonth.name] || selectedMonth.name}</div>
              <div className="text-sm" style={{ color: "#9CA3AF" }}>{selectedMonth.total} отзывов · ★ {selectedMonth.avgRating}</div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Разбивка по источникам</h4>
              <div className="space-y-2">
                {Object.entries(selectedMonth.sources).map(([src, vals]) => (
                  <div key={src} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: "#2C2C2E" }}>
                    <span className="text-xs font-medium w-20 shrink-0" style={{ color: "#D1D5DB" }}>{src}</span>
                    <div className="flex-1 flex gap-1.5" style={{ height: "8px" }}>
                      <div className="rounded-full" style={{ width: (vals.pos / (vals.pos + vals.neu + vals.neg) * 100) + "%", backgroundColor: "#22C55E", height: "8px" }}></div>
                      <div className="rounded-full" style={{ width: (vals.neu / (vals.pos + vals.neu + vals.neg) * 100) + "%", backgroundColor: "#6B7280", height: "8px" }}></div>
                      <div className="rounded-full" style={{ width: (vals.neg / (vals.pos + vals.neu + vals.neg) * 100) + "%", backgroundColor: "#EF4444", height: "8px" }}></div>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "#6B7280" }}>{vals.pos + vals.neu + vals.neg}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs" style={{ color: "#6B7280" }}>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }}></span>позитив</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#6B7280" }}></span>нейтрал</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444" }}></span>негатив</span>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Топ-3 темы месяца</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMonth.topThemes.map((t, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#2C2C2E", color: "#D1D5DB", border: "1px solid #374151" }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="mb-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,221,45,0.08)", border: "1px solid rgba(255,221,45,0.15)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#22C55E" }}>Позитивная цитата</h4>
              <p className="text-sm leading-relaxed italic" style={{ color: "#D1D5DB" }}>«{selectedMonth.quote}»</p>
            </div>

            <div className="mb-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#EF4444" }}>Негативная цитата</h4>
              <p className="text-sm leading-relaxed italic" style={{ color: "#D1D5DB" }}>«{selectedMonth.negQuote}»</p>
            </div>

            <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#A855F7" }}>Точка роста</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>{selectedMonth.growthPoint}</p>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: "#2C2C2E" }}>
              <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Событие месяца</h4>
              <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>{selectedMonth.event}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Наверх"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`scroll-top-btn ${showScrollTop ? "is-visible" : ""}`}
      >
        ↑
      </button>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .app-shell {
          background:
            radial-gradient(1200px 520px at 50% -160px, rgba(255,221,45,0.12) 0%, rgba(255,221,45,0) 70%),
            radial-gradient(780px 360px at 12% 8%, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0) 72%),
            #000000;
          font-family: "Manrope", "IBM Plex Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .ui-card {
          transition: transform 180ms ease, box-shadow 220ms ease;
          box-shadow: 0 14px 42px rgba(0,0,0,0.36);
        }
        .ui-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 54px rgba(0,0,0,0.5);
        }
        button, a {
          transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #FFDD2D;
          outline-offset: 2px;
          border-radius: 10px;
        }
        .scroll-top-btn {
          position: fixed;
          right: 22px;
          bottom: 22px;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(255,221,45,0.35);
          background: rgba(28,28,30,0.88);
          color: #FFDD2D;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          cursor: pointer;
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
          transition: opacity 220ms ease, transform 220ms ease, background-color 180ms ease, border-color 180ms ease;
          z-index: 70;
        }
        .scroll-top-btn.is-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .scroll-top-btn:hover {
          background: rgba(255,221,45,0.15);
        }
        .recharts-surface, .recharts-surface *,
        .recharts-wrapper, .recharts-wrapper * { outline: none !important; }
        .recharts-bar-rectangle { outline: none !important; }
        .recharts-active-bar { stroke: none !important; outline: none !important; }
        .recharts-bar-rectangle:focus rect,
        .recharts-bar-rectangle:active rect,
        rect.recharts-rectangle:focus,
        rect.recharts-rectangle:active { stroke: none !important; outline: none !important; filter: none !important; }
        .nps-chart-wrap .recharts-wrapper,
        .nps-chart-wrap .recharts-surface,
        .nps-chart-wrap .recharts-tooltip-cursor,
        .nps-chart-wrap .recharts-bar-rectangles,
        .nps-chart-wrap .recharts-bar-rectangle,
        .nps-chart-wrap rect { cursor: pointer !important; }
        .grid-top-3 { grid-template-columns: 1fr; }
        .grid-timeline { grid-template-columns: 1fr; }
        .grid-two-col { grid-template-columns: 1fr; }
        .grid-reviews { grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          .grid-top-3 { grid-template-columns: repeat(3, 1fr); }
          .grid-timeline { grid-template-columns: repeat(2, 1fr); }
          .grid-two-col { grid-template-columns: repeat(2, 1fr); }
          .grid-reviews { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 639px) {
          .ui-card:hover { transform: none; }
          .scroll-top-btn {
            right: 14px;
            bottom: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ui-card, button, a { transition: none !important; }
        }
      `}</style>
    </div>
  );
}



