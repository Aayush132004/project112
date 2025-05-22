import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
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
  educationalInstitution: {
    type: String,
    required: true
  },
  educationLevel: {
    type: String,
    required: true,
   // Add more if needed
  },
  disability: {
    type: String,
    default: ''
  },role:{
    type : String ,
    
    required : true

  },
  password : {
    type : String,
    require : [true , "please provide password"]
  }
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// module.exports = Student;
export default Student;
