import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-red-700 text-white rounded-lg p-8 mb-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">GOVERNMENT INTERNSHIP PROGRAM</h1>
        <p className="text-lg opacity-90">"Empowering Tomorrow's Leaders Today"</p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8 text-left">
          <div>
            <h2 className="text-xl font-bold text-yellow-300 mb-3">MISSION</h2>
            <p className="text-sm leading-relaxed">
              To provide meaningful work experience and skills development opportunities for young 
              graduates, preparing them for successful careers in public service and private sector 
              employment.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-300 mb-3">VISION</h2>
            <p className="text-sm leading-relaxed">
              To provide temporary employment and livelihood opportunities for disadvantaged and 
              displaced workers, helping them sustain their families while developing their skills and 
              capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;