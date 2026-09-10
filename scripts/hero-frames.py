"""Нарезает поворотную ленту для первого экрана из видео с моделью.

Исходник — оборот на тёмно-синем фоне. Фон НЕ вырезается: он почти
совпадает с фоном сайта, а мягкую границу даёт CSS-маска в HeroModel.

Главная тонкость — скорость вращения в исходнике неравномерная
(в замерах разброс больше чем в десять раз: местами фигура почти стоит,
местами летит). Поэтому кадры выбираются равномерно НЕ по времени,
а по накопленному изменению картинки, то есть примерно по углу.
Иначе при перетаскивании лента дёргалась бы.

Результат — public/hero/turn/f000..fNNN.webp
"""

import os

import cv2
import numpy as np
from PIL import Image

SRC = r"C:\Users\Anvil\Downloads\0811(1)\0811(1).mp4"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "hero", "turn")

# В обороте исходника 292 кадра, и скорость неравномерная. После
# выравнивания по углу 180 — предел, на котором кадры ещё почти все
# различны: при 240 дублей уже 13%, при 360 — 30%, то есть треть файлов
# весит впустую и плавности не добавляет. Больше можно будет взять
# только с видео, снятого на равномерной скорости и подлиннее.
FRAMES = 180         # шаг 2°
TARGET_H = 800
QUALITY = 72

# где искать конец полного оборота (в кадрах исходника)
PERIOD_MIN, PERIOD_MAX = 250, 360

# Обрезка по фигуре, в координатах исходника (x0, y0, x1, y1).
# Подобрана по кадрам: фигура не выходит за неё ни в одном ракурсе.
# Чем меньше в кадре пустого фона, тем меньше он выдаёт себя тёмным
# прямоугольником на светлых участках фона страницы.
# Если поменяешь видео — проверь рамку заново.
CROP = (150, 40, 570, 1230)


def load_small(cap, size=(240, 420)):
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(cv2.resize(f, size).astype(np.float32))
    return frames


def find_period(small):
    """Кадр, на котором фигура возвращается в исходное положение."""
    ref = small[0]
    best, best_v = None, 1e9
    for j in range(PERIOD_MIN, min(len(small), PERIOD_MAX)):
        v = np.abs(small[j] - ref).mean()
        if v < best_v:
            best, best_v = j, v
    return best, best_v


def pick_by_angle(small, period):
    """Индексы кадров с равным шагом по накопленному движению."""
    step = np.array(
        [np.abs(small[i + 1] - small[i]).mean() for i in range(period)]
    )
    cum = np.concatenate([[0.0], np.cumsum(step)])
    targets = np.linspace(0, cum[-1], FRAMES, endpoint=False)
    # обратная интерполяция: какому кадру соответствует нужный «угол»
    idx = np.interp(targets, cum, np.arange(period + 1))
    return [int(round(v)) % period for v in idx], step


def main():
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        if old.endswith(".webp"):
            os.remove(os.path.join(OUT, old))

    cap = cv2.VideoCapture(SRC)
    small = load_small(cap)
    cap.release()
    print(f"в видео {len(small)} кадров")

    period, err = find_period(small)
    print(f"полный оборот: кадры 0..{period} (совпадение с началом {err:.2f})")

    picks, step = pick_by_angle(small, period)
    uniq = len(set(picks))
    print(f"берём {FRAMES} кадров, различных исходных {uniq}")
    print(f"скорость в исходнике: мин {step.min():.2f}, макс {step.max():.2f}")

    gaps = np.diff(sorted(set(picks)))
    print(f"шаг по исходнику: от {gaps.min()} до {gaps.max()} кадров")

    # читаем подряд и держим только нужные: seek по 360 позициям медленный
    need = sorted(set(picks))
    cap = cv2.VideoCapture(SRC)
    store, i, k = {}, 0, 0
    while k < len(need):
        ok, f = cap.read()
        if not ok:
            break
        if i == need[k]:
            store[i] = f
            k += 1
        i += 1
    cap.release()

    h, w = store[need[0]].shape[:2]
    x0, y0, x1, y1 = CROP
    print(f"обрезка: {x1 - x0}x{y1 - y0} из {w}x{h}")

    out_w = round((x1 - x0) * TARGET_H / (y1 - y0))
    total_kb = 0
    for j, src_i in enumerate(picks):
        im = Image.fromarray(store[src_i][y0:y1, x0:x1, ::-1]).resize(
            (out_w, TARGET_H), Image.LANCZOS
        )
        path = os.path.join(OUT, f"f{j:03d}.webp")
        im.save(path, "WEBP", quality=QUALITY, method=4)
        total_kb += os.path.getsize(path) / 1024

    print(f"готово: {FRAMES} кадров {out_w}x{TARGET_H}, всего {total_kb / 1024:.2f} МБ")
    print(f"пропорция для вёрстки: {out_w}/{TARGET_H}")


if __name__ == "__main__":
    main()
