import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer
      className="relative bg-cover bg-center text-white py-12 px-6 md:px-12 lg:px-16"
      style={{ backgroundImage: "url('/images/footer.png')" }}
    >
      {/* Shadow Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-65 pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto flex flex-col items-center md:items-end space-y-6 md:space-y-8">
        
        {/* Contact Form */}
        <div className="flex flex-col space-y-4 w-full md:w-96">
          
          {/* Text above input fields (aligned with them) */}
          <h2 className="text-lg font-semibold text-center w-full">
            Pour toute proposition de travail, vous pouvez me contacter
          </h2>
          
          {/* Email Input */}
          <input 
            type="email" 
            placeholder="Entrez votre email ici..." 
            className="p-3 w-full text-black border border-red-500 rounded-md"
          />
          
          {/* Message Input */}
          <textarea 
            placeholder="Entrez le message ici..." 
            className="p-3 w-full h-32 text-black border border-red-500 rounded-md"
          />

          {/* Centered Send Button (relative to input fields) */}
          <button className="bg-white text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition self-center">
            Envoyer
          </button>
      
    
          {/* Contact Details (centered on mobile, aligned on larger screens) */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-white items-center md:items-end">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faEnvelope} />
              <Link href="mailto:philmarzic@lilo.org" className="hover:underline">
                philmarzic@lilo.org
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPhone} />
              <span>00 33 (0)6 28 06 07 56</span>
            </div>
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