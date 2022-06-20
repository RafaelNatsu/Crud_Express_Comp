import mongoose from "mongoose";
// em mongoDb é guardado as coisas em coleções -> neste caso o nosso o nome é portifolio
mongoose.connect('mongodb://localhost:27017/portifolio'
// ,{
//     useNewUrlParse: true,
//     userUnifiedTtopology: true,
//     useCreateIndex: true,
//     // useFindAndModify: false
// }
);
mongoose.Promise = global.Promise;

export default mongoose;