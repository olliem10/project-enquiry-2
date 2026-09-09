import Image from "next/image";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

// Cropped (whitespace trimmed only — no recolouring or redrawing) from the
// supplied public/brand/nexalfield-logo-original.jpg master export.
const FULL_LOGO = { src: "/brand/nexalfield-logo.png", width: 640, height: 160 };
const ICON_ONLY = { src: "/brand/nexalfield-icon.png", width: 142, height: 160 };

export function Logo({ className = "h-7 w-auto", iconOnly = false }: LogoProps) {
  const asset = iconOnly ? ICON_ONLY : FULL_LOGO;
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt="NexalField"
      priority
      className={className}
    />
  );
}
