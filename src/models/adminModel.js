const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const DataSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: true,
    },
    password: {type: String, required: true},
},{
    timestamps: true,
    versionKey: false,
});

DataSchema.pre("save",async function () {
    if(!this.isModified("password"));

    this.password = await bcrypt.hash(this.password,10);
});

const adminModel = mongoose.model("admins",DataSchema);

module.exports = adminModel;