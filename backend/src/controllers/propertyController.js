const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Event = require('../models/Event');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Create property listing
// @route   POST /api/properties
// @access  Private (host, admin)
exports.createProperty = asyncHandler(async (req, res) => {
  const body = req.body;

  let images = [];
  if (req.files && req.files.length > 0) {
    images = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer, 'fanstay/properties'))
    );
  }

  const property = await Property.create({
    title: body.title,
    description: body.description,
    location: {
      address: body.location?.address || body['location.address'],
      city: body.location?.city || body['location.city'],
      country: body.location?.country || body['location.country'],
    },
    coordinates: {
      lat: body.coordinates?.lat ?? body['coordinates.lat'],
      lng: body.coordinates?.lng ?? body['coordinates.lng'],
    },
    nearbyEvent: body.nearbyEvent || null,
    amenities: Array.isArray(body.amenities) ? body.amenities : (body.amenities ? body.amenities.split(',').map(a => a.trim()) : []),
    images,
    pricePerNight: body.pricePerNight,
    maxGuests: body.maxGuests || 1,
    bedrooms: body.bedrooms || 1,
    bathrooms: body.bathrooms || 1,
    host: req.user._id,
  });

  res.status(201).json({ success: true, property });
});

// @desc    Get all properties with search/filter/pagination
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    event,
    minPrice,
    maxPrice,
    amenities,
    minRating,
    checkIn,
    checkOut,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = req.query;

  const query = { status: 'active' };

  if (city) query['location.city'] = { $regex: city, $options: 'i' };

  if (event) {
    const matchedEvents = await Event.find({
      eventName: { $regex: event, $options: 'i' },
    }).select('_id');
    query.nearbyEvent = { $in: matchedEvents.map((e) => e._id) };
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  if (amenities) {
    const amenitiesArr = Array.isArray(amenities) ? amenities : amenities.split(',');
    query.amenities = { $all: amenitiesArr };
  }

  if (minRating) {
    query['rating.average'] = { $gte: Number(minRating) };
  }

  let propertyIdsToExclude = [];
  if (checkIn && checkOut) {
    const overlapping = await Booking.find({
      bookingStatus: { $in: ['pending', 'confirmed'] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    }).select('property');
    propertyIdsToExclude = overlapping.map((b) => b.property);
    if (propertyIdsToExclude.length > 0) {
      query._id = { $nin: propertyIdsToExclude };
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate('host', 'name avatar isHostVerified')
      .populate('nearbyEvent', 'eventName city eventDate')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    properties,
  });
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('host', 'name avatar isHostVerified createdAt')
    .populate('nearbyEvent');

  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  res.status(200).json({ success: true, property });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (host who owns it, admin)
exports.updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
  }

  const updatableFields = [
    'title', 'description', 'pricePerNight', 'maxGuests', 'bedrooms',
    'bathrooms', 'amenities', 'location', 'coordinates', 'nearbyEvent', 'status',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) property[field] = req.body[field];
  });

  // Add new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer, 'fanstay/properties'))
    );
    property.images.push(...newImages);
  }

  await property.save();

  res.status(200).json({ success: true, property });
});

// @desc    Delete a single image from a property
// @route   DELETE /api/properties/:id/images/:publicId
// @access  Private (host who owns it, admin)
exports.deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const publicId = decodeURIComponent(req.params.publicId);
  await deleteFromCloudinary(publicId);
  property.images = property.images.filter((img) => img.publicId !== publicId);
  await property.save();

  res.status(200).json({ success: true, property });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (host who owns it, admin)
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await Promise.all(property.images.map((img) => deleteFromCloudinary(img.publicId)));
  await property.deleteOne();

  res.status(200).json({ success: true, message: 'Property deleted' });
});

// @desc    Update availability calendar
// @route   PUT /api/properties/:id/availability
// @access  Private (host who owns it)
exports.updateAvailability = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { availabilityCalendar } = req.body; // array of { date, isAvailable }
  property.availabilityCalendar = availabilityCalendar;
  await property.save();

  res.status(200).json({ success: true, property });
});

// @desc    Get properties owned by logged-in host
// @route   GET /api/properties/host/mine
// @access  Private (host, admin)
exports.getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: properties.length, properties });
});

// @desc    Toggle favorite property
// @route   POST /api/properties/:id/favorite
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const user = await User.findById(req.user._id);
  const index = user.favorites.findIndex((f) => f.toString() === property._id.toString());

  let favorited;
  if (index === -1) {
    user.favorites.push(property._id);
    favorited = true;
  } else {
    user.favorites.splice(index, 1);
    favorited = false;
  }
  await user.save();

  res.status(200).json({ success: true, favorited });
});

// @desc    Get current user's favorite properties
// @route   GET /api/properties/favorites/mine
// @access  Private
exports.getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    populate: { path: 'host', select: 'name avatar' },
  });
  res.status(200).json({ success: true, favorites: user.favorites });
});
