import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Name is required
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Email is required
    unique: true, // Email must be unique
    trim: true, // Trim whitespace from the email
    // Basic email validation using a regex
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // Password is required
    minlength: [6, 'Password must be at least 6 characters long'], // Minimum password length
  },
  profilePicture: {
    type: String,
    default: "/profile-pics/13848365.jpg"
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    default: "Btech",
  },
  branch: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
  },
  college: {
    type: String,
    required: false,
    default: "University of Lucknow",
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'operator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: false
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'User',
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'User',
    }
  ],
  uploads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'File',
    }
  ],
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'File',
    }
  ],
  comments: [
    {
      default: [],
      type: Object,
    }
  ],
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User