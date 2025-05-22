// import mongoose from 'mongoose';

// const scribeSchema = new mongoose.Schema({
//   aadhaarNumber: {
//     type: String,
//     required: true,
   
//   },
//   fullName: {
//     type: String,
//     required: true
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
   
//   },
//   email: {
//     type: String,
   
//     default: ''
//   },
//   state: {
//     type: String,
//     required: true
//   },
//   district: {
//     type: String,
//     required: true
//   },
//   highestQualification: {
//     type: String,
//     required: true
//   },
//   institute: {
//     type: String,
//     required: true
//   },
//   subjectsOfExpertise: {
//     type: [String],
//     required: true
//   }
//   ,role:{
//     type : String ,
    
//     required : true

//   },
//   password : {
//     type : String,
//     require : [true , "please provide password"]
//   }
// }, { timestamps: true });

// export default mongoose.models.Scribe || mongoose.model('Scribe', scribeSchema);

import mongoose from 'mongoose';

const scribeSchema = new mongoose.Schema({
  aadhaarNumber: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  highestQualification: { // Changed to number
    type: String,
    required: true
  },
  institute: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: [true, "Please provide password"]
  },
  qualificationPdfLink: {
    type: String,
    required: true
  },
  availableDates: {
    type: [Date],
    default: []
  }
}, { timestamps: true });

export default mongoose.models.Scribe || mongoose.model('Scribe', scribeSchema);


