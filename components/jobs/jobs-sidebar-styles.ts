/**
 * Shared sidebar container classes for consistent styling across all jobs pages.
 * Matches the /jobs page sidebar (JobsSeekerContent) exactly.
 */
export const JOBS_SIDEBAR = {
  /** Desktop sidebar - fixed width, sticky */
  desktop:
    "hidden lg:block w-64 min-w-64 flex-shrink-0 self-start sticky top-24 border-r border-slate-200 pr-6 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden",
  /** Mobile drawer - slide-in panel */
  mobile:
    "fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 overflow-y-auto overflow-x-hidden py-4 px-4 transition-transform duration-200 ease-out lg:hidden [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden",
  /** Section with border below */
  sectionBordered: "border-b border-slate-200 pb-6",
  /** Section heading */
  sectionHeading: "text-slate-900 font-bold text-base mb-4",
  /** Section heading with smaller margin (e.g. View Mode) */
  sectionHeadingTight: "text-slate-900 font-bold text-base mb-3",
  /** Section heading with larger margin (e.g. Filters) */
  sectionHeadingLarge: "text-slate-900 font-bold text-base mb-6",
  /** Quick link / nav link */
  link: "flex items-center gap-2 text-slate-700 text-sm font-medium hover:text-slate-900 hover:underline transition-colors whitespace-nowrap min-w-0",
  /** Link icon */
  linkIcon: "w-4 h-4 text-slate-600 shrink-0",
  /** Link chevron */
  linkChevron: "w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto",
  /** Links container */
  linksContainer: "flex flex-col gap-3",
} as const;
