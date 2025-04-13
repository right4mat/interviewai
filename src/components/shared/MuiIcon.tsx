import { useMemo, memo, ReactNode } from "react";
import dynamic from "next/dynamic";

interface MuiIconProps {
  name: string;
  [key: string]: any;
}

// Instead of importing all icons, dynamically import only the requested icon
const MuiIcon = ({ name, ...props }: MuiIconProps): ReactNode | null => {
  // Using React.lazy pattern with dynamic import for Next.js
  const IconComponent = useMemo(() => {
    if (!name) return null;

    return dynamic(
      () =>
        import("@mui/icons-material").then((mod) => {
          const Icon = mod[name as keyof typeof mod];
          if (!Icon) {
            console.warn(`Icon "${name}" not found`);
            return () => null;
          }
          return Icon;
        }),
      {
        loading: () => null,
        ssr: false // Disable SSR for icons to reduce initial bundle size
      }
    );
  }, [name]);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};

// Use memo to prevent unnecessary re-renders
export default memo(MuiIcon);
