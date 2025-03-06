import { cn } from "@/utils/cn";
import { useInView } from "react-intersection-observer";

const LazyImage = ({ src, alt, className }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <img
      ref={ref}
      src={inView ? src : ""}
      alt={alt}
      className={cn("transition-opacity duration-700 ease-in-out w-full h-auto", className, {
        "opacity-100": inView,
        "opacity-0": !inView,
      })}
    />
  );
};

export default LazyImage;
