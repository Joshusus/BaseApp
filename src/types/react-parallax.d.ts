/** react-parallax 3.5.2 ships a .ts declaration with a value-imported ReactNode.
 * Keep this project's strict type-only imports without changing vendor files.
 * These are the existing props used by the photo wrapper.
 */
declare module 'react-parallax/lib/index.js' {
  import type { ComponentType, ReactNode } from 'react';
  export type ParallaxProps = {
    blur?: number;
    strength?: number;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
    renderLayer?: (percentage: number) => ReactNode;
    children?: ReactNode;
  };
  export const Parallax: ComponentType<ParallaxProps>;
}
