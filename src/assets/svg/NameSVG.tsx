interface NameSVGProps {
  className?: string;
  color?: string;
  isDotNeeded? : boolean;
}

const NameSVG = ({ className, color = "#000000",isDotNeeded = true }: NameSVGProps) => (
  <svg 
    viewBox="0 0 480 112" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={{ height: 'auto', width: '100%', maxWidth: '460px' }} 
  >
    <rect width="100%" height="100%" fill="none"/>    
    <text 
      x="50%" 
      y="75" 
      fontFamily="Inter, Arial, sans-serif" 
      fontSize="72" 
      fontWeight="900" 
      fill={color} 
      textAnchor="middle"
      style={{ letterSpacing: '-1px' }}
    >
      WorkSphere {isDotNeeded && <tspan>.</tspan>}
    </text>
    
  </svg>
);

export default NameSVG;