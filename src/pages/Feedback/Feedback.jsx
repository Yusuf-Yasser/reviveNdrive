import React, { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }
    // هنا ممكن تبعت الداتا للـ API
    alert(`Thank you for your feedback!\nRating: ${rating}\nComment: ${comment}`);
    // ممكن تفرغ الحقول بعد الإرسال
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mt-20 mx-auto p-6 bg-white shadow rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Rate the Mechanic</h2>

      <div className="flex justify-center space-x-2 text-yellow-400 text-4xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            starId={star}
            rating={rating}
            hover={hover}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <div>
        <label htmlFor="comment" className="block mb-1 font-medium text-gray-700">
          Your Feedback
        </label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition duration-300"
      >
        Submit Feedback
      </button>
    </form>
  );
};

const Star = ({ starId, rating, hover, onMouseEnter, onMouseLeave, onClick }) => {
  const fill = starId <= (hover || rating) ? "★" : "☆";
  return (
    <button
      type="button"
      className="focus:outline-none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      aria-label={`Rate ${starId} star${starId > 1 ? "s" : ""}`}
    >
      <span className="select-none">{fill}</span>
    </button>
  );
};

export default Feedback;
