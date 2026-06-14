const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Upload/replace user avatar
// @route   POST /api/upload/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }

  const user = await User.findById(req.user._id);

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, 'fanstay/avatars');
  user.avatar = result;
  await user.save();

  res.status(200).json({ success: true, avatar: user.avatar });
});
