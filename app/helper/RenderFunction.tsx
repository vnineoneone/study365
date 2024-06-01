import { StarIcon } from '@heroicons/react/20/solid';


export function renderStars(rating: number) {

    return (
        <div className="flex items-center mt-10">
            {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                    key={index + 1}
                    className={`text-${index + 1 <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
                />
            ))}
            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-2 py-0.5 rounded">{rating.toFixed(1)}</span>
        </div>
    )
};

export function renderOnlyStar(rating: number) {

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                    key={index + 1}
                    className={`text-${index + 1 <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
                />
            ))}
        </div>
    )
};