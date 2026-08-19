let roomsCache = null;
let hotelCache = null;

export async function getRooms() {
  if (roomsCache) return roomsCache;
  const response = await fetch("/data/rooms.json");
  if (!response.ok) throw new Error("Unable to load room data.");
  roomsCache = await response.json();
  return roomsCache;
}

export async function getHotel() {
  if (hotelCache) return hotelCache;
  const response = await fetch("/data/hotels.json");
  if (!response.ok) throw new Error("Unable to load hotel data.");
  const data = await response.json();
  hotelCache = data.hotel;
  return hotelCache;
}

export async function getRoomById(id) {
  const rooms = await getRooms();
  return rooms.find((room) => room.id === id);
}
