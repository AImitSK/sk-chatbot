import clsx from 'clsx'
import React from 'react'

type AvatarProps = {
    src?: string | null
    alt?: string
    className?: string
}

export function Avatar({
                           src = null,
                           alt = '',
                           className,
                           ...props
                       }: AvatarProps & React.ComponentPropsWithoutRef<'div'>) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                'w-10 h-10 overflow-hidden bg-gray-300 rounded-full relative aspect-square'
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <span className="flex items-center justify-center text-gray-700">
          {/* Optional: Hinweis für leere Avatar-Bilder */}
        </span>
            )}
        </div>
    )
}