import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  authorName: { 
    type: String, 
    required: true 
  },
  authorEmail: { 
    type: String, 
    required: true 
  },
  tag: { 
    type: String, 
    default: 'ANALYSIS',
    uppercase: true
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Post', postSchema);