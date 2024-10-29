import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./data/schema";

const PORT = 8080;

const app = express();

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

class Product {
  constructor(id, { name, description, price, soldout, stores }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.soldout = soldout;
    this.stores = stores;
  }
}

const productDatabase = {};

const root = {
  product: () => {
    return {
      id: 1,
      name: "Cheese",
      description: "This is a piece of cheese",
      price: 2.5,
      soldout: false,
      stores: [{ store: "Walmart" }, { store: "Costco" }],
    };
  },
  createProduct: ({ input }) => {
    let id = require("crypto").randomBytes(10).toString("hex");
    productDatabase[id] = input;
    return new Product(id, input);
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on at http://localhost:${PORT}/graphql`);
});
