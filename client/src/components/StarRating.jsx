function StarRating({ rating, size = 16 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="star" width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <svg key={i} className="star" width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${i}-${rating}`}>
              <stop offset="50%" stopColor="#de7921"/>
              <stop offset="50%" stopColor="#e0e0e0"/>
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i}-${rating})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="star empty" width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    }
  }

  return <div className="star-rating">{stars}</div>;
}

export default StarRating;
