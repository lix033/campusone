import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon, WhatsAppIcon } from "./whatsapp-icon";
import { Logo } from "@/components/ui";
import { contact } from "@/lib/mocks";
import { Container } from "./section";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Découvrir",
    links: [
      { href: "/formations", label: "Catalogue des formations" },
      { href: "/etudier-a-l-etranger", label: "Étudier à l'étranger" },
      { href: "/partenaires", label: "Écoles partenaires" },
      { href: "/orientation", label: "Je ne sais pas quoi choisir" },
    ],
  },
  {
    title: "Accompagnement",
    links: [
      { href: "/services", label: "Nos services" },
      { href: "/comment-ca-marche", label: "Comment ça marche ?" },
      { href: "/candidater", label: "Candidater" },
      { href: "/actualites", label: "Actualités & conseils" },
    ],
  },
  {
    title: "Campus One",
    links: [
      { href: "/contact", label: "Nous contacter" },
      { href: "/mon-espace", label: "Mon espace" },
      { href: "/contact#rendez-vous", label: "Prendre rendez-vous" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Votre projet d'études, de l'orientation à l'installation. Un guichet unique pour étudier en France, puis bientôt au Canada, en Belgique et ailleurs.
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Study · Move · Succeed</p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: WhatsAppIcon, label: "WhatsApp" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: InstagramIcon, label: "Instagram" },
                { icon: LinkedinIcon, label: "LinkedIn" },
                { icon: TiktokIcon, label: "TikTok" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-navy-100 transition-colors hover:border-brand-400 hover:text-white">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-semibold text-white">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm transition-colors hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-white">Nous joindre</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />{contact.phone}</li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />{contact.email}</li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />{contact.address}</li>
            </ul>
            <p className="mt-6 text-sm font-semibold text-white">Conseils par email</p>
            <NewsletterForm />
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Campus One. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><a href="#" className="hover:text-white">Mentions légales</a></li>
            <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-white">Gestion des cookies</a></li>
            <li><Link href="/admin/connexion" className="hover:text-white">Espace collaborateurs</Link></li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
