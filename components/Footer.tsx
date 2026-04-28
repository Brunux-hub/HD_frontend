import Image from "next/image";
import {
  BsBuildingFill,
  BsFillTelephoneFill,
  BsEnvelopeAtFill,
} from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-[#A8F0F2] py-3 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="text-center lg:text-left">
          <Image
            src="/globe.svg"
            alt="logo"
            width={50}
            height={50}
            className="mx-auto block rounded-2xl"
          />
          <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Nuestra veterinaria ofrece diferentes productos y atención para tu
            mascota. Ven y visítanos.
          </p>
        </div>

        <div className="text-center lg:text-left">
          <Image
            src="/vercel.svg"
            alt="marca"
            width={50}
            height={50}
            className="mx-auto block"
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
          Todos los derechos reservados - &copy; Veterinaria
        </small>
      </div>
    </footer>
  );
};

export default Footer;
