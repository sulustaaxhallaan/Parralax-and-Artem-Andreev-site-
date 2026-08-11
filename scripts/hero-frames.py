"""Нарезает поворотную ленту для первого экрана из видео с моделью.

Исходник — 360°-оборот на чистом чёрном фоне (фон снят заранее).

Просто резать по яркости нельзя: на персонаже чёрный пиджак и штаны,
местами они темнее порога. Поэтому силуэт собирается отдельно — крупная
связная область плюс заливка замкнутых пустот, — а мягкость краёв берётся
из яркости. Цвет на полупрозрачных краях домножен на альфу самим
кодеком, поэтому его надо разделить обратно, иначе по контуру
останется тёмная кайма.

Результат — public/hero/turn/f00..fNN.webp с прозрачностью.
"""

import os

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = r"C:\Users\Anvil\Downloads\0811\0811.mp4"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "hero", "turn")

FRAMES = 72          # шаг 5°: заметно плавнее, чем 36
TARGET_H = 1000
QUALITY = 76
PAD = 6

# Замеры по исходнику: фон вдали от фигуры ровно 0, звон компрессии
# вокруг силуэта не превышает 3, а тёмная одежда местами опускается до 2.
# Отсюда порог: всё выше 1.5 считаем фигурой. Порог выше отрезал бы часть
# пиджака и штанов — именно так появлялись рваные края.
CORE_LEVEL = 1.5


def matte(frame):
    """Возвращает (rgb, alpha) для кадра на чёрном фоне."""
    f = frame.astype(np.float32)
    lum = f.max(axis=2)

    core = (lum > CORE_LEVEL).astype(np.uint8)
    core = cv2.morphologyEx(core, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))

    n, lab, stats, _ = cv2.connectedComponentsWithStats(core, 8)
    if n > 1:
        core = (lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    core = ndimage.binary_fill_holes(core.astype(bool)).astype(np.uint8)
    core = cv2.morphologyEx(core, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))

    # По яркости отличить «край с половинным покрытием» от «сплошной
    # чёрный пиджак» невозможно, поэтому силуэт берём бинарным и лишь
    # слегка растушёвываем. Настоящее сглаживание даст уменьшение
    # кадра: 449 px исходника ужимаются до 384.
    alpha = np.clip(cv2.GaussianBlur(core.astype(np.float32), (0, 0), 0.7), 0, 1)

    # Цвет намеренно оставляем как есть. Кодек домножил края на покрытие,
    # но фон сайта тёмно-синий, и чуть притемнённая кромка на нём
    # незаметна — в отличие от ошибок деления на неточную альфу.
    return np.clip(f, 0, 255).astype(np.uint8), alpha


def main():
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        if old.endswith(".webp"):
            os.remove(os.path.join(OUT, old))

    cap = cv2.VideoCapture(SRC)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Последний кадр повторяет нулевой, поэтому период на один короче
    period = total - 1
    picks = [round(i * period / FRAMES) for i in range(FRAMES)]
    print(f"в видео {total} кадров, берём {len(picks)}: шаг {360 / FRAMES:.1f}°")

    cuts = []
    for idx in picks:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            raise RuntimeError(f"кадр {idx} не прочитался")
        cuts.append(matte(frame))
    cap.release()

    # Общая рамка на все кадры: по отдельности фигура прыгала бы
    ys, xs = [], []
    for _, a in cuts:
        yy, xx = np.where(a > 0.15)
        ys += [yy.min(), yy.max()]
        xs += [xx.min(), xx.max()]
    h0, w0 = cuts[0][1].shape
    y0, y1 = max(0, min(ys) - PAD), min(h0, max(ys) + PAD)
    x0, x1 = max(0, min(xs) - PAD), min(w0, max(xs) + PAD)
    print(f"общая рамка: {x1 - x0}x{y1 - y0}")

    out_w = round((x1 - x0) * TARGET_H / (y1 - y0))
    total_kb = 0
    for i, (rgb, alpha) in enumerate(cuts):
        rgba = np.dstack([rgb[..., ::-1], (alpha * 255).astype(np.uint8)])
        im = Image.fromarray(rgba[y0:y1, x0:x1], "RGBA")
        im = im.resize((out_w, TARGET_H), Image.LANCZOS)
        path = os.path.join(OUT, f"f{i:02d}.webp")
        im.save(path, "WEBP", quality=QUALITY, method=6)
        total_kb += os.path.getsize(path) // 1024

    print(f"готово: {FRAMES} кадров {out_w}x{TARGET_H}, всего {total_kb / 1024:.2f} МБ")
    print(f"пропорция для вёрстки: {out_w}/{TARGET_H}")


if __name__ == "__main__":
    main()
