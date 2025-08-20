const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// Save or update user profile
exports.saveProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;

        // Validate required fields
        if (!profileData.personalInfo || !profileData.personalInfo.name || !profileData.personalInfo.email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required fields'
            });
        }

        // Check if profile exists
        let profile = await UserProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile = await UserProfile.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        ...profileData,
                        updatedAt: Date.now()
                    }
                },
                { new: true, runValidators: true }
            );
        } else {
            // Create new profile
            profile = new UserProfile({
                userId,
                ...profileData
            });
            await profile.save();
        }

        // Update user's core fields if changed
        await User.findByIdAndUpdate(userId, {
            fullName: profileData.personalInfo.name,
            email: profileData.personalInfo.email,
            phoneNumber: profileData.personalInfo.mobile
        });

        res.status(200).json({
            success: true,
            message: 'Profile saved successfully',
            data: profile
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await UserProfile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Get all users' profiles
exports.getAllProfiles = async (req, res) => {
    try {
        // Get all users with their profiles (removed admin restriction)
        const users = await User.find({})
            .select('fullName email phoneNumber role createdAt')
            .lean();

        // Format the data for the frontend
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
            role: user.role,
            status: 'active',
            createdAt: user.createdAt,
            lastLogin: new Date()
        }));

        res.status(200).json({
            success: true,
            data: formattedUsers
        });
    } catch (error) {
        console.error('Error fetching all profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profiles',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
