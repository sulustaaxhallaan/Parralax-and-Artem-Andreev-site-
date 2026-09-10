"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Совпадает ли медиазапрос прямо сейчас.
 *
 * До гидратации всегда false: ширины окна на сервере нет, а узкий
 * макет здесь база — с него начинают все, и только на широком окне
 * после монтирования добавляется то, что телефону не нужно.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        [query],
    );

    const getSnapshot = useCallback(
        () => window.matchMedia(query).matches,
        [query],
    );

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
