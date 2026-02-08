
interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

export function Logo({ size = 'md', className = '', style = {} }: LogoProps) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
    };

    return (
        <svg
            className={`${sizes[size]} ${className}`}
            style={style}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Abstract Professional Logo - Isometric Geometry */}
            {/* Represents structure, dimension, and unfolding clarity */}

            {/* Top Face */}
            <path
                d="M50 10 L90 30 L50 50 L10 30 Z"
                fill="currentColor"
                opacity="1"
            />

            {/* Left Face */}
            <path
                d="M10 30 L50 50 L50 90 L10 70 Z"
                fill="currentColor"
                opacity="0.6"
            />

            {/* Right Face */}
            <path
                d="M50 50 L90 30 L90 70 L50 90 Z"
                fill="currentColor"
                opacity="0.4"
            />

            {/* Internal dividing lines for crisp definition */}
            <path d="M10 30 L50 50 L90 30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none" />
            <path d="M50 50 L50 90" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        </svg>
    );
}
