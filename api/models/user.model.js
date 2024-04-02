import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Favatar&psig=AOvVaw13Op3p6XZmKV3JL9fOX1Au&ust=1712132597817000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDe8JGNo4UDFQAAAAAdAAAAABAE"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;