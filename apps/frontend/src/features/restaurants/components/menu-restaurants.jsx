import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";

const MenuRestaurants = ({ foods, setCategory, category, scrollRef, categoryRefs }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const innerRef = useRef(null);
  const [maxTranslateX, setMaxTranslateX] = useState(0);

  const scrollToCategory = (categoryId) => {
    const element = categoryRefs.current[categoryId];
    const header = document.querySelector("#header-app");

    if (element && header) {
      const headerHeight = header.getBoundingClientRect().height + 50;
      const top = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("#header-app");
      const headerHeight = header ? header.getBoundingClientRect().height + 50 : 0;

      let closestCategory = null;
      let minDistance = Infinity;

      Object.entries(categoryRefs.current).forEach(([categoryId, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - headerHeight);

          if (rect.top < window.innerHeight / 2 && distance < minDistance) {
            minDistance = distance;
            closestCategory = categoryId;
          }
        }
      });

      if (closestCategory && closestCategory !== category) {
        setCategory(closestCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [category]);

  useEffect(() => {
    const updatePosition = debounce(() => {
      if (scrollRef.current && innerRef.current && category) {
        const container = scrollRef.current;
        const inner = innerRef.current;
        const selectedButton = container.querySelector(`button[data-category="${category}"]`);

        if (selectedButton) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = selectedButton.getBoundingClientRect();
          const innerRect = inner.getBoundingClientRect();

          const padding = 50;

          const isOutOfViewLeft = buttonRect.left < containerRect.left + padding;
          const isOutOfViewRight = buttonRect.right > containerRect.right - padding;

          if (isOutOfViewLeft || isOutOfViewRight) {
            const newTranslateX =
              translateX - (buttonRect.left - containerRect.left) + containerRect.width / 2 - buttonRect.width / 2;

            const clampedTranslateX = Math.max(-innerRect.width + containerRect.width, Math.min(0, newTranslateX));

            setTranslateX(clampedTranslateX);
          }
        }
      }
    }, 50);

    updatePosition();

    return () => updatePosition.cancel();
  }, [category, maxTranslateX]);

  useEffect(() => {
    if (scrollRef.current && innerRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const contentWidth = innerRef.current.scrollWidth;
      setMaxTranslateX(Math.max(0, contentWidth - containerWidth));
    }
  }, [foods]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setDragDistance(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !innerRef.current) return;
    const moveX = e.pageX - startX;
    setDragDistance((prev) => prev + Math.abs(moveX));

    setTranslateX((prev) => {
      const newTranslateX = prev + moveX;
      return Math.min(0, Math.max(-maxTranslateX, newTranslateX));
    });
    setStartX(e.pageX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (food) => {
    if (dragDistance < 5) {
      scrollToCategory(food.foodCategoryId);
      setCategory(food.foodCategoryId);
    }
  };

  const handleScrollLeft = () => {
    setTranslateX((prev) => Math.min(0, prev + 200));
  };

  const handleScrollRight = () => {
    setTranslateX((prev) => Math.max(-maxTranslateX, prev - 200));
  };

  return (
    <div
      className="w-full sticky top-[87px] z-10 bg-background pt-2 pb-1 overflow-hidden flex items-center"
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full flex flex-row-reverse justify-center items-center ${translateX === 0 ? "hidden" : ""}`}
      >
        <div className="w-10 h-full bg-gradient-to-r from-[#fff] from-[20%] to-transparent to-[80%]" />
        <div className="bg-background h-full flex items-center justify-center">
          <button onClick={handleScrollLeft} className="hover:bg-muted rounded-full p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="bg-background z-10  overflow-hidden scroll-smooth no-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={innerRef}
          style={{
            transform: `translateX(${translateX}px)`,
          }}
          className="inline-flex gap-2 ease-out transition-transform duration-200"
        >
          {foods?.map((food) => (
            <Button
              data-category={food.foodCategoryId}
              key={food.foodCategoryId}
              variant={category === food.foodCategoryId ? "" : "outline"}
              className="select-none"
              onClick={() => handleClick(food)}
            >
              {food.categoryName}
            </Button>
          ))}
        </div>
      </div>

      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full flex justify-center items-center ${translateX === -maxTranslateX ? "hidden" : ""}`}
      >
        <div className="w-10 h-full bg-gradient-to-l from-[#fff] from-20% to-transparent to-80%" />
        <div className="bg-background h-full flex items-center justify-center">
          <button onClick={handleScrollRight} className="hover:bg-muted rounded-full p-2">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuRestaurants;
