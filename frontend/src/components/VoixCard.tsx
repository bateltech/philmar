import Image from 'next/image';

interface VoixSection {
  label: string;
  content: string;
}

interface VoixCardProps {
  title: string;
  image: string;
  description?: string;
  objectifs?: string;
  moyens?: string;
  contenu?: string;
  horaires?: string;
  sections?: VoixSection[];
}

export default function VoixCard({ title, image, description, objectifs, moyens, contenu, horaires, sections }: VoixCardProps) {
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
        {description && <p className="mb-2">{description}</p>}
        {sections && sections.map((section, i) => (
          <p key={i} className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">{section.label} :</span> {section.content}
          </p>
        ))}
        {objectifs && (
          <p className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">Objectifs :</span> {objectifs}
          </p>
        )}
        {moyens && (
          <p className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">Moyens :</span> {moyens}
          </p>
        )}
        {contenu && (
          <p className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">Contenu :</span> {contenu}
          </p>
        )}
        {horaires && (
          <p className="mb-2 text-gray-300 text-xs">
            <span className="font-bold text-white">Horaires :</span> {horaires}
          </p>
        )}
      </div>
    </div>
  );
}
