import { Link } from "react-router-dom";
import { isExternalUrl } from "../lib/links";

type ButtonProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "light";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ children, to, href, type = "button", variant = "primary", disabled, onClick }: ButtonProps) {
  const className = `button button-${variant}`;
  const target = isExternalUrl(href || to) ? "_blank" : undefined;
  const rel = target ? "noreferrer" : undefined;

  if (to) {
    return isExternalUrl(to) ? (
      <a className={className} href={to} target={target} rel={rel}>
        {children}
      </a>
    ) : (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={className} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
