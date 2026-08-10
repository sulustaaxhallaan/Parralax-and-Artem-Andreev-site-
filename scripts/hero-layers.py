"""Раскладывает фото для Hero на слои: человек и две синие ленты.

Ленты в исходнике «впечатаны» в фотографию. Чтобы они могли двигаться
отдельно от фигуры, скрипт:
  1. находит ленты по синеве и дорастает маску до их белых бликов;
  2. сохраняет каждую ленту отдельным слоем на общем холсте;
  3. на слое человека закрывает освободившееся место мягкой заливкой
     и оставляет по краю запас, чтобы при сдвиге ленты не появлялось
     просветов.

Запуск (нужны pillow, numpy, scipy):

    python scripts/hero-layers.py путь/к/Hero_img.png

Результат кладётся в public/hero/. После замены картинок почисти кеш
оптимизатора: удали .next/dev/cache/images, иначе браузер будет
показывать старые версии.
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "Hero_img.png")
OUT = os.path.join(ROOT, "public", "hero")
TARGET_W = 1200

BLUE_THR = 45
MIN_AREA = 20000  # мелкие синие пятна (блик на очках и т.п.) не трогаем

os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(np.int16)
R, G, B, A = (arr[..., i] for i in range(4))
H, W = A.shape

opaque = A > 20
blueness = B - np.maximum(R, G)

# Ядро — уверенно синие пиксели.
seed = (blueness > BLUE_THR) & opaque
seed = ndimage.binary_opening(seed, np.ones((5, 5)))

# У лент есть яркие белые блики: по синеве они почти нейтральные, но
# всегда светлые и чуть холодные. Кожа и бежевая футболка — тёплые
# (B меньше R), тёмный пиджак — не яркий, так что сюда не попадают.
ribbonish = opaque & ((blueness > 20) | ((blueness > 0) & (B > 190)))

# Наращиваем от ядра внутри «похожего на ленту» — так блики
# по кромке подхватываются, а посторонние светлые пятна нет.
ribbon = ndimage.binary_propagation(seed, mask=ribbonish)
ribbon = ndimage.binary_closing(ribbon, np.ones((15, 15)))
ribbon = ndimage.binary_fill_holes(ribbon)

lab, n = ndimage.label(ribbon)
sizes = ndimage.sum(ribbon, lab, range(1, n + 1))
keep = [i + 1 for i, s in enumerate(sizes) if s >= MIN_AREA]
print("компонент найдено:", n, "| крупных:", len(keep))

parts = []
for k in keep:
    m = lab == k
    ys, xs = np.where(m)
    parts.append((xs.mean(), m, int(m.sum()), xs.min(), xs.max(), ys.min(), ys.max()))
parts.sort(key=lambda p: p[0])

for i, (cx, m, area, x0, x1, y0, y1) in enumerate(parts):
    print(f"  лента {i}: площадь {area:>8}  x {x0}-{x1}  y {y0}-{y1}  центр x {cx:.0f}")

ribbon = np.zeros_like(ribbon)
for p in parts:
    ribbon |= p[1]

# --- слой человека.
# Две разные зоны:
#   fill — где подменяем цвет (чуть шире ленты, чтобы съесть синюю кайму);
#   cut  — где реально делаем дырку (заметно УЖЕ ленты).
# Разница между ними — кольцо запаса: человек уходит под ленту на ~33 px,
# поэтому при её смещении в кадре не появляется просвет.
# Дилатация щедрая не просто так: у ленты сглаженный край, который по
# синеве в маску не попадает. Если его не съесть, на слое человека
# останется тонкий светлый контур, обводящий ленту.
fill_zone = ndimage.binary_dilation(ribbon, np.ones((27, 27)))
cut_zone = ndimage.binary_erosion(ribbon, np.ones((25, 25)))

person_mask = opaque & ~fill_zone

# «внутренние» дырки — те, где тело есть и выше, и ниже: их зарисовываем
above = np.maximum.accumulate(person_mask, axis=0)
below = np.maximum.accumulate(person_mask[::-1], axis=0)[::-1]
interior = fill_zone & above & below
ring = fill_zone & ~cut_zone
print("дырок к зарисовке: %.2f%% кадра" % (100 * interior.mean()))
print("кольцо запаса:     %.2f%% кадра" % (100 * ring.mean()))

rgb = np.asarray(im)[..., :3].astype(np.float32)

# Заливка в два шага: сначала тянем ближайший «здоровый» пиксель,
# потом сильно размываем. Резкие детали тут не нужны — эта area всегда
# закрыта лентой, наружу выходят только несколько пикселей по кромке.
_, (iy, ix) = ndimage.distance_transform_edt(
    fill_zone | ~opaque, return_distances=True, return_indices=True
)
nearest = rgb[iy, ix]
smooth = np.dstack(
    [ndimage.gaussian_filter(nearest[..., c], 22) for c in range(3)]
)
filled = np.where(fill_zone[..., None], smooth, rgb)

# Кольцо запаса за пределами силуэта висело бы в воздухе светлой каймой:
# заливка тянет туда цвет ближайшего тела — кожу и футболку.
# Красим его в цвет фона сайта, чтобы при сдвиге ленты наружу выходила
# мягкая тень. Ориентируемся на «внутри тела» (interior), а не на
# непрозрачность: лента сама по себе непрозрачна везде.
outside = ring & ~interior
filled = np.where(outside[..., None], np.array([8, 18, 34], np.float32), filled)

# Кольцо запаса гасим плавно: если лента сдвинется и приоткроет его,
# наружу выйдет мягкая тень, а не резкая светлая кромка.
dist = ndimage.distance_transform_edt(~cut_zone)
ramp = np.clip(1.0 - dist / 24.0, 0, 1) * 255.0

person_alpha = A.astype(np.float32)
person_alpha = np.where(ring & ~interior, ramp, person_alpha)
person_alpha = np.where(cut_zone & ~interior, 0, person_alpha)
person_alpha = np.where(interior, 255, person_alpha)
person_alpha = np.clip(person_alpha, 0, 255).astype(np.uint8)
person = np.dstack([np.clip(filled, 0, 255), person_alpha])


def save(rgba, name):
    img = Image.fromarray(rgba.astype(np.uint8), "RGBA")
    h = round(img.height * TARGET_W / img.width)
    img = img.resize((TARGET_W, h), Image.LANCZOS)
    path = os.path.join(OUT, name)
    img.save(path, optimize=True)
    print(f"{name:<22} {img.width}x{img.height}  {os.path.getsize(path)//1024} KB")
    return img.size


save(person, "person.png")

# --- слои лент: каждая на полном холсте, чтобы совпадали по координатам
src_rgb = np.asarray(im)[..., :3]
for i, (cx, m, *_rest) in enumerate(parts):
    soft = ndimage.binary_dilation(m, np.ones((3, 3)))
    alpha = np.where(soft, A, 0)
    # мягкая кромка, иначе край выглядит вырезанным ножницами
    alpha = ndimage.gaussian_filter(alpha.astype(np.float32), 1.2)
    layer = np.dstack([src_rgb, np.clip(alpha, 0, 255)])
    save(layer, f"ribbon-{'ab'[i] if i < 2 else i}.png")

print("\nхолст:", W, "x", H, "→", TARGET_W)

# --- контрольная склейка: сдвигаем ленты на максимум анимации и смотрим,
#     не появились ли просветы на теле
person_img = Image.open(os.path.join(OUT, "person.png"))
canvas = Image.new("RGBA", person_img.size, (5, 13, 28, 255))
canvas.alpha_composite(person_img)
for name, dx, dy in [("ribbon-a.png", 14, 11), ("ribbon-b.png", -13, -9)]:
    r = Image.open(os.path.join(OUT, name))
    canvas.alpha_composite(r.transform(
        r.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy), resample=Image.BICUBIC
    ))
check = os.path.join(OUT, "_check.jpg")
canvas.convert("RGB").save(check, quality=88)
print("контрольная склейка:", check)
print("Открой её и убедись, что на теле нет просветов по краям лент.")
