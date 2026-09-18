import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@campus-one/mocks";
import { Container, PageHero } from "@/components/site/section";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre projet" text="Écrivez-nous, appelez-nous ou réservez un rendez-vous avec un conseiller. Réponse sous 24 heures ouvrées." image="/images/students-talk.jpg" />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            {[
              { icon: Phone, k: "Téléphone", v: contact.phone },
              { icon: Mail, k: "Email", v: contact.email },
              { icon: MapPin, k: "Agence", v: contact.address },
              { icon: Clock, k: "Horaires", v: contact.hours },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex gap-4 rounded-2xl border border-line p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="size-5" aria-hidden /></span>
                <div><p className="text-sm font-semibold text-navy-900">{k}</p><p className="text-sm text-muted">{v}</p></div>
              </div>
            ))}
            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-[#25D366]/10 p-5 transition-colors hover:bg-[#25D366]/15">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white"><WhatsAppIcon className="size-5" /></span>
              <div><p className="text-sm font-semibold text-navy-900">WhatsApp</p><p className="text-sm text-muted">Discutez avec un conseiller</p></div>
            </a>
          </div>
          <div className="lg:col-span-8"><ContactForm /></div>
        </Container>
      </section>
    </>
  );
}
