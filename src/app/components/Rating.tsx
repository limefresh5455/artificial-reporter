import { Star } from 'lucide-react'; // Use your icon or replace with another

const RatingStars = ({
    averageRating,
    ratingCount,
    removeText = false
}: {
    averageRating: number;
    ratingCount: number;
    removeText?:boolean;
}) => {
    const totalStars = 5;

    // If there are no reviews
    if (!ratingCount || ratingCount === 0) {
        return (
            <div className="flex items-center text-gray-500 text-sm">
                No reviews yet
            </div>
        );
    }

    const filledStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - filledStars >= 0.5;

    return (
        <div className="flex items-center gap-[2px] text-yellow-500">
            {[...Array(filledStars)].map((_, i) => (
                <Star key={`star-filled-${i}`} fill="currentColor" className="w-4 h-4" />
            ))}

            {hasHalfStar && (
                <Star fill="currentColor" className="w-4 h-4 opacity-50" />
            )}

            {[...Array(totalStars - filledStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Star key={`star-empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}

            {removeText == false ? (
                <span className="text-sm text-gray-600 ml-2">({ratingCount} reviews)</span>
            ) : ''}


        </div>
    );
};

export default RatingStars;
