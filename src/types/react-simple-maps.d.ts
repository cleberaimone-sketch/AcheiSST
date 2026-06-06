declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, SVGProps, MouseEvent } from 'react';

  export interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
  }

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    children?: ReactNode;
    className?: string;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (params: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    properties: Record<string, unknown>;
    geometry: object;
  }

  export interface GeographyStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: GeographyStyle;
      hover?: GeographyStyle;
      pressed?: GeographyStyle;
    };
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseMove?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<unknown>;
  export const ZoomableGroup: ComponentType<unknown>;
  export const Graticule: ComponentType<unknown>;
  export const Sphere: ComponentType<unknown>;
  export const Line: ComponentType<unknown>;
  export const Annotation: ComponentType<unknown>;
}
