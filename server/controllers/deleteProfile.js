const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// Delete user profile (admin only)
exports.deleteProfile = async (req, res) => {
    try {
        // Check if the requester is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only admin users can delete profiles'
            });
        }

        const userId = req.params.id;
        
        // Delete the profile
        const deletedProfile = await UserProfile.findOneAndDelete({ userId });
        
        if (!deletedProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Also delete the user account
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'User profile deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
