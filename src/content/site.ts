/* ==================================================================
   ВЕСЬ ТЕКСТ САЙТА В ОДНОМ МЕСТЕ.
   Контент перенесён из «Черновик Сайта.pdf».
   Правь здесь — компоненты трогать не нужно.
================================================================== */

export const hero = {
    name: "Андреев Артём",
    role: "Графический дизайнер",
    handle: "parralax_art",
    tagline:
        "Я создаю визуальную среду, которую ежедневно видят тысячи людей",
    scrollHint: "Листайте вниз",
};

export const about = {
    eyebrow: "Обо мне",
    title: "Обо мне",
    paragraphs: [
        "Я графический дизайнер с фокусом на видимый конечный результат. Работаю на стыке креатива и технической точности: от идеи и визуальной концепции до подготовки макетов к производству и реализации в пространстве.",
        "Имею опыт работы в рекламно-производственных компаниях. Обладаю большими знаниями в сфере графического дизайна, полиграфии, архитектуры, производства и типографики.",
    ],
    approachTitle: "Мой подход",
    approach: [
        "Качество и точность исполнения на каждом этапе",
        "Креативные решения, основанные на задаче, а не на трендах",
        "Учёт требований клиента, производства и среды использования",
        "Работа в чётких рамках дедлайнов",
    ],
    /* Объекты второго экрана. Каждый вырезан и лежит на прозрачном фоне,
       поэтому собираются они не в картинке, а прямо в вёрстке — раскладка
       и порядок наложения заданы в About.tsx. Порядок здесь роли не играет. */
    mockups: [
        {
            id: "poster",
            src: "/about/poster.webp",
            alt: "Афиша фотостудии Lumen «Фотосессии в Якутске»",
            w: 1198,
            h: 1800,
        },
        {
            id: "certificate",
            src: "/about/certificate.webp",
            alt: "Именной сертификат курсов косметического отбеливания",
            w: 1476,
            h: 1800,
        },
        {
            id: "cards",
            src: "/about/cards.webp",
            alt: "Визитные карточки Travels By Soul — лицевая и оборотная стороны",
            w: 1800,
            h: 792,
        },
        {
            id: "laptop",
            src: "/about/laptop.webp",
            alt: "Ноутбук с сайтом агентства «Панорама» и телефон с профилем Lumen",
            w: 1800,
            h: 1200,
        },
    ],
};

/* Заголовки групп — в том же регистре, что и во всём остальном сайте:
   капитель делает CSS, в данных держим обычную запись. */
export const skills = {
    eyebrow: "Что я делаю",
    title: "Компетенции",
    lead: "От идеи и концепции — до готового объекта в городской среде.",
    groups: [
        {
            title: "Брендинг и визуальная идентичность",
            items: [
                "Логотипы и фирменные знаки",
                "Фирменный стиль",
                "Цветовые системы",
                "Гайдлайны и бренд-системы",
                "Носители бренда",
            ],
        },
        {
            title: "Наружная реклама и городская среда",
            items: [
                "Вывески и световые короба",
                "Фасадная реклама",
                "Навигация и оформление пространств",
                "Информационные конструкции",
                "Брендирование транспорта",
                "Стелы, стенды и городские объекты",
            ],
        },
        {
            title: "Полиграфия и производство",
            items: [
                "Каталоги, буклеты и меню",
                "Плакаты и рекламные материалы",
                "Упаковка",
                "Допечатная подготовка",
                "Техническая подготовка файлов",
                "Проекты под производство",
            ],
        },
        {
            title: "Цифровой дизайн и контент",
            items: [
                "Digital-реклама",
                "Социальные сети",
                "Презентации",
                "Web-дизайн",
                "UI и интерактивные интерфейсы",
                "Моушн и анимация",
                "Видеоконтент",
            ],
        },
        {
            title: "3D и визуализация",
            items: [
                "3D-моделирование",
                "Визуализация объектов",
                "Предметная визуализация",
                "Пространственные концепции",
                "Презентационные рендеры",
            ],
        },
        {
            title: "AI и генеративный дизайн",
            items: [
                "Генерация изображений",
                "Генерация видео",
                "AI-концептинг",
                "Рекламный контент",
                "Визуальные эксперименты",
                "AI-assisted production",
                "Доработка AI-материалов",
            ],
        },
    ],
    /* Все теги равнозначны. Раньше «Generative AI» подсвечивался, но
       заливка с рамкой читались как кнопка, и его пытались нажать. */
    stack: [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe InDesign",
        "CorelDRAW",
        "Figma",
        "Blender",
        "Framer Motion",
        "Next.js",
        "Generative AI",
        "AI Video",
        "Print Production",
    ],
};

export const journey = {
    eyebrow: "Мой путь",
    title: "Мой путь",
    lead: "До того как я нашёл себя в дизайне, я работал в таких компаниях",
    steps: [
        {
            date: "Январь 2020",
            company: "Дом научной коллаборации им. Н. Г. Соломонова, СВФУ",
            position: "Администратор",
            points: [
                "Работа с клиентами, запись и учёт проводимых занятий",
                "Работа с отчётностью, помощь в проведении занятий и мероприятий, ведение социальных сетей компании",
                "Создание полиграфии и документов: сертификаты, благодарственные письма, грамоты",
            ],
        },
        {
            date: "Август 2021",
            company: "Сахапечать",
            position: "Шеф-редактор, «Улуус медиа»",
            points: [
                "Ведение социальных сетей сетевого издания «Улуус медиа»",
                "Создание макетов",
                "Вёрстка текста",
                "Работа с медийными лицами",
            ],
        },
        {
            date: "Февраль 2022",
            company: "MyTona",
            position: "Специалист по исследованию рынка, Competitive Research",
            points: [
                "Исследование продуктов компаний-конкурентов",
                "Создание отчётностей",
            ],
        },
    ],
};

export type CaseShot = {
    src: string;
    /** натуральный размер картинки — нужен, чтобы не прыгала вёрстка */
    w: number;
    h: number;
};

export type CaseItem = {
    title: string;
    description?: string;
    /**
     * Работы кейса в полном размере. Первая служит обложкой в ленте,
     * остальные открываются просмотрщиком по клику.
     */
    shots: CaseShot[];
};

export type CaseYear = {
    year: string;
    caption: string;
    note?: string;
    items: CaseItem[];
};

export const cases = {
    eyebrow: "Кейсы",
    title: "Мой путь в дизайне",
    lead: "Мой путь в дизайн начинался постепенно — год за годом",
    years: [
        {
            year: "2018",
            caption: "Первые афиши",
            note: "Ещё до профессии — плакаты и превью для квизов и городских вечеринок.",
            items: [
                {
                    title: "Афиши мероприятий",
                    description:
                        "Star Wars Quiz, Video Game Quiz, «Назад в прошлое», #Valentine’s Dating — серия постеров для лофт-баров.",
                    shots: [
                        { src: "/cases/media/timeline/01.webp", w: 1751, h: 2200 },
                    ],
                },
            ],
        },
        {
            year: "2019",
            caption: "Студенческие работы",
            note: "Полиграфия и информационные материалы для Дома научной коллаборации.",
            items: [
                {
                    title: "Полиграфия ДНК СВФУ",
                    description:
                        "Сертификаты, дипломы и информационные стенды образовательных программ.",
                    shots: [
                        { src: "/cases/media/timeline/02.webp", w: 2141, h: 2200 },
                    ],
                },
            ],
        },
        {
            year: "2020",
            caption: "Цифровой арт",
            note: "Год, в котором я разбирался со светом, композицией и фотоманипуляцией.",
            items: [
                {
                    title: "Любительские арты",
                    description:
                        "Цифровая живопись и фотоманипуляции: северное сияние, ночные сцены, персонажи.",
                    shots: [
                        { src: "/cases/media/timeline/05.webp", w: 2200, h: 1243 },
                        { src: "/cases/media/timeline/04.webp", w: 2200, h: 2173 },
                        { src: "/cases/media/timeline/06.webp", w: 2200, h: 1236 },
                        { src: "/cases/media/timeline/03.webp", w: 1668, h: 2200 },
                    ],
                },
                {
                    title: "Превью для роликов",
                    description:
                        "Обложки для видео: сборка кадров, ретушь, световые эффекты.",
                    shots: [
                        { src: "/cases/media/timeline/08.webp", w: 1471, h: 2200 },
                        { src: "/cases/media/timeline/07.webp", w: 2200, h: 1641 },
                        { src: "/cases/media/timeline/09.webp", w: 1205, h: 2200 },
                    ],
                },
            ],
        },
        {
            year: "2021",
            caption: "Макеты для социальных сетей",
            items: [
                {
                    title: "Мастер-классы «Наука 0+»",
                    description:
                        "Серия анонсов мастер-классов ДНК СВФУ и карточки товаров для магазинов.",
                    shots: [
                        { src: "/cases/media/timeline/10.webp", w: 2165, h: 2200 },
                        { src: "/cases/media/timeline/11.webp", w: 2200, h: 1484 },
                    ],
                },
            ],
        },
        {
            year: "2022",
            caption: "Коммерческие креативы",
            items: [
                {
                    title: "RE:AUTO и товарные карточки",
                    description:
                        "Рекламные макеты для автозвука, электроники и автотоваров.",
                    shots: [
                        { src: "/cases/media/timeline/12.webp", w: 2200, h: 2196 },
                        { src: "/cases/media/timeline/13.webp", w: 2200, h: 2190 },
                        { src: "/cases/media/timeline/14.webp", w: 2200, h: 2177 },
                        { src: "/cases/media/timeline/15.webp", w: 2200, h: 1467 },
                    ],
                },
            ],
        },
        {
            year: "2023",
            caption: "Мой первый брендинг",
            note: "Фотостудия Lumen — от знака до носителей. Дальше — работа с рекламно-производственными компаниями.",
            items: [
                {
                    title: "Lumen — логотип",
                    description:
                        "Знак фотостудии: камера-чемодан и объектив-диафрагма в одной линии.",
                    shots: [
                        { src: "/cases/media/lumen/lumen-logo.webp", w: 1667, h: 2200 },
                    ],
                },
                {
                    title: "Lumen — айдентика",
                    description:
                        "Цветовая палитра, фирменные носители, афиши и мокапы.",
                    shots: [
                        { src: "/cases/media/lumen/04.webp", w: 2200, h: 1650 },
                        { src: "/cases/media/lumen/02.webp", w: 2200, h: 1899 },
                        { src: "/cases/media/lumen/01.webp", w: 1556, h: 2200 },
                    ],
                },
                {
                    title: "Lumen — соцсети",
                    description:
                        "Сетка публикаций, рекламные креативы, оформление профиля.",
                    shots: [
                        { src: "/cases/media/lumen/03.webp", w: 1237, h: 2200 },
                        { src: "/cases/media/lumen/05.webp", w: 1466, h: 2200 },
                        { src: "/cases/media/lumen/06.webp", w: 1651, h: 2200 },
                    ],
                },
                {
                    title: "Полиграфия и сертификаты",
                    description:
                        "Меню, подарочные сертификаты, благодарственные письма для клиентов РПК.",
                    shots: [
                        { src: "/cases/media/timeline/17.webp", w: 2200, h: 1559 },
                        { src: "/cases/media/timeline/16.webp", w: 2200, h: 1541 },
                        { src: "/cases/media/timeline/18.webp", w: 2200, h: 1554 },
                        { src: "/cases/media/timeline/19.webp", w: 2200, h: 1557 },
                        { src: "/cases/media/timeline/20.webp", w: 1557, h: 2200 },
                        { src: "/cases/media/timeline/21.webp", w: 1557, h: 2200 },
                        { src: "/cases/media/timeline/22.webp", w: 1556, h: 2200 },
                        { src: "/cases/media/timeline/23.webp", w: 2200, h: 534 },
                    ],
                },
                {
                    title: "Таблички и режимы работы",
                    description:
                        "«Земельный юрист», «Доктор-Офис», SUNNY, IZAKAYA, BODY SILK, ROLLS RICE.",
                    shots: [
                        { src: "/cases/media/timeline/26.webp", w: 1650, h: 2200 },
                        { src: "/cases/media/timeline/24.webp", w: 2200, h: 1652 },
                        { src: "/cases/media/timeline/25.webp", w: 2045, h: 2200 },
                        { src: "/cases/media/timeline/27.webp", w: 1764, h: 2200 },
                        { src: "/cases/media/timeline/28.webp", w: 2200, h: 2113 },
                        { src: "/cases/media/timeline/29.webp", w: 1760, h: 2200 },
                        { src: "/cases/media/timeline/30.webp", w: 1636, h: 2200 },
                    ],
                },
                {
                    title: "Наружная реклама",
                    description:
                        "Вывески, световые короба и объёмные буквы: «Полярный», «Ардагын», «Панорама».",
                    shots: [
                        { src: "/cases/media/timeline/40.webp", w: 2200, h: 1889 },
                        { src: "/cases/media/timeline/31.webp", w: 2200, h: 1256 },
                        { src: "/cases/media/timeline/32.webp", w: 2200, h: 1650 },
                        { src: "/cases/media/timeline/33.webp", w: 1590, h: 2200 },
                        { src: "/cases/media/timeline/34.webp", w: 2200, h: 2039 },
                        { src: "/cases/media/timeline/36.webp", w: 2200, h: 2039 },
                        { src: "/cases/media/timeline/37.webp", w: 2200, h: 1675 },
                        { src: "/cases/media/timeline/38.webp", w: 2200, h: 1652 },
                        { src: "/cases/media/timeline/41.webp", w: 836, h: 2200 },
                    ],
                },
                {
                    title: "Lobby Gaming Club",
                    description:
                        "Логотип и айдентика компьютерного клуба: прайсы, режим работы, оформление зала.",
                    shots: [
                        { src: "/cases/media/lobby/01.webp", w: 2200, h: 1585 },
                        { src: "/cases/media/lobby/logo-1.webp", w: 2118, h: 1829 },
                        { src: "/cases/media/lobby/logo-2.webp", w: 2200, h: 489 },
                        { src: "/cases/media/lobby/02.webp", w: 1556, h: 2200 },
                        { src: "/cases/media/lobby/03.webp", w: 1556, h: 2200 },
                        { src: "/cases/media/lobby/04.webp", w: 1651, h: 2200 },
                        { src: "/cases/media/lobby/05.webp", w: 2200, h: 944 },
                    ],
                },
                {
                    title: "«КИТ» — рыба и морепродукты",
                    description:
                        "Логотип магазина: текстовый блок и закруглённый дескриптор, между ними рыба над волнами.",
                    shots: [
                        { src: "/cases/media/kit/01.webp", w: 2200, h: 1467 },
                        { src: "/cases/media/kit/logo.webp", w: 2200, h: 2199 },
                        { src: "/cases/media/timeline/35.webp", w: 2200, h: 1289 },
                        { src: "/cases/media/timeline/39.webp", w: 2200, h: 1289 },
                    ],
                },
            ],
        },
        {
            year: "2024",
            caption: "Пространство и бренды",
            items: [
                {
                    title: "Фасадная иллюминация «Японский дом»",
                    description:
                        "Световое оформление фасада комплекса и входных групп арендаторов.",
                    shots: [
                        { src: "/cases/media/timeline/43.webp", w: 2200, h: 1275 },
                        { src: "/cases/media/timeline/42.webp", w: 2200, h: 939 },
                    ],
                },
                {
                    title: "Чайхана 14",
                    description:
                        "Айдентика кафе восточной кухни: знак-силуэт, вывеска, уголок потребителя.",
                    shots: [
                        { src: "/cases/media/teahouse-14/03.webp", w: 2200, h: 1467 },
                        { src: "/cases/media/teahouse-14/logo.webp", w: 2200, h: 1166 },
                        { src: "/cases/media/teahouse-14/01.webp", w: 1656, h: 2200 },
                        { src: "/cases/media/teahouse-14/02.webp", w: 1321, h: 2200 },
                        { src: "/cases/media/teahouse-14/04.webp", w: 2200, h: 1101 },
                    ],
                },
                {
                    title: "Lyubimoi",
                    description:
                        "Брендинг интернет-магазина одежды и аксессуаров: знак, палитра, упаковка, реклама.",
                    shots: [
                        { src: "/cases/media/lyubimoi/01.webp", w: 1485, h: 2200 },
                        { src: "/cases/media/lyubimoi/logo.webp", w: 2044, h: 1800 },
                        { src: "/cases/media/lyubimoi/02.webp", w: 2200, h: 1277 },
                        { src: "/cases/media/lyubimoi/03.webp", w: 2200, h: 1449 },
                        { src: "/cases/media/lyubimoi/04.webp", w: 2180, h: 2181 },
                    ],
                },
                {
                    title: "PRO NAIL",
                    description:
                        "Брендинг мастерской красивых и здоровых ногтей: палитра, баннер, полиграфия.",
                    shots: [
                        { src: "/cases/media/pro-nail/01.webp", w: 2200, h: 1451 },
                        { src: "/cases/media/pro-nail/logo.webp", w: 2200, h: 515 },
                        { src: "/cases/media/pro-nail/02.webp", w: 2200, h: 1569 },
                        { src: "/cases/media/pro-nail/03.webp", w: 2200, h: 1574 },
                    ],
                },
                {
                    title: "«Топаз» и PS ROOM",
                    description:
                        "Логотип парикмахерской и оформление вывесок.",
                    shots: [
                        { src: "/cases/media/topaz/02.webp", w: 2200, h: 1251 },
                        { src: "/cases/media/topaz/01.webp", w: 1987, h: 2200 },
                    ],
                },
            ],
        },
        {
            year: "2025",
            caption: "Дизайн-код «Кабинет Саха»",
            note: "Единый дизайн-код кабинетов родного языка и литературы городского округа «город Якутск».",
            items: [
                {
                    title: "Знак и печатные материалы",
                    description:
                        "Логотип, орнаментальная эмблема, литературная карта города Якутска, стенды и книги.",
                    shots: [
                        { src: "/cases/media/sakhakabinet/logo.webp", w: 2200, h: 1063 },
                        { src: "/cases/media/sakhakabinet/01.webp", w: 2004, h: 2008 },
                        { src: "/cases/media/sakhakabinet/03.webp", w: 2200, h: 1738 },
                        { src: "/cases/media/sakhakabinet/04.webp", w: 2200, h: 1642 },
                    ],
                },
                {
                    title: "Система оформления кабинета",
                    description:
                        "Интерьеры, цветовая система на основе природных материалов, шрифтовые пары и пиктограммы.",
                    shots: [
                        { src: "/cases/media/sakhakabinet/05.webp", w: 2200, h: 1498 },
                        { src: "/cases/media/sakhakabinet/02.webp", w: 2200, h: 1615 },
                        { src: "/cases/media/sakhakabinet/06.webp", w: 2200, h: 1454 },
                        { src: "/cases/media/sakhakabinet/07.webp", w: 2200, h: 739 },
                        { src: "/cases/media/sakhakabinet/08.webp", w: 2200, h: 461 },
                        { src: "/cases/media/sakhakabinet/09.webp", w: 2200, h: 453 },
                    ],
                },
            ],
        },
        {
            year: "2026",
            caption: "Новые бренды",
            items: [
                {
                    title: "«Игры Игрушки» и «Дари»",
                    description:
                        "Логотипы для магзинов",
                    shots: [
                        { src: "/cases/media/timeline/52.webp", w: 2200, h: 1286 },
                        { src: "/cases/media/timeline/53.webp", w: 2200, h: 1566 },
                    ],
                },
                {
                    title: "Проектные постеры",
                    description:
                        "Оформление школьных проектов: «Молодой боец», «День Байаная», «Кыыс Ньургун».",
                    shots: [
                        { src: "/cases/media/timeline/49.webp", w: 1098, h: 2200 },
                        { src: "/cases/media/timeline/50.webp", w: 1094, h: 2200 },
                        { src: "/cases/media/timeline/51.webp", w: 1101, h: 2200 },
                    ],
                },
                {
                    title: "Полиграфия и афиши",
                    description:
                        "«Киви деливери», «Рассада», спортивные наборы, якутский календарь месяцев.",
                    shots: [
                        { src: "/cases/media/timeline/45.webp", w: 1733, h: 2200 },
                        { src: "/cases/media/timeline/44.webp", w: 1028, h: 2200 },
                        { src: "/cases/media/timeline/46.webp", w: 2200, h: 843 },
                        { src: "/cases/media/timeline/47.webp", w: 2191, h: 2200 },
                        { src: "/cases/media/timeline/48.webp", w: 2198, h: 2200 },
                    ],
                },
            ],
        },
    ] satisfies CaseYear[],
};

export const results = {
    title: "Мои результаты",
    items: [
        { prefix: "Более", value: "1000", label: "довольных клиентов" },
        { prefix: "Более", value: "100", label: "проектов реализованы в городе" },
        { prefix: "Сопровождено более", value: "50", label: "мероприятий" },
        { prefix: "Создан уникальный дизайн для", value: "12", label: "брендов" },
    ],
};

export const process = {
    eyebrow: "Как я работаю",
    title: "План работы",
    /** закрывающая строка под дорожной картой */
    promise: "Полное сопровождение от задумки до реализации",
    steps: [
        {
            title: "Первичный контакт",
            text: "Обсуждаем задачу, формат проекта, сроки и ожидания. Определяем, подхожу ли я под задачу и как могу быть максимально полезен.",
        },
        {
            title: "Брифинг и анализ",
            text: "Уточняю цели проекта, аудиторию, технические требования и ограничения производства. Анализирую контекст и задачи клиента.",
        },
        {
            title: "Формирование концепции",
            text: "Предлагаю визуальное направление и идеи, основанные на задаче и брифе. Согласовываем общее направление проекта.",
        },
        {
            title: "Дизайн и проработка деталей",
            text: "Разрабатываю дизайн, уделяя внимание композиции, читаемости, деталям и будущей реализации.",
        },
        {
            title: "Согласование и правки",
            text: "Вношу правки в рамках согласованного объёма, доводя проект до финального утверждения.",
        },
        {
            title: "Подготовка к производству",
            text: "Адаптирую макеты под технические требования печати, монтажа или цифрового использования.",
        },
        {
            title: "Сдача проекта",
            text: "Передаю готовые файлы в нужных форматах и сопровождаю проект при необходимости.",
        },
    ],
};

/* Ссылка на прайс. Ведёт на отдельную страницу /prices, содержимое
   которой лежит в content/prices.ts. */
export const pricesLink = {
    label: "Узнать цены",
    href: "/prices",
};

/* ------------------------------------------------------------------
   КОНТАКТЫ.
   href уже проставлены — правь их здесь, если что-то поменяется.
------------------------------------------------------------------ */
export const contacts = {
    eyebrow: "Контакты",
    title: "Свяжитесь со мной",
    lead: "Расскажите о задаче — отвечу и предложу решение.",
    items: [
        {
            id: "phone",
            label: "Телефон",
            value: "+7 (996) 914-75-16",
            href: "tel:+79969147516",
            icon: "phone" as const,
        },
        {
            id: "email",
            label: "Почта",
            value: "knox711@mail.ru",
            href: "mailto:knox711@mail.ru",
            icon: "mail" as const,
        },
        {
            id: "behance",
            label: "Behance",
            value: "@artemandreev17",
            href: "https://www.behance.net/artemandreev17",
            icon: "behance" as const,
        },
    ],
    /* Эти иконки видны на всех секциях — панель QuickContacts.
       Порядок = порядок на панели. */
    quick: [
        {
            id: "prices",
            label: "Узнать цены",
            href: "/prices",
            icon: "price" as const,
        },
        {
            id: "phone",
            label: "Позвонить",
            href: "tel:+79969147516",
            icon: "phone" as const,
        },
        {
            id: "telegram",
            label: "Telegram",
            href: "https://t.me/nomorepills7",
            icon: "telegram" as const,
        },
        {
            id: "whatsapp",
            label: "WhatsApp",
            href: "https://wa.me/79969147516",
            icon: "whatsapp" as const,
        },
        {
            id: "behance",
            label: "Behance",
            href: "https://www.behance.net/artemandreev17",
            icon: "behance" as const,
        },
        {
            id: "mail",
            label: "Почта",
            href: "mailto:knox711@mail.ru",
            icon: "mail" as const,
        },
    ],
    socials: [
        {
            id: "behance",
            label: "Behance",
            href: "https://www.behance.net/artemandreev17",
            icon: "behance" as const,
        },
        {
            id: "mail",
            label: "Почта",
            href: "mailto:knox711@mail.ru",
            icon: "mail" as const,
        },
        {
            id: "whatsapp",
            label: "WhatsApp",
            // TODO: проверь номер, если WhatsApp привязан к другому
            href: "https://wa.me/79969147516",
            icon: "whatsapp" as const,
        },
        {
            id: "telegram",
            label: "Telegram",
            href: "https://t.me/nomorepills7",
            icon: "telegram" as const,
        },
    ],
};

export const footer = {
    note: `© ${new Date().getFullYear()} Андреев Артём · parralax_art`,
};
