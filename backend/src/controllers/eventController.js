const Event = require('../models/Event');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Create sporting event
// @route   POST /api/events
// @access  Private (admin)
exports.createEvent = asyncHandler(async (req, res) => {
  let image = { url: '', publicId: '' };
  if (req.file) {
    image = await uploadBufferToCloudinary(req.file.buffer, 'fanstay/events');
  }

  const event = await Event.create({ ...req.body, image });
  res.status(201).json({ success: true, event });
});

// @desc    Get all events (with optional search by city/name and upcoming filter)
// @route   GET /api/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res) => {
  const { city, search, upcoming, featured, page = 1, limit = 12 } = req.query;
  const query = {};

  if (city) query.city = { $regex: city, $options: 'i' };
  if (search) query.eventName = { $regex: search, $options: 'i' };
  if (upcoming === 'true') query.eventDate = { $gte: new Date() };
  if (featured === 'true') query.isFeatured = true;

  const skip = (Number(page) - 1) * Number(limit);

  const [events, total] = await Promise.all([
    Event.find(query).sort('eventDate').skip(skip).limit(Number(limit)),
    Event.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    events,
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  res.status(200).json({ success: true, event });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (admin)
exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

  const updatable = ['eventName', 'sport', 'city', 'country', 'stadium', 'coordinates', 'eventDate', 'endDate', 'description', 'isFeatured'];
  updatable.forEach((f) => {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  });

  if (req.file) {
    if (event.image?.publicId) await deleteFromCloudinary(event.image.publicId);
    event.image = await uploadBufferToCloudinary(req.file.buffer, 'fanstay/events');
  }

  await event.save();
  res.status(200).json({ success: true, event });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (admin)
exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

  if (event.image?.publicId) await deleteFromCloudinary(event.image.publicId);
  await event.deleteOne();

  res.status(200).json({ success: true, message: 'Event deleted' });
});
