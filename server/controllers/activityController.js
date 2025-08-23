const ActivityLog = require('../models/ActivityLog');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get recent activities
// @route   GET /api/v1/admin/recent-activities
// @access  Private/Admin
exports.getRecentActivities = async (req, res, next) => {
    try {
        // Get activities, most recent first
        const activities = await ActivityLog.find({})
            .sort({ timestamp: -1 }) // Sort by most recent first
            .limit(10) // Limit to 10 most recent activities
            .populate('user', 'name email') // Include user details
            .lean();

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (err) {
        next(err);
    }
};
