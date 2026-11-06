import logo from "@/assets/leaf-logo.png";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export function Logo({
  size = 32,
  showText = true,
  className = "",
  animate = false,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logo}
        alt="Fatura Viva"
        width={size}
        height={size}
        className={animate ? "animate-leaf-sway" : ""}
        style={{ width: size, height: size }}
      />
      {showText && (
        <span className="font-semibold tracking-tight text-foreground">
          Fatura <span className="text-primary">Viva</span>
        </span>
      )}
    </div>
  );
}
