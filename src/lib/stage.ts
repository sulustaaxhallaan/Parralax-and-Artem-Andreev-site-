/* ==================================================================
   ТАЙМЛАЙН СКРОЛЛА.

   Весь сайт — один экран с общим фоном. Секции проявляются и гаснут
   по мере прокрутки, перекрывая друг друга.

   Единица измерения — «экран» (1 = высота окна, 100vh).

   fadeIn  — сколько прокрутки уходит на проявление;
   hold    — сколько секция висит полностью видимой (запас для чтения);
   fadeOut — столько же, сколько fadeIn, и он же служит проявлением
             следующей секции (кросс-фейд без разрывов).

   Хочешь, чтобы секция «стояла» дольше — увеличь её hold.
================================================================== */

export const FADE = 0.6;

export type SectionId =
    | "hero"
    | "about"
    | "skills"
    | "journey"
    | "cases"
    | "results"
    | "process"
    | "contacts";

export type SectionSpec = {
    id: SectionId;
    /** подпись в боковой навигации */
    label: string;
    /** запас прокрутки, пока секция видна целиком (в экранах) */
    hold: number;
};

/* Запас подобран так, чтобы секцию успевали прочитать, но прокрутка
   не казалась залипшей: примерно один экран на секцию. Дольше держатся
   только те, где реально много содержимого. */
export const SECTIONS: SectionSpec[] = [
    { id: "hero", label: "Начало", hold: 0.7 },
    { id: "about", label: "Обо мне", hold: 1 },
    { id: "skills", label: "Компетенции", hold: 1.1 },
    { id: "journey", label: "Мой путь", hold: 1.1 },
    // Лента кейсов крутится сама по себе (колесо над ней, перетаскивание,
    // свайп), поэтому вертикальной прокрутки ей нужно не больше обычного
    { id: "cases", label: "Кейсы", hold: 1.5 },
    { id: "results", label: "Результаты", hold: 0.9 },
    // Стоит перед контактами: человек уже видел работы и результат,
    // дальше логично показать, как пойдёт работа, — и сразу форма
    { id: "process", label: "План работы", hold: 1.2 },
    { id: "contacts", label: "Контакты", hold: 1.6 },
];

export type SectionWindow = SectionSpec & {
    index: number;
    /** начало проявления, в экранах */
    start: number;
    /** секция полностью видна начиная отсюда */
    holdStart: number;
    /** секция начинает гаснуть отсюда */
    holdEnd: number;
    /** секция полностью скрыта */
    end: number;
    isFirst: boolean;
    isLast: boolean;
};

function build(): { windows: SectionWindow[]; total: number } {
    const windows: SectionWindow[] = [];
    // Первая секция видна сразу на нулевом скролле
    let start = -FADE;

    SECTIONS.forEach((spec, index) => {
        const holdStart = start + FADE;
        const holdEnd = holdStart + spec.hold;
        windows.push({
            ...spec,
            index,
            start,
            holdStart,
            holdEnd,
            end: holdEnd + FADE,
            isFirst: index === 0,
            isLast: index === SECTIONS.length - 1,
        });
        // Следующая начинает проявляться ровно тогда, когда текущая гаснет
        start = holdEnd;
    });

    const last = windows[windows.length - 1];
    return { windows, total: last.holdEnd };
}

const built = build();

export const SECTION_WINDOWS = built.windows;

/** Полная длина прокрутки в экранах (без учёта самого вьюпорта) */
export const TOTAL_SCROLL = built.total;

/** Индекс секции, которая сейчас доминирует на экране */
export function activeIndexAt(scrollVh: number): number {
    for (let i = SECTION_WINDOWS.length - 1; i >= 0; i--) {
        if (scrollVh >= SECTION_WINDOWS[i].holdStart - FADE / 2) return i;
    }
    return 0;
}

/** Позиция прокрутки (в экранах), на которой секция видна целиком */
export function scrollTargetFor(index: number): number {
    const w = SECTION_WINDOWS[index];
    return Math.max(0, w.holdStart);
}
