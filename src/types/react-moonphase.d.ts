declare module 'react-moonphase' {
  interface MoonPhaseViewProps {
    phase: number;
    size?: number;
    lightColor?: string;
    darkColor?: string;
  }

  const MoonPhaseView: React.FC<MoonPhaseViewProps>;
  export default MoonPhaseView;
} 