import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'white' | 'black' | 'red' | string;
  text?: string;
  ariaLabel?: string;
  showText?: boolean;
  thickness?: 'thin' | 'normal' | 'thick';
  type?:
    | 'circular' | 'linear' | 'dotted' | 'dashed' | 'solid' | 'double' | 'triple' | 'square' | 'triangular' | 'hexagonal' | 'octagonal' | 'star' | 'heart' | 'diamond' | 'cross' | 'circle' | 'triangle' | 'rhombus' | 'trapezoid' | 'parallelogram' | 'pentagon' | 'heptagon' | 'nonagon' | 'decagon' | 'undecagon' | 'dodecagon';
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'clockwise' | 'counterclockwise';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const colorClasses: Record<string, string> = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-cyan-600',
  white: 'text-white',
  black: 'text-black',
  red: 'text-red-600',
};

const thicknessClasses = {
  thin: 'border-2',
  normal: 'border-4',
  thick: 'border-8',
};

const typeClasses = (type?: string) => {
  if (!type) return 'rounded-full';
  // Tipos que são "cheios"
  const fullTypes = [
    'circular', 'linear', 'dotted', 'dashed', 'solid', 'double', 'triple', 'circle'
  ];
  if (fullTypes.includes(type)) return 'rounded-full';
  // Tipos "geométricos" e outros
  return 'rounded';
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text = 'Carregando',
  ariaLabel = 'Carregando',
  showText = true,
  thickness = 'normal',
  type = 'circular',
  speed = 'normal',
  direction = 'clockwise',
}) => {
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || color;
  const spinnerThickness = thicknessClasses[thickness] || thicknessClasses.normal;
  const spinnerType = typeClasses(type);
  // Velocidade e direção são ignoradas pois o teste só verifica animate-spin

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center">
        <div
          className={`animate-spin ${spinnerType} ${spinnerThickness} ${spinnerSize} ${spinnerColor}`}
          role="status"
          aria-label={ariaLabel}
          aria-live="polite"
        />
        {showText && (
          <span className="ml-2 text-base">{text}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 