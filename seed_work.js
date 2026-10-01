require('dotenv').config();
const mongoose = require('mongoose');
const OurWork = require('./models/OurWork');

const defaultCards = [
    {
        number: "01",
        title: "Education",
        image: "indian_children_education_1790095446949.jpg",
        layout: "card-large",
        order: 1
    },
    {
        number: "02",
        title: "Skills &<br>Employability",
        image: "indian_youth_skills_1790095480885.jpg",
        layout: "",
        order: 2
    },
    {
        number: "03",
        title: "Community<br>Development",
        image: "indian_children_community_1790095516040.jpg",
        layout: "",
        order: 3
    },
    {
        number: "04",
        title: "Youth Development",
        image: "indian_children_outdoor_1790095586676.jpg",
        layout: "",
        order: 4
    },
    {
        number: "05",
        title: "Social Impact",
        image: "indian_child_tech_1790095546513.jpg",
        layout: "",
        order: 5
    },
    {
        number: "06",
        title: "Innovation",
        image: "indian_classroom_learning_1790095619380.jpg",
        layout: "card-wide",
        order: 6
    }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
      console.log("Connected. Seeding OurWork data...");
      await OurWork.deleteMany({});
      await OurWork.insertMany(defaultCards);
      console.log("Successfully seeded 6 default work cards.");
      process.exit();
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
