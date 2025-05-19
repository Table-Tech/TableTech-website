// src/utils/Responsive.tsx
import React from "react";
import { useBreakpoint } from "./useBreakpoint";

type ResponsiveProps = {
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  fallback?: React.ReactNode;
};

export const Responsive: React.FC<ResponsiveProps> = ({
  mobile,
  tablet,
  desktop,
  fallback = null,
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;

  return <>{fallback}</>;
};
