import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority";

const inputVariants = cva(
	"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-input bg-background",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-10 px-3 py-2",
				sm: "h-9 px-3",
				lg: "h-11 px-8",
				icon: "h-10",
			},
		},
		compoundVariants: [
			{ size: "default", variant: "outline", className: "pt-4 h-11" },
		],

		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);


const Input = React.forwardRef(
	({ className, variant, size, label, type, ...props }, ref) => {
		if (!label)
			return (
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						className,
					)}
					ref={ref}
					{...props}
				/>
			);
		return (
			<div className="flex flex-col relative">
				<label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 absolute left-3 top-2 transform -translate-y-1/2 text-xs">
					{label}
				</label>
				<input
					type={type}
					className={cn(inputVariants({ variant, size, className }))}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
