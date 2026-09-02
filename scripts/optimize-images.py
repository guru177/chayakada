"""Resize and recompress public images. Run from repo root."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path("public")

MAX_EDGE = {
    "hero.png": 1408,
    "images/footer-parchment.png": 640,
    "images/footer-stamp.png": 480,
    "images/gallery/gal-quote.png": 1040,
    "images/mix-kettle.png": 960,
    "images/mix-scrap.png": 960,
    "images/seal-stamp.png": 800,
    "images/shop-vintage.png": 1600,
    "images/postage-stamp.png": 800,
    "images/hero-bg.jpg": 1024,
    "images/hero-bg-mobile.jpg": 576,
    "images/menu-board.jpg": 1024,
}

DEFAULT_MAX = 1400
JPEG_Q = 82
WEBP_Q = 82


def fit(im: Image.Image, max_edge: int) -> Image.Image:
    w, h = im.size
    longest = max(w, h)
    if longest <= max_edge:
        return im
    scale = max_edge / longest
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)


def has_useful_alpha(im: Image.Image) -> bool:
    if im.mode not in {"RGBA", "LA"} and not (im.mode == "P" and "transparency" in im.info):
        return False
    work = im.convert("RGBA")
    extrema = work.getchannel("A").getextrema()
    return extrema[0] < 250


def save_webp(im: Image.Image, dest: Path) -> None:
    work = im
    if work.mode not in {"RGB", "RGBA"}:
        work = work.convert("RGBA" if "A" in work.mode else "RGB")
    work.save(dest, "WEBP", quality=WEBP_Q, method=6)


def save_jpeg(im: Image.Image, dest: Path) -> None:
    im.convert("RGB").save(dest, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)


def save_png(im: Image.Image, dest: Path) -> None:
    im.convert("RGBA").save(dest, "PNG", optimize=True, compress_level=9)


def main() -> None:
    converted: list[tuple[str, str]] = []
    images = [
        p
        for p in ROOT.rglob("*")
        if p.suffix.lower() in {".png", ".jpg", ".jpeg"} and p.is_file()
    ]

    for src in sorted(images):
        rel = src.relative_to(ROOT).as_posix()
        im = Image.open(src)
        im.load()
        max_edge = MAX_EDGE.get(rel, DEFAULT_MAX)
        im = fit(im, max_edge)
        keep_png = src.suffix.lower() == ".png" and has_useful_alpha(im)

        if keep_png:
            save_png(im, src)
            save_webp(im, src.with_suffix(".webp"))
            print(f"PNG  {rel:48} {im.size[0]}x{im.size[1]}  {src.stat().st_size // 1024}KB")
            continue

        if src.suffix.lower() == ".png":
            dest = src.with_suffix(".jpg")
            save_jpeg(im, dest)
            save_webp(im, src.with_suffix(".webp"))
            src.unlink()
            converted.append((f"/{rel}", f"/{Path(rel).with_suffix('.jpg').as_posix()}"))
            print(f"JPG  {rel:48} {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024}KB")
        else:
            save_jpeg(im, src)
            save_webp(im, src.with_suffix(".webp"))
            print(f"JPG  {rel:48} {im.size[0]}x{im.size[1]}  {src.stat().st_size // 1024}KB")

    seal = next(ROOT.joinpath("images").glob("seal-stamp.*"))
    icon = fit(Image.open(seal).convert("RGB"), 180).resize((180, 180), Image.Resampling.LANCZOS)
    icon.save(ROOT / "apple-touch-icon.png", "PNG", optimize=True)
    icon.save(ROOT / "icon-192.png", "PNG", optimize=True)
    print("wrote apple-touch-icon.png and icon-192.png")
    for a, b in converted:
        print(f"  {a} -> {b}")


if __name__ == "__main__":
    main()
