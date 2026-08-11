"""Нарезает поворотную ленту для первого экрана из видео с моделью.

Исходник — 360°-оборот на сером градиентном фоне, камера неподвижна.
Фон описывается полиномом по краям кадра и вычитается: нейросеть для
матирования тут не нужна и только добавила бы непредсказуемости.

Результат — public/hero/turn/f00..f35.webp с прозрачностью.
"""

import io
import os

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = r"C:\Users\Anvil\Downloads\grok-video-a1986c4e-6054-4a34-8530-74700b2ce4df.mp4"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "hero", "turn")

FRAMES = 36          # шаг 10° — для перетаскивания этого достаточно
TARGET_H = 1000      # высота готового кадра
QUALITY = 78
PAD = 8              # запас вокруг общей рамки, px
BORDER = 0.07        # доля кадра по краям, заведомо фон


def fit_background(img):
    """Полином 2-й степени по (x, y) на каждый канал, обученный на краях."""
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xn, yn = xx / w, yy / h

    edge = np.zeros((h, w), bool)
    bw, bh = int(w * BORDER), int(h * BORDER)
    edge[:bh, :] = edge[-bh:, :] = True
    edge[:, :bw] = edge[:, -bw:] = True

    basis = np.stack([np.ones_like(xn), xn, yn, xn * xn, yn * yn, xn * yn], -1)
    A = basis[edge]
    out = np.zeros_like(img, np.float32)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, img[..., c][edge].astype(np.float32), rcond=None)
        out[..., c] = basis @ coef
    return out


def cut(img):
    """Возвращает (rgb, alpha) с уже вычищенным от фона цветом."""
    f = img.astype(np.float32)
    bg = fit_background(img)

    diff = np.abs(f - bg).mean(axis=2)
    lo, hi = 10.0, 26.0
    alpha = np.clip((diff - lo) / (hi - lo), 0, 1)

    # Тень только затемняет фон, не меняя оттенка: все каналы падают
    # примерно в одинаковое число раз. Пиксели фигуры так себя не ведут.
    ratio = (f + 1.0) / (bg + 1.0)
    darker = ratio.mean(axis=2)
    neutral = ratio.max(axis=2) - ratio.min(axis=2)
    alpha[(darker > 0.45) & (darker < 0.97) & (neutral < 0.12)] = 0

    core = (alpha > 0.6).astype(np.uint8)
    core = cv2.morphologyEx(core, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    core = cv2.morphologyEx(core, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))

    n, lab, stats, _ = cv2.connectedComponentsWithStats(core, 8)
    if n > 1:
        core = (lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])).astype(np.uint8)

    # Затягиваем только замкнутые поры. Крупное «закрытие» здесь нельзя:
    # оно заливает просвет между ног.
    core = ndimage.binary_fill_holes(core.astype(bool)).astype(np.uint8)

    near = cv2.dilate(core, np.ones((9, 9), np.uint8))
    alpha = np.where(near > 0, alpha, 0)
    alpha = np.maximum(alpha, core.astype(np.float32))
    alpha = np.clip(cv2.GaussianBlur(alpha, (0, 0), 1.0), 0, 1)

    # Деконтаминация: в полупрозрачных пикселях подмешан серый фон.
    # Зная альфу и фон, восстанавливаем исходный цвет — иначе по контуру
    # остаётся светлый ободок, заметный на тёмном фоне сайта.
    a3 = alpha[..., None]
    mix = np.where(a3 > 0.15, (f - (1 - a3) * bg) / np.maximum(a3, 1e-3), f)
    rgb = np.clip(mix, 0, 255).astype(np.uint8)
    return rgb, alpha


def main():
    os.makedirs(OUT, exist_ok=True)
    cap = cv2.VideoCapture(SRC)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Кадр `total-1` повторяет нулевой, поэтому период — на один короче
    period = total - 1
    picks = [round(i * period / FRAMES) for i in range(FRAMES)]
    print(f"в видео {total} кадров, берём {len(picks)}: шаг {360 / FRAMES:.0f}°")

    cuts = []
    for idx in picks:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            raise RuntimeError(f"кадр {idx} не прочитался")
        rgb, alpha = cut(frame)
        cuts.append((rgb, alpha))
    cap.release()

    # Общая рамка на все кадры: если резать каждый по себе, фигура
    # начнёт прыгать и менять размер при вращении.
    ys, xs = [], []
    for _, a in cuts:
        m = a > 0.1
        yy, xx = np.where(m)
        ys += [yy.min(), yy.max()]
        xs += [xx.min(), xx.max()]
    h0, w0 = cuts[0][1].shape
    y0, y1 = max(0, min(ys) - PAD), min(h0, max(ys) + PAD)
    x0, x1 = max(0, min(xs) - PAD), min(w0, max(xs) + PAD)
    print(f"общая рамка: {x1 - x0}x{y1 - y0}")

    scale = TARGET_H / (y1 - y0)
    out_w = round((x1 - x0) * scale)
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
