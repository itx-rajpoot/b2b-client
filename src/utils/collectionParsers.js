export const parseVenues = (venues) => {
  if (!venues) return [];
  return Object.keys(venues)
    .filter((venueId) => venues[venueId])
    .map((venueId) => ({
      venueId,
      uid: venueId,
      ...venues[venueId],
    }));
};
export const parseOrders = (orders) => {
  if (!orders) return [];
  return Object.keys(orders)
    .filter((orderId) => orders[orderId])
    .map((orderId) => ({
      orderId,
      ...orders[orderId],
    }));
};
export const parseMenus = (menus) => {
  if (!menus) return [];
  return Object.keys(menus)
    .filter((menuId) => menus[menuId])
    .map((menuId) => ({
      menuId,
      ...menus[menuId],
    }));
};
export const parseItems = (item) => {
  if (!item) return [];
  return Object.keys(item)
    .filter((itemId) => item[itemId])
    .map((itemId) => ({
      itemId,
      ...item[itemId],
    }));
};
export const parseRewards = (rewards) => {
  if (!rewards) return [];
  return Object.keys(rewards)
    .filter((rewardId) => rewards[rewardId])
    .map((rewardId) => ({
      rewardId,
      ...rewards[rewardId],
    }));
};
export const parseReviews = (reviews) => {
  if (!reviews) return [];
  return Object.keys(reviews)
    .filter((reviewId) => reviews[reviewId])
    .map((reviewId) => ({
      reviewId,
      ...reviews[reviewId],
    }));
};
