require('dotenv').config();
const mongoose = require('mongoose');
const Poster = require('./models/Poster');

const defaultPosters = [
    { 
        meta: '01 — EDUCATION POSTER', 
        title: 'Early Years & Literacy Drive', 
        desc: 'Building strong foundational skills in early childhood to ensure lifelong learning and success for every child in our rural districts.', 
        date: 'Oct 15, 2026', 
        time: '10:00 AM - 2:00 PM', 
        loc: 'Rural Schools, Delhi', 
        images: ['indian_children_education_1790095446949.jpg', 'indian_classroom_learning_1790095619380.jpg', 'indian_children_outdoor_1790095586676.jpg'] 
    },
    { 
        meta: '02 — SKILLS POSTER', 
        title: 'Youth Vocational Training', 
        desc: 'Equipping young adults with industry-relevant skills and hands-on experience to confidently enter the modern, digital workforce.', 
        date: 'Nov 02, 2026', 
        time: '09:00 AM - 5:00 PM', 
        loc: 'Vocational Center, Mumbai', 
        images: ['indian_youth_skills_1790095480885.jpg', 'indian_child_tech_1790095546513.jpg', 'indian_children_community_1790095516040.jpg'] 
    },
    { 
        meta: '03 — COMMUNITY POSTER', 
        title: "Women's Leadership Forum", 
        desc: 'Empowering women to take active leadership roles within their communities, local government, and entrepreneurial sectors.', 
        date: 'Nov 18, 2026', 
        time: '11:00 AM - 4:00 PM', 
        loc: 'Town Hall, Bangalore', 
        images: ['indian_children_community_1790095516040.jpg', 'indian_children_outdoor_1790095586676.jpg', 'indian_youth_skills_1790095480885.jpg'] 
    },
    { 
        meta: '04 — TECHNOLOGY POSTER', 
        title: 'Community Tech Access Setup', 
        desc: 'Bridging the digital divide by bringing high-speed internet, modern computing tools, and digital literacy to remote areas.', 
        date: 'Dec 05, 2026', 
        time: 'All Day Event', 
        loc: 'Multiple Districts', 
        images: ['indian_child_tech_1790095546513.jpg', 'indian_classroom_learning_1790095619380.jpg', 'indian_children_education_1790095446949.jpg'] 
    }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
      console.log("Connected. Seeding Poster data...");
      const count = await Poster.countDocuments();
      if (count === 0) {
          await Poster.insertMany(defaultPosters);
          console.log("Successfully seeded default posters.");
      } else {
          console.log("Posters already exist. Skipping seed.");
      }
      process.exit();
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
