import { siFacebook, siInstagram, siTiktok, siWhatsapp } from "simple-icons";

function Brand({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export const WhatsAppIcon = ({ className }: { className?: string }) => <Brand path={siWhatsapp.path} className={className} />;
export const FacebookIcon = ({ className }: { className?: string }) => <Brand path={siFacebook.path} className={className} />;
export const InstagramIcon = ({ className }: { className?: string }) => <Brand path={siInstagram.path} className={className} />;
export const TiktokIcon = ({ className }: { className?: string }) => <Brand path={siTiktok.path} className={className} />;
export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="4" fill="currentColor" />
      <text x="12" y="17.2" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif" fill="var(--color-navy-950)">in</text>
    </svg>
  );
}
