const mongoose = require('mongoose');

const hospitalitySubmissionSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },

  packageName:{
    type:String,
    required:true
  },

  paymentMethod:{
    type:String,
    enum:['giftcard','crypto'],
    required:true
  },

  giftCardImage:{
    type:String,
    default:''
  },

  giftCardAmount:{
    type:Number,
    default:0
  },

  cryptoAmount:{
    type:Number,
    default:0
  },

  cryptoAddress:{
    type:String,
    default:''
  },

  status:{
    type:String,
    enum:['pending','approved','rejected'],
    default:'pending'
  }
},
{timestamps:true}
);

module.exports = mongoose.model(
'HotelitySubmission',
hospitalitySubmissionSchema
);