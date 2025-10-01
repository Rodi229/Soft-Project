import React from 'react';

interface HeroSectionProps {
  activeProgram: 'GIP' | 'TUPAD';
}

const HeroSection: React.FC<HeroSectionProps> = ({ activeProgram }) => {
  const bgColor = activeProgram === 'GIP' ? 'bg-red-700' : 'bg-green-700';
  
  const content = activeProgram === 'GIP' ? {
    title: 'GOVERNMENT INTERNSHIP PROGRAM',
    tagline: '"Empowering Tomorrow\'s Leaders Today"',
    mission: 'To provide meaningful work experience and skills development opportunities for young graduates, preparing them for successful careers in public service and private sector employment.',
    vision: 'To provide temporary employment and livelihood opportunities for disadvantaged and displaced workers, helping them sustain their families while developing their skills and capabilities.'
  } : {
    title: 'TULONG PANGHANAPBUHAY SA ATING DISADVANTAGED/DISPLACED WORKERS',
    tagline: '"Building Resilient Communities Through Work"',
    mission: 'A generation of competent, skilled, and service-oriented young professionals contributing to the development of Santa Rosa City.',
    vision: 'Empowered communities with skilled workers who contribute to local economic development and poverty reduction in Santa Rosa City.'
  };

  return (
    <div className={`${bgColor} text-white rounded-lg p-8 mb-6`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
        <p className="text-lg opacity-90">{content.tagline}</p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8 text-left">
          <div>
            <h2 className="text-xl font-bold text-yellow-300 mb-3">MISSION</h2>
            <p className="text-sm leading-relaxed">
              {content.mission}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-300 mb-3">VISION</h2>
            <p className="text-sm leading-relaxed">
              {content.vision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;