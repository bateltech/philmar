import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-cover bg-center text-white py-16 px-4 scroll-mt-24" style={{ backgroundImage: "url('/images/footer.webp')" }} >

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-65 pointer-events-none z-0"></div>

        {/* Content aligned to the right */}
        <div className="relative container z-10 mx-auto flex flex-col items-center md:items-end space-y-8">
       
            {/* Contact Form */}
            <div className="flex flex-col items-center space-y-4">
                <ContactForm />

                {/* Contact Details */}
                <div className="flex space-x-8 justify-center text-white">
                    <div className="flex items-center justify-center  space-x-2">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>philmar @ lilo.org</span>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                        <FontAwesomeIcon icon={faPhone} />
                        <span>00 33 (0)6 28 06 07 56</span>
                    </div>

                </div>
            </div>

        </div>

        {/* Copyright Section */}
        <div className="relative z-10 text-center mt-12">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <span>© Créé par Batel Tech 2026 | Copyright Philmar. Tous droits réservés</span>
                <span aria-hidden="true">|</span>
                <Link href="/mentions-legales" className="underline underline-offset-4 hover:text-amber-300">
                    Mentions légales
                </Link>
            </p>
        </div>

    </footer>
  );
};

export default Footer;
