import { BASKET, CANCELLED, COMPLETED, PAID } from "@/helpers/constants";
import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number
    }
  },
  { timestamps: true, _id: false }
);

const OrderSchema = new Schema(
  {
    orderItems: [OrderItemSchema],
    orderedOn: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        BASKET,
        PAID,
        COMPLETED,
        CANCELLED
      ]
    },
    payment: {
      reference: {
        type: String,
      },
      method: {
        type: String,
      },
    },
    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    charges: {
      type: Number
    },
    shippingDetails: {
      line1: {
        type: String,
      },
      line2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    phoneNumber: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    deliveredOn: {
      type: Date,
    },
    views: {
      type: Number
    }
  },
  { timestamps: true }
);

if (!mongoose.models?.Products) {
  require("./Products");
}

export default mongoose.models?.Orders || mongoose.model("Orders", OrderSchema);