import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  ownedbyuser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const BlogModel = mongoose.model("blog", blogSchema);

export default BlogModel;
