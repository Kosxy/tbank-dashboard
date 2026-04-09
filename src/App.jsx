import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from "recharts";
import {
  TrendingUp, TrendingDown, MessageSquare, CheckCircle2, AlertCircle, ChevronRight,
  ArrowLeft, ExternalLink, Lightbulb
} from "lucide-react";

const revenueData = [
  { name: "01", income: 4000, expense: 2400 },
  { name: "02", income: 3000, expense: 1398 },
  { name: "03", income: 2000, expense: 9800 },
  { name: "04", income: 2780, expense: 3908 },
  { name: "05", income: 1890, expense: 4800 },
  { name: "06", income: 2390, expense: 3800 },
  { name: "07", income: 3490, expense: 4300 },
];

const dynamics2024_2026 = [
  { name: "Q1 24", positive: 45, neutral: 30, negative: 25 },
  { name: "Q2 24", positive: 42, neutral: 35, negative: 23 },
  { name: "Q3 24", positive: 38, neutral: 32, negative: 30 },
  { name: "Q4 24", positive: 44, neutral: 30, negative: 26 },
  { name: "Q1 25", positive: 50, neutral: 28, negative: 22 },
  { name: "Q2 25", positive: 58, neutral: 24, negative: 18 },
  { name: "Q3 25", positive: 65, neutral: 20, negative: 15 },
  { name: "Q4 25", positive: 70, neutral: 17, negative: 13 },
  { name: "Q1 26", positive: 76, neutral: 14, negative: 10 },
  { name: "Q2 26", positive: 80, neutral: 12, negative: 8 },
];

const radarData = [
  { subject: "Скорость", tbank: 9.5, tochka: 9.0, sber: 7.0, alfa: 8.5, fullMark: 10 },
  { subject: "Удобство UI", tbank: 9.2, tochka: 9.5, sber: 7.8, alfa: 9.0, fullMark: 10 },
  { subject: "Ставки", tbank: 6.8, tochka: 7.0, sber: 8.5, alfa: 7.8, fullMark: 10 },
  { subject: "Лимиты", tbank: 8.5, tochka: 7.5, sber: 9.5, alfa: 8.8, fullMark: 10 },
  { subject: "Без залога", tbank: 9.5, tochka: 6.0, sber: 5.5, alfa: 7.0, fullMark: 10 },
];

const timelineEvents = [
  { date: "Q4 2024", title: "Пик ключевой ставки 21%", desc: "Максимальная КС за всю историю. Резкий рост стоимости кредитов МСБ, падение спроса.", type: "negative" },
  { date: "Q2 2025", title: "Начало цикла снижения КС", desc: "ЦБ начал снижение с 21% до 20%. Возобновление спроса на кредитование бизнеса.", type: "positive" },
  { date: "Q4 2025", title: "Рост выдач МСБ-кредитов +35%", desc: "На фоне снижения КС Т-Банк нарастил выдачу кредитов бизнесу на 35% кв/кв. Средний чек заявки вырос до 4.2 млн ₽.", type: "positive" },
  { date: "Q1 2026", title: "КС снижена до 15%", desc: "Два снижения подряд: до 15.5% в феврале и 15% в марте. Кредиты МСБ дешевеют.", type: "positive" },
];

const sourcesData = [
  { id: 1, name: "Markswebb Business Internet Banking Rank 2025", type: "Рейтинг UX интернет-банков", link: "https://www.markswebb.ru/report/business-internet-banking-rank-2025/", date: "Дек 2025" },
  { id: 2, name: "Markswebb Mobile Banking Rank 2025", type: "Рейтинг мобильных банков", link: "https://www.markswebb.ru/report/mobile-banking-rank-2025/", date: "Янв 2026" },
  { id: 3, name: "ЦБ РФ: Решения по ключевой ставке", type: "Денежно-кредитная политика", link: "https://www.cbr.ru/press/keypr/", date: "Мар 2026" },
  { id: 4, name: "Sravni.ru: Отзывы о Т-Банк бизнес-кредитование", type: "Агрегированные отзывы", link: "https://www.sravni.ru/bank/t-bank/biznes/otzyvy/", date: "2024–2026" },
  { id: 5, name: "Banki.ru: Народный рейтинг Т-Банк", type: "Отзывы клиентов", link: "https://www.banki.ru/services/responses/bank/tcs/product/businesscredits/", date: "2024–2026" },
  { id: 6, name: "SberCIB: Прогноз ключевой ставки на 2026", type: "Аналитический прогноз", link: "https://sbercib.ru/publication/prognoz-klyuchevoi-stavki-na-2026-god", date: "Мар 2026" },
];

const reviews = [
  { id: 1, author: "ИП (кофейня)", text: "Кредит на кофемашину одобрили за пару часов. Данные по оборотам подтянули сами, хотя эквайринг в другом банке.", rating: 5, date: "28 Мар 2026" },
  { id: 2, author: 'ООО "Текстиль"', text: "Взял оборотный кредит на закупку хлопка. Даже с учетом процентов вышло дешевле — поставщик дал скидку за опт.", rating: 4, date: "13 Мар 2026" },
  { id: 3, author: "ИП (автосервис)", text: "Брал кредит на подъёмник и диагностическое оборудование. Одобрили 1.8 млн за 10 минут, деньги пришли в тот же день.", rating: 5, date: "28 Мар 2026" },
  { id: 4, author: "ИП (доставка еды)", text: "Оборотный кредит на расширение зоны доставки. Подали заявку в приложении, деньги на счету через час. Ставка ощутимая, но скорость решает.", rating: 4, date: "20 Мар 2026" },
  { id: 5, author: 'ООО "Стройматериалы"', text: "Кредит на пополнение склада перед сезоном. Одобрили 5 млн без залога. Из минусов — ставка указана в месяц, сначала не поняли итоговую переплату.", rating: 4, date: "15 Мар 2026" },
  { id: 6, author: "ИП (новый бизнес)", text: "Единственный банк, одобривший кредит бизнесу младше 6 месяцев без залога. Ставка в месяц — внимательно читайте.", rating: 4, date: "10 Мар 2026" },
  { id: 7, author: "ИП Сидорова", text: "Овердрафт урезали в несколько раз без предупреждения при пересмотре лимита. Неприятный сюрприз.", rating: 2, date: "05 Мар 2026" },
  { id: 8, author: 'ООО "Логист Плюс"', text: "Оборотный кредит до 10 млн оформили прямо в приложении. Решение дали за 15-20 минут.", rating: 5, date: "01 Мар 2026" },
  { id: 9, author: "ИП (цветочный магазин)", text: "Кредит на закупку к 8 Марта одобрили за 5 минут. Выручка окупила проценты за первую неделю. Рекомендую для сезонных закупок.", rating: 5, date: "25 Фев 2026" },
];

const Card = ({ children, className = "" }) => (
  <div className={`border rounded-3xl p-6 shadow-2xl ${className}`} style={{ backgroundColor: "#1C1C1E", borderColor: "#374151" }}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, action, onActionClick }) => (
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>{subtitle}</p>}
    </div>
    {action && (
      <button
        onClick={onActionClick}
        className="text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1"
        style={{ backgroundColor: "#2C2C2E", color: "#D1D5DB" }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FFDD2D"; e.currentTarget.style.color = "#000"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#2C2C2E"; e.currentTarget.style.color = "#D1D5DB"; }}
      >
        {action}
      </button>
    )}
  </div>
);

const StarIcon = ({ filled }) => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ fill: filled ? "#FFDD2D" : "none", color: filled ? "#FFDD2D" : "#374151" }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const tooltipStyle = { backgroundColor: "#1C1C1E", borderColor: "#333", borderRadius: "8px", color: "#fff" };

export default function App() {
  const [activeView, setActiveView] = useState("main");

  const renderSourcesView = () => (
    <div className="space-y-6">
      <button
        onClick={() => setActiveView("main")}
        className="flex items-center gap-2 text-sm mb-4"
        style={{ color: "#9CA3AF" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#FFDD2D"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
      >
        <ArrowLeft className="w-4 h-4" /> Назад к сводке
      </button>

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
                    <a href={src.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-end gap-1"
                      style={{ color: "#FFDD2D" }}>
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
    <div className="min-h-screen p-4 md:p-8 overflow-x-hidden" style={{ backgroundColor: "#000000", color: "#E5E7EB", fontFamily: "sans-serif" }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
            <rect width="40" height="40" rx="10" fill="#FFDD2D" />
            <path d="M13 14H27V18H22V27H18V18H13V14Z" fill="#000000" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Аналитика репутации кредитов для бизнеса Т-Банка
          </h1>
          <p className="mt-3 mb-5 max-w-2xl" style={{ color: "#9CA3AF" }}>Комплексный анализ репутации, сравнение с рынком и историческая динамика</p>
          <div className="px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2.5"
            style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151", color: "#D1D5DB" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22C55E", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22C55E" }}></span>
            </span>
            Апрель 2026
          </div>
        </div>

        {activeView === "sources" ? renderSourcesView() : (
          <>
            {/* SECTION 1: Top Metrics */}
            <div className="grid gap-6 grid-top-3">
              {/* NPS Card */}
              <Card className="col-span-1">
                <CardHeader title="Индекс Лояльности (NPS)" subtitle="По данным на Q1-Q2 2026" action="Источники" onActionClick={() => setActiveView("sources")} />
                <div className="mt-2">
                  <div className="text-4xl font-bold text-white">71.2%</div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="flex items-center px-2 py-0.5 rounded" style={{ color: "#22C55E", backgroundColor: "rgba(34,197,94,0.1)" }}>
                      <TrendingUp className="w-4 h-4 mr-1" />+14.8%
                    </span>
                    <span style={{ color: "#6B7280" }}>с прошлого года</span>
                  </div>
                </div>
                <div className="mt-6 w-full" style={{ height: "160px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Tooltip cursor={{ fill: "#2C2C2E" }} contentStyle={tooltipStyle} />
                      <Bar dataKey="income" fill="#FFDD2D" radius={[4, 4, 4, 4]} barSize={8} />
                      <Bar dataKey="expense" fill="#333333" radius={[4, 4, 4, 4]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4 text-xs" style={{ color: "#9CA3AF" }}>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FFDD2D" }}></div> Позитив</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#333333" }}></div> Негатив</div>
                </div>
              </Card>

              {/* Key Factors Bubbles */}
              <Card className="col-span-1 relative">
                <CardHeader title="Ключевые факторы" subtitle="О чем пишут клиенты" action="Источники" onActionClick={() => setActiveView("sources")} />
                <div className="relative w-full flex items-center justify-center mt-4" style={{ height: "256px" }}>
                  <div className="absolute flex flex-col items-center justify-center z-10"
                    style={{ top: "16px", left: "50%", transform: "translateX(-50%)", width: "128px", height: "128px", borderRadius: "50%", backgroundColor: "rgba(255,221,45,0.2)", border: "1px solid rgba(255,221,45,0.3)" }}>
                    <span className="text-2xl font-bold" style={{ color: "#FFDD2D" }}>38%</span>
                    <span className="text-xs mt-1 text-center leading-tight" style={{ color: "#FFDD2D" }}>Скорость<br />одобрения</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ top: "48px", right: "16px", width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}>
                    <span className="text-xl font-bold" style={{ color: "#A855F7" }}>25%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#A855F7" }}>Всё онлайн</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ bottom: "32px", right: "48px", width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <span className="text-lg font-bold" style={{ color: "#22C55E" }}>20%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#22C55E" }}>Без залога</span>
                  </div>
                  <div className="absolute flex flex-col items-center justify-center"
                    style={{ bottom: "48px", left: "32px", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <span className="text-base font-bold" style={{ color: "#EF4444" }}>17%</span>
                    <span className="mt-1" style={{ fontSize: "10px", color: "#EF4444" }}>Ставки</span>
                  </div>
                </div>
              </Card>

              {/* Approval Rate Gauge */}
              <Card className="col-span-1 flex flex-col justify-between">
                <CardHeader title="Одобряемость" subtitle="По отзывам МСБ-клиентов (Banki.ru, Sravni.ru)" action="Источники" onActionClick={() => setActiveView("sources")} />
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

            {/* SECTION 2: NPS Trend & Timeline */}
            <div className="space-y-4 pt-4">
              <Card style={{ height: "380px" }}>
                <CardHeader title="Детальный тренд NPS (Q1 2024 — Q2 2026)" subtitle="Динамика позитивных отзывов на фоне цикла снижения ключевой ставки" action="Источники" onActionClick={() => setActiveView("sources")} />
                <div className="w-full mt-4" style={{ height: "260px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynamics2024_2026} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFDD2D" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FFDD2D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="positive" stroke="#FFDD2D" strokeWidth={3} fillOpacity={1} fill="url(#colorPos)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid gap-4 grid-timeline">
                {timelineEvents.map((ev, idx) => (
                  <Card key={idx} className="p-5 flex flex-col justify-between" style={{ borderRadius: "16px", borderColor: "rgba(55,65,81,0.6)", backgroundColor: "rgba(28,28,30,0.8)", backdropFilter: "blur(8px)" }}>
                    <div>
                      <div className="text-xs font-bold mb-2" style={{ color: "#6B7280" }}>{ev.date}</div>
                      <h4 className="text-base font-semibold mb-2" style={{ color: ev.type === "positive" ? "#22C55E" : "#EF4444" }}>
                        {ev.title}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{ev.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* SECTION 3: Radar & Pros/Cons */}
            <div className="grid gap-6 pt-4 grid-two-col">
              <Card className="col-span-1 flex flex-col">
                <CardHeader title="Радар конкурентоспособности" subtitle="Т-Банк vs Сбербанк vs Точка vs Альфа (Markswebb 2025)" action="Источники" onActionClick={() => setActiveView("sources")} />
                <div className="flex-1 w-full" style={{ minHeight: "300px", marginLeft: "-16px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="Т-Банк" dataKey="tbank" stroke="#FFDD2D" fill="#FFDD2D" fillOpacity={0.4} />
                      <Radar name="Сбер" dataKey="sber" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} />
                      <Radar name="Точка" dataKey="tochka" stroke="#A855F7" fill="#A855F7" fillOpacity={0.15} />
                      <Radar name="Альфа" dataKey="alfa" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-3 mt-2" style={{ fontSize: "10px", color: "#9CA3AF" }}>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FFDD2D" }}></div> Т-Банк</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }}></div> Сбер</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#A855F7" }}></div> Точка</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444" }}></div> Альфа</div>
                </div>
              </Card>

              <Card className="col-span-1">
                <CardHeader title="Преимущества и зоны роста" subtitle="По данным Markswebb, Banki.ru, Sravni.ru" action="Источники" onActionClick={() => setActiveView("sources")} />
                <div className="space-y-5 mt-6">
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-3 text-sm" style={{ color: "#FFDD2D" }}><TrendingUp className="w-4 h-4" /> Сильные стороны</h4>
                    <ul className="space-y-2">
                      {[
                        "Кредит до 30 млн ₽ с решением от 2 минут — самая быстрая выдача на рынке МСБ.",
                        "Полностью онлайн-процесс: от заявки до зачисления средств без визита в офис.",
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
                      {[
                        "Ставка указана в месяц — клиенты путают с годовой (от 1% до 4.99%/мес).",
                        "Лимит овердрафта пересматривается ежемесячно, возможно резкое урезание.",
                        "Максимальный срок кредита 36 мес — короче, чем у Сбера (60 мес) и Альфы (48 мес).",
                        "Непрозрачность отказов: часть клиентов получают отказ без объяснения причин."
                      ].map((text, i) => (
                        <li key={i} className="flex gap-2 text-xs p-2.5 rounded-xl" style={{ color: "#D1D5DB", backgroundColor: "rgba(44,44,46,0.4)", border: "1px solid #374151" }}>
                          <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} /> {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-3 items-start mt-2 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,221,45,0.1)", border: "1px solid rgba(255,221,45,0.2)" }}>
                    <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#FFDD2D" }} />
                    <div>
                      <h5 className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "#FFDD2D" }}>Ключевой инсайт</h5>
                      <p className="text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>
                        Сегмент МСБ готов переплачивать 1–1.5% к ставке в обмен на полное отсутствие бумажной волокиты и зачисление средств день в день. На фоне снижения КС с 21% до 15% конкуренция за МСБ-заёмщиков обострится — ключевое преимущество Т-Банка (скорость) станет ещё важнее.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* SECTION 4: Reviews */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4 pl-2">
                <h3 className="text-lg font-semibold text-white">Последние отзывы</h3>
                <a href="https://www.banki.ru/services/responses/bank/tcs/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium cursor-pointer"
                  style={{ color: "#9CA3AF" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#FFDD2D"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; }}
                >
                  Все отзывы <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid gap-4 grid-reviews">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-4 p-4"
                    style={{ backgroundColor: "#1C1C1E", border: "1px solid #374151", borderRadius: "16px" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#4B5563"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; }}
                  >
                    <div className="p-2 rounded-xl"
                      style={{ backgroundColor: review.rating >= 4 ? "rgba(255,221,45,0.1)" : "#1F2937", color: review.rating >= 4 ? "#FFDD2D" : "#9CA3AF" }}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-white">{review.author}</span>
                        <span style={{ fontSize: "10px", color: "#6B7280" }}>{review.date}</span>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#9CA3AF" }}>{review.text}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < review.rating} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] uppercase tracking-wider font-semibold pt-16 pb-8 select-none" style={{ color: "#333333" }}>
              Источник: Markswebb BIBR/MBR 2025, ЦБ РФ, SberCIB, Sravni.ru, Banki.ru (2024–2026)
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
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
      `}</style>
    </div>
  );
}
