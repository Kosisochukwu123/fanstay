/**
 * Seed script - populates the database with sample data for testing.
 * Run with: npm run seed
 *
 * Creates:
 *  - 1 admin, 2 hosts, 2 guests
 *  - 3 sporting events (FIFA World Cup style)
 *  - 4 properties near those events
 *  - 1 sample booking
 *  - 2 gift card providers
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Property = require('../models/Property');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const GiftCardProvider = require('../models/GiftCardProvider');
const Review = require('../models/Review');

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
    GiftCardProvider.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'FanStay Admin',
    email: 'admin@fanstay.com',
    password: 'Admin1234',
    role: 'admin',
    isHostVerified: true,
  });

  const host1 = await User.create({
    name: 'Carlos Rivera',
    email: 'host1@fanstay.com',
    password: 'Host1234',
    role: 'host',
    isHostVerified: true,
    hostApprovalStatus: 'approved',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  });

  const host2 = await User.create({
    name: 'Amara Okafor',
    email: 'host2@fanstay.com',
    password: 'Host1234',
    role: 'host',
    isHostVerified: true,
    hostApprovalStatus: 'approved',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
  });

  const guest1 = await User.create({
    name: 'Jamie Lee',
    email: 'guest1@fanstay.com',
    password: 'Guest1234',
    role: 'guest',
    referralCode: 'JAMIE001',
  });

  const guest2 = await User.create({
    name: 'Priya Sharma',
    email: 'guest2@fanstay.com',
    password: 'Guest1234',
    role: 'guest',
    referralCode: 'PRIYA001',
  });

  console.log('Creating events...');
  const event1 = await Event.create({
    eventName: 'FIFA World Cup 2026 - Opening Match',
    sport: 'Football',
    city: 'New York',
    country: 'USA',
    stadium: 'MetLife Stadium',
    coordinates: { lat: 40.8136, lng: -74.0744 },
    eventDate: new Date('2026-06-11'),
    endDate: new Date('2026-06-11'),
    description: 'The opening match of the FIFA World Cup 2026, hosted at MetLife Stadium in New Jersey.',
    isFeatured: true,
  });

  const event2 = await Event.create({
    eventName: 'FIFA World Cup 2026 - Group Stage Match',
    sport: 'Football',
    city: 'Los Angeles',
    country: 'USA',
    stadium: 'SoFi Stadium',
    coordinates: { lat: 33.9535, lng: -118.3392 },
    eventDate: new Date('2026-06-15'),
    description: 'A thrilling group stage clash at the iconic SoFi Stadium.',
    isFeatured: true,
  });

  const event3 = await Event.create({
    eventName: 'FIFA World Cup 2026 - Quarter Final',
    sport: 'Football',
    city: 'Mexico City',
    country: 'Mexico',
    stadium: 'Estadio Azteca',
    coordinates: { lat: 19.3029, lng: -99.1505 },
    eventDate: new Date('2026-07-04'),
    description: 'Quarter-final showdown at the historic Estadio Azteca.',
    isFeatured: false,
  });

  console.log('Creating properties...');
  const property1 = await Property.create({
    title: 'Modern Loft Near MetLife Stadium',
    description: 'A stylish 2-bedroom loft just 10 minutes from MetLife Stadium. Perfect for catching the World Cup opener.',
    location: { address: '123 Stadium Way', city: 'New York', country: 'USA' },
    coordinates: { lat: 40.82, lng: -74.07 },
    nearbyEvent: event1._id,
    amenities: ['WiFi', 'Kitchen', 'Free Parking', 'Air Conditioning', 'TV'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', publicId: 'sample/loft1' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', publicId: 'sample/loft2' },
    ],
    pricePerNight: 220,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    host: host1._id,
    rating: { average: 4.7, count: 12 },
  });

  const property2 = await Property.create({
    title: 'Cozy Apartment 5 mins from SoFi Stadium',
    description: 'A bright, cozy 1-bedroom apartment within walking distance of SoFi Stadium. Ideal for solo travelers or couples.',
    location: { address: '456 Inglewood Ave', city: 'Los Angeles', country: 'USA' },
    coordinates: { lat: 33.95, lng: -118.34 },
    nearbyEvent: event2._id,
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Pool', 'Pet Friendly'],
    images: [
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb', publicId: 'sample/apt1' },
      { url: 'https://images.unsplash.com/photo-1502672023488-70e25813eb7b', publicId: 'sample/apt2' },
    ],
    pricePerNight: 180,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    host: host2._id,
    rating: { average: 4.9, count: 25 },
  });

  const property3 = await Property.create({
    title: 'Luxury Villa with Pool - LA',
    description: 'Spacious luxury villa with a private pool, perfect for groups attending the World Cup matches in LA.',
    location: { address: '789 Sunset Blvd', city: 'Los Angeles', country: 'USA' },
    coordinates: { lat: 34.0, lng: -118.3 },
    nearbyEvent: event2._id,
    amenities: ['WiFi', 'Pool', 'Free Parking', 'Kitchen', 'Air Conditioning', 'Hot Tub'],
    images: [
      { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', publicId: 'sample/villa1' },
      { url: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c', publicId: 'sample/villa2' },
    ],
    pricePerNight: 540,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    host: host1._id,
    rating: { average: 5.0, count: 8 },
  });

  const property4 = await Property.create({
    title: 'Charming Casa near Estadio Azteca',
    description: 'A traditional Mexican-style home just a short walk from Estadio Azteca, with a beautiful courtyard.',
    location: { address: '12 Calle Azteca', city: 'Mexico City', country: 'Mexico' },
    coordinates: { lat: 19.3, lng: -99.15 },
    nearbyEvent: event3._id,
    amenities: ['WiFi', 'Kitchen', 'Garden', 'Breakfast Included'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', publicId: 'sample/casa1' },
      { url: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f', publicId: 'sample/casa2' },
    ],
    pricePerNight: 95,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    host: host2._id,
    rating: { average: 4.5, count: 6 },
  });

  console.log('Creating sample booking...');
  const booking1 = await Booking.create({
    property: property1._id,
    guest: guest1._id,
    host: host1._id,
    checkIn: new Date('2026-06-10'),
    checkOut: new Date('2026-06-13'),
    guestsCount: 2,
    totalAmount: 660,
    currency: 'USD',
    paymentMethod: 'crypto',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
  });

  console.log('Creating sample review...');
  await Review.create({
    property: property1._id,
    user: guest1._id,
    booking: booking1._id,
    rating: 5,
    comment: 'Amazing location, walking distance to the stadium! Host was very responsive.',
  });

  console.log('Creating gift card providers...');
  await GiftCardProvider.create({
    name: 'Amazon',
    instructions: 'Upload a clear photo of your Amazon gift card and enter the code on the back.',
    isActive: true,
  });
  await GiftCardProvider.create({
    name: 'Apple',
    instructions: 'Upload a clear photo of your Apple gift card and enter the redemption code.',
    isActive: true,
  });

  console.log('\nSeed complete!');
  console.log('-----------------------------------');
  console.log('Admin login:  admin@fanstay.com / Admin1234');
  console.log('Host login:   host1@fanstay.com / Host1234');
  console.log('Host login:   host2@fanstay.com / Host1234');
  console.log('Guest login:  guest1@fanstay.com / Guest1234');
  console.log('Guest login:  guest2@fanstay.com / Guest1234');
  console.log('-----------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
