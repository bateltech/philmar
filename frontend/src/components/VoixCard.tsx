import Image from 'next/image';

interface VoixCardProps {
  title: string;
  image: string;
  description: string;
  details?: string;
  extra?: string;
}

export default function VoixCard({ title, image, description, details, extra }: VoixCardProps) {
  return (
    <div className="flex-shrink-0 w-[320px] bg-black text-white rounded shadow border border-white">
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={320}
          height={200}
          className="w-full h-[160px] object-cover"
        />
        <div className="absolute top-0 left-0 bg-[#791919] px-2 py-1 text-xs font-bold uppercase w-2/3">
          {title}
        </div>
      </div>
      <div className="p-3 text-sm leading-snug">
        <p className="mb-2">{description}</p>
        {details && (
          <p className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">Détails :</span> {details}
          </p>
        )}
        {extra && (
          <a href="#" className="text-blue-400 font-semibold underline text-sm">
            {extra}
          </a>
        )}
      </div>
    </div>
  );
}
