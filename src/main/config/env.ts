export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb+srv://thiagoadsi:thiagoadsi@cluster0.mmxm1.mongodb.net/clean-node-api?retryWrites=true&w=majority',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
}
