const mongoose = require("mongoose");

const giftCardSubmissionSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    match:{
        type:String,
        default:""
    },

    packageName:{
        type:String,
        default:""
    },

    category:{
        type:String,
        default:""
    },

    paymentMethod:{
        type:String,
        enum:["giftcard","crypto"],
        default:"giftcard"
    },

    giftCardImage:{
        type:String,
        default:""
    },

    giftCardAmount:{
        type:Number,
        default:0
    },

    cryptoAmount:{
        type:Number,
        default:0
    },

    walletAddress:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ],
        default:"pending"
    },

    adminNotes:{
        type:String,
        default:""
    },

    adminReviewedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    reviewedAt:{
        type:Date
    }

},
{
    timestamps:true
}
);

giftCardSubmissionSchema.index({
    status:1,
    createdAt:-1
});

giftCardSubmissionSchema.index({
    user:1
});

module.exports = mongoose.model(
    "GiftCardSubmission",
    giftCardSubmissionSchema
);