'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A card that behaves like a control. Using a real <button> keeps keyboard
 * activation, focus order and screen-reader semantics for free — a clickable
 * <div> provides none of them.
 */
export const ClickableCard = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      'group w-full rounded-2xl border border-border/60 bg-card p-5 text-start text-card-foreground shadow-sm',
      'transition-[transform,box-shadow,border-color] duration-200 ease-out',
      'hover:-translate-y-0.5 hover:border-border hover:shadow-md active:translate-y-0',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-60',
      className,
    )}
    {...props}
  />
))

ClickableCard.displayName = 'ClickableCard'
