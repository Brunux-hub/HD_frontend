import Image from "next/image";
import {
  BsBuildingFill,
  BsFillTelephoneFill,
  BsEnvelopeAtFill,
  BsFacebook,
  BsInstagram,
  BsWhatsapp,
} from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-[#A8F0F2] py-3 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-4 md:grid-cols-2 lg:grid-cols-3">
        
        <div className="text-center lg:text-left">
          <div className="flex justify-center gap-6 mt-4">
          {/* Botón Facebook */}
          <div className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 transition-all duration-300 hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] cursor-pointer">
            <BsFacebook className="text-[#1877F2] text-xl transition-all duration-300 group-hover:scale-125" />
          </div>

          {/* Botón Instagram */}
          <div className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 transition-all duration-300 hover:border-[#E4405F] hover:shadow-[0_0_15px_rgba(228,64,95,0.4)] cursor-pointer">
            <BsInstagram className="text-[#E4405F] text-xl transition-all duration-300 group-hover:scale-125" />
          </div>

          {/* Botón WhatsApp (opcional) */}
          <div className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 transition-all duration-300 hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] cursor-pointer">
            <BsWhatsapp className="text-[#25D366] text-xl transition-all duration-300 group-hover:scale-125" />
          </div>
        </div>
          <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300 text-balance">
            Siguenos en nuestras redes donde publicamos informacion sobre
            nuestros productos y servicios.
          </p>
        </div>

        <div className="text-center lg:text-left">
          <Image
            className="mx-auto block rounded-full"
            src="/logovet2.jpg"
            alt="logo"
            width={100}
            height={100}
            loading="lazy"
          />
        </div>

        <div className="text-center lg:text-left">
          <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
            Contacto
          </h3>

          <address className="space-y-3 text-sm not-italic text-slate-700 dark:text-slate-300">
            <p className="flex items-start justify-center gap-2 lg:justify-start">
              <BsBuildingFill className="mt-1 shrink-0" />
              <span>Jr. La Esquina 1011, Lima, Perú</span>
            </p>

            <p className="flex items-start justify-center gap-2 lg:justify-start">
              <BsFillTelephoneFill className="mt-1 shrink-0" />
              <span>+51 123 456 789</span>
            </p>

            <p className="flex items-start justify-center gap-2 lg:justify-start">
              <BsEnvelopeAtFill className="mt-1 shrink-0" />
              <a href="mailto:example@gmail.com" className="hover:underline">
                example@gmail.com
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-slate-300/40 px-6 py-4 dark:border-slate-700">
        <small className="block text-center text-lg text-slate-800 dark:text-white">
          Todos los derechos reservados -  &copy; Healthy Pets
        </small>
      </div>
    </footer>
  );
};

export default Footer;
