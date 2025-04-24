const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(1),
    image: Joi.string().allow("", null),
    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic city",
        "mountains",
        "castles",
        "amazing pools",
        "camping",
        "farms",
        "arctic",
        "igloo",
        "other"
      )
      .required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// ✅ Correct way to export both schemas
module.exports = { listingSchema, reviewSchema };
