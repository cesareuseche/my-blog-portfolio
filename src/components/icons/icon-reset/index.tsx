import { forwardRef } from "react";

const IconReset = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    ref={ref}
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 .34-.03.67-.08.99l1.53 1.18C19.82 13.14 20 12.58 20 12c0-4.42-3.58-8-8-8zm-6.45.41L4 5.59C2.76 6.95 2 8.87 2 11c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.36.46-2.61 1.22-3.59z"/>
  </svg>
));

IconReset.displayName = "IconReset";

export default IconReset;
