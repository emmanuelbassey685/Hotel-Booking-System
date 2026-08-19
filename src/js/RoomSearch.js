export function searchRooms(rooms, criteria = {}) {
  const { guests = 1, type = "all" } = criteria;

  return rooms.filter((room) => {
    const guestMatch = room.maxGuests >= Number(guests || 1);
    const typeMatch = type === "all" || room.type === type;
    return guestMatch && typeMatch;
  });
}

export function sortRooms(rooms, sort = "recommended") {
  const sorted = [...rooms];

  if (sort === "price-asc") return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === "price-desc") return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === "guests-desc") return sorted.sort((a, b) => b.maxGuests - a.maxGuests);
  return sorted;
}
