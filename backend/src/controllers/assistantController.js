const Property = require('../models/Property');
const Event = require('../models/Event');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Simple rule-based AI travel assistant (bonus feature).
//          Suggests upcoming events and nearby properties based on a free-text query.
//          Can be swapped for an LLM API call (e.g. Anthropic/OpenAI) by replacing the
//          logic below with a real completion request.
// @route   POST /api/assistant/query
// @access  Public
exports.assistantQuery = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'message is required' });
  }

  const lower = message.toLowerCase();

  // Extract a possible city/event keyword from the message
  const events = await Event.find({
    eventDate: { $gte: new Date() },
    $or: [
      { eventName: { $regex: lower.split(' ').filter((w) => w.length > 3).join('|'), $options: 'i' } },
      { city: { $regex: lower.split(' ').filter((w) => w.length > 3).join('|'), $options: 'i' } },
    ],
  }).limit(3);

  let properties = [];
  if (events.length > 0) {
    properties = await Property.find({
      status: 'active',
      nearbyEvent: { $in: events.map((e) => e._id) },
    })
      .sort('-rating.average')
      .limit(4)
      .populate('host', 'name');
  } else {
    properties = await Property.find({ status: 'active' }).sort('-rating.average').limit(4);
  }

  const reply =
    events.length > 0
      ? `I found ${events.length} upcoming event(s) matching your query, and ${properties.length} top-rated stays nearby. Check them out below!`
      : `I couldn't find a specific event matching your query, but here are some of our top-rated stays you might like.`;

  res.status(200).json({
    success: true,
    reply,
    events,
    properties,
  });
});
