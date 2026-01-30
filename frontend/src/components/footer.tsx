import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative bg-cover bg-center text-white py-16 px-4" style={{ backgroundImage: "url('/images/footer.webp')" }} >

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-65 pointer-events-none z-0"></div>

        {/* Content aligned to the right */}
        <div className="relative container z-10 mx-auto flex flex-col items-center md:items-end space-y-8">
       
            {/* Contact Form */}
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-lg text-right">Pour toute proposition de travail, vous pouvez me contacter</h2>
          
                <input 
                    type="email" 
                    placeholder="Entrez votre email ici..." 
                    className="p-2 w-80 text-black border border-red-500"
                />
          
                <textarea 
                    placeholder="Entrez le message ici..." 
                    className="p-2 w-80 h-32 text-black border border-red-500"
                />
          
                <button className="bg-white text-black font-semibold py-2 px-6 mt-4">
                    Envoyer
                </button>

                {/* Contact Details */}
                <div className="flex space-x-8 justify-center text-white">
                    <div className="flex items-center justify-center  space-x-2">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <Link href="mailto:philmarzic@lilo.org" className="hover:underline">philmarzic@lilo.org</Link>
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
            <p>© Créé par Batel Tech 2025 | Copyright Philmar. Tous droits réservés</p>
        </div>

    </footer>
  );
};

export default Footer;
