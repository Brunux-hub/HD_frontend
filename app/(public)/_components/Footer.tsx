import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";

const socials = [
  { icon: BsFacebook, href: "#", label: "Facebook", hover: "hover:text-[#1877F2]" },
  { icon: BsInstagram, href: "#", label: "Instagram", hover: "hover:text-[#E4405F]" },
  { icon: BsWhatsapp, href: "https://wa.me/51123456789", label: "WhatsApp", hover: "hover:text-[#25D366]" },
];

const quickLinks = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

const Footer = () => {
  return (
    <footer className="bg-sidebar text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Marca */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              className="rounded-full ring-2 ring-white/60"
              src="/logovet2.jpg"
              alt="Healthy Pets"
              width={48}
              height={48}
            />
            <span className="text-lg font-bold text-white">
              Healthy<span className="text-white">Pets</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
            Cuidamos la salud de tu mascota con un equipo cercano y comprometido.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-current ${s.hover}`}
              >
                <s.icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
            Enlaces
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
            Contacto
          </h3>
          <address className="mt-4 space-y-3 text-sm not-italic text-white/80">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              Jr. La Esquina 1011, Lima, Perú
            </p>
            <p className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              +51 123 456 789
            </p>
            <p className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <a href="mailto:contacto@healthypets.pe" className="hover:text-white">
                contacto@healthypets.pe
              </a>
            </p>
          </address>
        </div>

        {/* Horario */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
            Horario
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li className="flex justify-between gap-4">
              <span>Lun – Vie</span>
              <span className="text-white">8:00 – 20:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Sábado</span>
              <span className="text-white">9:00 – 18:00</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Urgencias</span>
              <span className="font-semibold text-white">24 / 7</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-white/70 lg:px-8">
          © {new Date().getFullYear()} Healthy Pets. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
