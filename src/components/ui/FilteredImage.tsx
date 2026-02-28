import { Image, ImageProps } from "@tarojs/components";
import { useEffect, useMemo, useState } from "react";

type ColorMultiplyFilter = {
  filterId: string;
  r: number;
  g: number;
  b: number;
};

function clampToByte(value: number): number {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return value | 0;
}

function extractSvgFilterId(iconFilter: string): string | null {
  const match = iconFilter.match(/url\(['"]?#([^'"]+)['"]?\)/);
  return match?.[1] ?? null;
}

function parseColorMultiply(filterId: string): ColorMultiplyFilter | null {
  if (!filterId.startsWith("colorMultiply-")) return null;
  const colorHex = filterId.replace("colorMultiply-", "");
  if (colorHex.length !== 8) return null;
  const rRaw = parseInt(colorHex.slice(0, 2), 16);
  const gRaw = parseInt(colorHex.slice(2, 4), 16);
  const bRaw = parseInt(colorHex.slice(4, 6), 16);
  if (![rRaw, gRaw, bRaw].every(Number.isFinite)) return null;
  return {
    filterId,
    r: rRaw / 255,
    g: gRaw / 255,
    b: bRaw / 255,
  };
}

const tintCache = new Map<string, string>();

async function tintPngWithColorMultiply(
  src: string,
  filter: ColorMultiplyFilter
): Promise<string | null> {
  const wxAny = (globalThis as any)?.wx as any;
  if (!wxAny?.createOffscreenCanvas) return null;

  const info = await new Promise<any>((resolve, reject) => {
    wxAny.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    });
  });

  const originalWidth = Number(info?.width) || 0;
  const originalHeight = Number(info?.height) || 0;
  if (!originalWidth || !originalHeight) return null;

  const maxDim = 256;
  const scale = Math.min(1, maxDim / Math.max(originalWidth, originalHeight));
  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));

  const canvas = wxAny.createOffscreenCanvas({ type: "2d", width, height });
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const img = canvas.createImage();
  const imgPath = info?.path || src;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err: any) => reject(err);
    img.src = imgPath;
  });

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const { r, g, b } = filter;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clampToByte(data[i] * r);
    data[i + 1] = clampToByte(data[i + 1] * g);
    data[i + 2] = clampToByte(data[i + 2] * b);
  }
  ctx.putImageData(imageData, 0, 0);

  if (typeof canvas.toDataURL !== "function") return null;

  const out = canvas.toDataURL("image/png");

  return typeof out === "string" && out ? out : null;
}

export type FilteredImageProps = Omit<ImageProps, "src"> & {
  src: string;
  iconFilter?: string;
};

export default function FilteredImage({ iconFilter, style, src, ...rest }: FilteredImageProps) {
  const env = process.env.TARO_ENV;

  const parsed = useMemo(() => {
    if (!iconFilter) return null;
    const filterId = extractSvgFilterId(iconFilter);
    if (!filterId) return null;
    return parseColorMultiply(filterId);
  }, [iconFilter]);

  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  useEffect(() => {
    if (env !== "weapp") return;
    if (!parsed) {
      setResolvedSrc(src);
      return;
    }

    const cacheKey = `${src}#${parsed.filterId}`;
    const cached = tintCache.get(cacheKey);
    if (cached) {
      setResolvedSrc(cached);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const output = await tintPngWithColorMultiply(src, parsed);
        if (cancelled) return;
        if (output) {
          tintCache.set(cacheKey, output);
          setResolvedSrc(output);
          return;
        }
        setResolvedSrc(src);
      } catch {
        if (!cancelled) setResolvedSrc(src);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [env, parsed, src]);

  if (env === "h5") {
    const nextStyle = iconFilter ? { ...(style as any), filter: iconFilter } : style;
    return <Image {...rest} src={src} style={nextStyle} className={`flex items-center justify-center ${rest.className || ""}`} />;
  }

  return <Image {...rest} src={resolvedSrc} style={style} />;
}

