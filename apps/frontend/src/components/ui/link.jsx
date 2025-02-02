import { Link as RouterLink } from "react-router";
export const Link = ({ className, children, ...props }) => {
  return (
    <RouterLink className={className} {...props}>
      {children}
    </RouterLink>
  );
};
