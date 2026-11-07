import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const computedDisabled = Boolean(disabled || loading);
    const spinner = loading ? (
      <svg
        className="size-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ) : null;

    if (asChild) {
      const onlyChild = React.Children.only(
        children,
      ) as React.ReactElement<any>;
      const childOnClick = onlyChild.props?.onClick as
        | React.MouseEventHandler
        | undefined;
      const propOnClick = props.onClick as React.MouseEventHandler | undefined;
      const onClick: React.MouseEventHandler = (e) => {
        if (computedDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        childOnClick?.(e);
        propOnClick?.(e);
      };

      return React.cloneElement(
        onlyChild,
        {
          ...props,
          ref,
          onClick,
          className: cn(
            buttonVariants({ variant, size, className }),
            computedDisabled ? "pointer-events-none opacity-50" : null,
            onlyChild.props?.className,
          ),
          "aria-disabled": computedDisabled ? true : undefined,
          tabIndex: computedDisabled ? -1 : onlyChild.props?.tabIndex,
        },
        <>
          {spinner}
          {onlyChild.props?.children}
        </>,
      );
    }

    const Comp = "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={computedDisabled}
        aria-disabled={computedDisabled ? true : undefined}
        {...props}
      >
        {spinner}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
