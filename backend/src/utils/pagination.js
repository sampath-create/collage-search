const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const parseSort = (sort) => {
  switch (sort) {
    case "rating_asc":
      return { rating: 1 };
    case "rating_desc":
      return { rating: -1 };
    case "fees_asc":
      return { fees: 1 };
    case "fees_desc":
      return { fees: -1 };
    case "name_asc":
      return { name: 1 };
    case "name_desc":
      return { name: -1 };
    default:
      return { rating: -1 };
  }
};

module.exports = { parsePagination, parseSort };
