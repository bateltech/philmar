import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
      <footer
        className="relative bg-cover bg-center text-white py-12 px-4 md:px-16"
        style={{ backgroundImage: "url('/images/footer.png')" }}
      >
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-65 pointer-events-none z-0"></div>
  
        {/* Content Container */}
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row justify-between items-center md:items-end text-center md:text-right space-y-8 md:space-y-0">
          
          {/* Contact Form */}
          <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center md:items-end space-y-4">
            <h2 className="text-lg font-semibold">Pour toute proposition de travail, vous pouvez me contacter</h2>
  
            <input 
              type="email" 
              placeholder="Entrez votre email ici..." 
              className="p-2 w-full md:w-80 text-black border border-red-500 rounded-md"
            />
  
            <textarea 
              placeholder="Entrez le message ici..." 
              className="p-2 w-full md:w-80 h-32 text-black border border-red-500 rounded-md"
            />
  
            <button className="bg-white text-black font-semibold py-2 px-6 mt-2 rounded-md hover:bg-gray-200 transition">
              Envoyer
            </button>
          </div>
  
          {/* Contact Details */}
          <div className="flex flex-col space-y-4 text-white">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <Link href="mailto:philmarzic@lilo.org" className="hover:underline">philmarzic@lilo.org</Link>
            </div>
  
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPhone} />
              <span>00 33 (0)6 28 06 07 56</span>
            </div>
          </div>
        </div>
  
        {/* Copyright Section */}
        <div className="relative z-10 text-center mt-8 text-sm">
          <p>© Créé par Batel Tech 2024 | Copyright Philmar. Tous droits réservés</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;