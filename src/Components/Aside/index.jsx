import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoNEAT from '/img/Logo-NEAT-Preta.svg';

export default function Aside() {
  const navigate = useNavigate();
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const handleMouseEnter = (index) => setHoveredIndex(index);
//   const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <div
      className="d-flex flex-column justify-content-between gap-5 p-4"
      style={{
        background: `linear-gradient(0deg, rgba(93,191,178,1) 0%, rgba(30,128,236,1) 100%)`,
        height: '100vh',
      }}
    >
      <div>
        <img
          style={{ cursor: 'pointer', padding: 5 }}
          onClick={() => navigate('/')}
          src={LogoNEAT}
          alt="logo-neat"
        />
      </div>
    </div>
  );
}
