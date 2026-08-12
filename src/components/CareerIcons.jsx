import React from "react";

/* ---------- Shared inline icon set (no external icon library needed) ---------- */

export const Icon = ({ path, className = "" }) => (
  <svg
    className={`icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

export const IconUser = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </>
    }
  />
);

export const IconBook = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 0 17.5 21H4V5.5Z" />
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
      </>
    }
  />
);

export const IconChart = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M2 20h20" />
      </>
    }
  />
);

export const IconSpark = (p) => (
  <Icon
    {...p}
    path={
      <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2Z" />
    }
  />
);

export const IconTarget = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    }
  />
);

export const IconCompass = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5Z" />
      </>
    }
  />
);

export const IconBulb = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
      </>
    }
  />
);

export const IconRoute = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="5" r="2" />
        <path d="M8 19h7a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H9a4 4 0 0 1-4-4V5" />
      </>
    }
  />
);

export const IconBriefcase = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </>
    }
  />
);

export const IconArrow = (p) => (
  <Icon {...p} path={<path d="M5 12h14M13 6l6 6-6 6" />} />
);

export const IconFlag = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M5 21V4" />
        <path d="M5 4h13l-3 4 3 4H5" />
      </>
    }
  />
);

/* Lookup map used by data-driven components (roadmapData.js / learningGuidance.js)
   which store icons as string keys instead of JSX */

export const iconMap = {
  user: IconUser,
  book: IconBook,
  chart: IconChart,
  spark: IconSpark,
  target: IconTarget,
  compass: IconCompass,
  bulb: IconBulb,
  route: IconRoute,
  briefcase: IconBriefcase,
  arrow: IconArrow,
  flag: IconFlag,
};