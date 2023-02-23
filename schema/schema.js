//const { project , clients  } = require('../sampleData')
const { db } = require("../Firebaseconfig");
const bcrypt = require("bcrypt");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLNumber,
  GraphQLBoolean,
  GraphQLIn,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLEnumType,
  Int,
} = require("graphql");
const Order_data = new GraphQLObjectType({
  name: "Orderdata",
  fields: () => ({
    quantity: { type: GraphQLFloat },
    Price: { type: GraphQLFloat },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    images: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "order",
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    phone: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    town: { type: GraphQLString },
    postal_code: { type: GraphQLString },
    state: { type: GraphQLString },
    Order_data: {
      type: GraphQLList(Order_data),
      resolve: async (parent, args) => {
        const data = await parent.Order_data.map((product) => {
          return product;
        });
        return data;
      },
    },
  }),
});

const FoodProductReviewsType = new GraphQLObjectType({
  name: "Reviews",
  fields: () => ({
    _id: { type: GraphQLID },
    ReviewerName: { type: GraphQLString },
    ReviewerProfile: { type: GraphQLString },
    Reviewe: { type: GraphQLString },
    Rating: { type: GraphQLFloat },
  }),
});
const FoodRating = new GraphQLObjectType({
  name: "Rating",
  fields: () => ({
    RATING: { type: GraphQLFloat },
  }),
});
const FoodRatingInput = new GraphQLInputObjectType({
  name: "RatingInput",
  fields: () => ({
    RATING: { type: GraphQLFloat },
  }),
});
const FoodProductReviewsInput = new GraphQLInputObjectType({
  name: "ReviewsInput",
  fields: () => ({
    _id: { type: GraphQLID },
    ReviewerName: { type: GraphQLString },
    ReviewerProfile: { type: GraphQLString },
    Reviewe: { type: GraphQLString },
    Rating: { type: GraphQLFloat },
  }),
});
const UserBuyingProductInput = new GraphQLInputObjectType({
  name: "UserBuyingProductInput",
  fields: () => ({
    id: { type: GraphQLID },
    FoodImage: { type: GraphQLString },
    Price: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const RestuentsReviewsType = new GraphQLObjectType({
  name: "RestuentsReviews",
  fields: () => ({
    id: { type: GraphQLID },
    ReviewerName: { type: GraphQLString },
    ReviewerProfile: { type: GraphQLString },
    Reviewe: { type: GraphQLString },
    Rating: { type: GraphQLNumber },
  }),
});

const FoodProductsType = new GraphQLObjectType({
  name: "FoodProducts",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    Price: { type: GraphQLString },
    FoodImage: { type: GraphQLString },
    Popular: { type: GraphQLString },
    Foodinfo: { type: GraphQLString },
    FoodReviews: {
      type: GraphQLList(FoodProductReviewsType),
      resolve: async (parent, args) => {
        const data = await parent.FoodReviews.map((product) => {
          return product;
        });
        return data;
      },
    },
    CanOrder: { type: GraphQLBoolean },
    Rating: {
      type: GraphQLList(FoodRating),
      resolve: async (parent, args) => {
        const data = await parent.Rating.map((Rating) => {
          return Rating;
        });
        return data;
      },
    },
    Outofstock: { type: GraphQLString },
  }),
});

const UserBuyingProductType = new GraphQLObjectType({
  name: "UserBuyingProduct",
  fields: () => ({
    id: { type: GraphQLID },
    FoodImage: { type: GraphQLString },
    Price: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "Users",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    userProfile: { type: GraphQLString },
    TotalBuyingPrice: { type: GraphQLFloat },
    Userstatus: { type: GraphQLString },
    UserBuyingProduct: {
      type: GraphQLList(UserBuyingProductType),
      resolve: async (parent, args) => {
        const data = await parent.UserBuyingProduct.map((product) => {
          return product;
        });
        return data;
      },
    },
  }),
});

const RegisterType = new GraphQLObjectType({
  name: "Register",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    userProfile: { type: GraphQLString },
    TotalBuyingPrice: { type: GraphQLFloat },
    Userstatus: { type: GraphQLString },
    Password: { type: GraphQLNonNull(GraphQLString) },
    PhoneNumber: { type: GraphQLString },
    UserBuyingProduct: {
      type: GraphQLList(UserBuyingProductType),
      resolve: async (parent, args) => {
        const data = await parent.UserBuyingProduct.map((product) => {
          return product;
        });
        return data;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Users: {
      type: new GraphQLList(UserType),
      resolve: async (parents, args) => {
        const userRef = db.collection("Users");
        const Users = await userRef.get();

        Users.forEach((doc) => {
          //return doc.id
        });
        const user = await Users._materializedDocs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        return user;
      },
    },
    User: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: async (parents, args) => {
        const userRef = db.collection("Users").doc(args.id);
        const User = await userRef.get();

        return { ...User.data(), id: User.id };
      },
    },
    FoodProducts: {
      type: new GraphQLList(FoodProductsType),
      resolve: async (parents, args) => {
        const userRef = db.collection("FoodProducts");
        const FoodProducts = await userRef.get();
        FoodProducts.forEach((doc) => {
          //return doc.id
        });
        const FoodProductdata = await FoodProducts._materializedDocs.map(
          (doc) => {
            return { ...doc.data(), id: doc.id };
          }
        );
        return FoodProductdata;
      },
    },
    PromoteProducts: {
      type: new GraphQLList(FoodProductsType),
      resolve: async (parents, args) => {
        const userRef = db.collection("PromoteFood");
        const FoodProducts = await userRef.get();
        FoodProducts.forEach((doc) => {
          //return doc.id
        });
        const FoodProductdata = await FoodProducts._materializedDocs.map(
          (doc) => {
            return { ...doc.data(), id: doc.id };
          }
        );
        return FoodProductdata;
      },
    },
    FoodProduct: {
      type: FoodProductsType,
      args: { id: { type: GraphQLID } },
      resolve: async (parents, args) => {
        const userRef = db.collection("FoodProducts").doc(args.id);
        const User = await userRef.get();

        return { ...User.data(), id: User.id };
      },
    },

    User_Order: {
      type: OrderType,
      args: { id: { type: GraphQLID } },
      resolve: async (parents, args) => {
        const Order_Ref = db.collection("Users_Order").doc(args.id);
        const Order_data = await Order_Ref.get();

        return { ...Order_data.data(), id: args.id };
      },
    },
    User_Orders: {
      type: new GraphQLList(OrderType),
      resolve: async (parents, args) => {
        const Order_Ref = db.collection("Users_Order");
        const Order_data = await Order_Ref.get();
        Order_data.forEach((doc) => {
          //return doc.id
        });
        const Order_Product_data = await Order_data._materializedDocs.map(
          (doc) => {
            return { ...doc.data(), id: doc.id };
          }
        );

        return Order_Product_data;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    SinglePromoteProduct: {
      type: FoodProductsType,
      args: { id: { type: GraphQLID } },
      resolve: async (parents, args) => {
        const PromoteFoodRef = db.collection("PromoteFood").doc(args.id);
        const PromoteFood = await PromoteFoodRef.get();
        return { ...PromoteFood.data(), id: PromoteFood.id };
      },
    },
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        userProfile: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        TotalBuyingPrice: { type: GraphQLFloat },
        Userstatus: {
          type: new GraphQLEnumType({
            name: "Userstatus",
            values: {
              New: { value: "NewUser" },
            },
          }),
          defaultValue: "NewUser",
        },
        UserBuyingProduct: { type: GraphQLList(UserBuyingProductInput) },
      },
      resolve: async (parent, args) => {
        const UserREF = db.collection("Users");
        const EmailRef = await UserREF.where("email", "==", args.email).get();

        EmailRef.forEach((doc) => {});
        const FoundUser = await EmailRef._materializedDocs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        if (FoundUser.length) {
          return FoundUser[0];
        } else {
          const userRef = await db.collection("Users").add({
            name: args.name,
            userProfile: args.userProfile,
            email: args.email,
            TotalBuyingPrice: args.TotalBuyingPrice,
            Userstatus: args.Userstatus,
            UserBuyingProduct: args.UserBuyingProduct,
          });

          const data = db.collection("Users").doc(userRef.id);
          const complete = await data.get();

          return { ...complete.data(), id: userRef.id };
        }
      },
    },
    UpdateUserStatus: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        Userstatus: { type: GraphQLNonNull(GraphQLString) },
        UserRoles: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        if (args.UserRoles === "Manager" || args.UserRoles === "Admin") {
          const USER_REF = await db.collection("Users").doc(args.id).update({
            Userstatus: args.Userstatus,
          });
          return { id: args.id };
        } else {
          return;
        }
      },
    },
    registerUser: {
      type: RegisterType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        userProfile: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        Password: { type: GraphQLNonNull(GraphQLString) },
        PhoneNumber: { type: GraphQLString },
        TotalBuyingPrice: { type: GraphQLFloat },
        Userstatus: {
          type: new GraphQLEnumType({
            name: "Userstatus2",
            values: {
              New: { value: "NewUser" },
              Admin8765400744: { value: "Admin" },
            },
          }),
          defaultValue: "NewUser",
        },
        UserBuyingProduct: { type: GraphQLList(UserBuyingProductInput) },
      },
      resolve: async (parent, args) => {
        const UserREF = db.collection("Users");
        const EmailRef = await UserREF.where("email", "==", args.email).get();

        EmailRef.forEach((doc) => {});
        const FoundUser = await EmailRef._materializedDocs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        if (FoundUser.length) {
          return FoundUser[0];
        } else {
          const salt = await bcrypt.genSalt();
          const passwordHash = await bcrypt.hash(args.Password, salt);
          const userRef = await db.collection("Users").add({
            name: args.name,
            userProfile: args.userProfile,
            email: args.email,
            TotalBuyingPrice: args.TotalBuyingPrice,
            Password: passwordHash,
            PhoneNumber: args.PhoneNumber,
            Userstatus: args.Userstatus,
            UserBuyingProduct: args.UserBuyingProduct,
          });

          const data = db.collection("Users").doc(userRef.id);
          const complete = await data.get();

          return { ...complete.data(), id: userRef.id };
        }
      },
    },
    Login: {
      type: RegisterType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        Password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        if (!args.Password || !args.email)
          return { error: "Email and Password Not Found ?" };
        const UserREF = db.collection("Users");
        const EmailRef = await UserREF.where("email", "==", args.email).get();

        EmailRef.forEach((doc) => {});
        const FoundUserPassword = await EmailRef._materializedDocs.map(
          (doc) => {
            return { Password: doc.data().Password };
          }
        );
        const FoundUser = await EmailRef._materializedDocs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        const match = await bcrypt.compare(
          args.Password,
          FoundUserPassword[0].Password
        );
        if (!match) return "Unauthorized";
        const accessToken = jwt.sign(
          {
            Login: {
              name: FoundUser[0].name,
              userProfile: FoundUser[0].userProfile,
              email: FoundUser[0].email,
              PhoneNumber: FoundUser[0].PhoneNumber,
              Userstatus: FoundUser[0].Userstatus,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { name: FoundUser[0].name },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        // Create secure cookie with refresh token
        res.cookie("jwt", refreshToken, {
          httpOnly: true, //accessible only by web server
          secure: true, //https
          sameSite: "None", //cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
        });
      },
    },
    addProduct: {
      type: FoodProductsType,
      args: {
        roles: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        FoodImage: { type: GraphQLNonNull(GraphQLString) },
        Foodinfo: { type: GraphQLNonNull(GraphQLString) },
        Outofstock: { type: GraphQLNonNull(GraphQLString) },
        Price: { type: GraphQLNonNull(GraphQLString) },
        Rating: { type: new GraphQLList(FoodRatingInput) },
        CanOrder: { type: GraphQLBoolean },
        Popular: { type: GraphQLString },
        FoodReviews: { type: new GraphQLList(FoodProductReviewsInput) },
      },
      resolve: async (parent, args) => {
        if (args.roles !== "Admin" || args.roles !== "Manager") return;
        const ProductRef = await db.collection("FoodProducts").add({
          name: args.name,
          FoodImage: args.FoodImage,
          Foodinfo: args.Foodinfo,
          Outofstock: args.Outofstock,
          Price: args.Price,
          Rating: args.Rating,
          CanOrder: args.CanOrder,
          Popular: args.Popular,
          FoodReviews: args.FoodReviews,
        });

        const data = db.collection("FoodProducts").doc(ProductRef.id);
        const complete = await data.get();
        return { ...complete.data(), id: ProductRef.id };
      },
    },
    deleteProduct: {
      type: FoodProductsType,
      args: {
        roles: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        if (args.roles === "Admin" || args.roles === "Manager") {
          const ProductRef = db.collection("FoodProducts").doc(args.id);
          const Product = await ProductRef.get();
          ProductRef.delete();
          return { ...Product.data(), id: args.id };
        } else {
          return;
        }
      },
    },
    deleteOrder: {
      type: FoodProductsType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const ProductRef = db.collection("Users_Order").doc(args.id);
        const Product = await ProductRef.get();
        ProductRef.delete();
        return { ...Product.data(), id: args.id };
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        roles: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        if (args.roles === "Admin" || args.roles === "Manager") {
          const userRef = db.collection("Users").doc(args.id);
          const User = await userRef.get();
          userRef.delete();
          return { id: args.id };
        } else {
          return;
        }
      },
    },
    addPromoteProduct: {
      type: FoodProductsType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        FoodImage: { type: GraphQLNonNull(GraphQLString) },
        Foodinfo: { type: GraphQLNonNull(GraphQLString) },
        Outofstock: { type: GraphQLNonNull(GraphQLString) },
        Price: { type: GraphQLNonNull(GraphQLString) },
        Rating: { type: new GraphQLList(FoodRatingInput) },
        CanOrder: { type: GraphQLBoolean },
        Popular: { type: GraphQLString },
        FoodReviews: { type: new GraphQLList(FoodProductReviewsInput) },
      },
      resolve: async (parent, args) => {
        const ProductRef = await db.collection("PromoteFood").add({
          name: args.name,
          FoodImage: args.FoodImage,
          Foodinfo: args.Foodinfo,
          Outofstock: args.Outofstock,
          Price: args.Price,
          Rating: args.Rating,
          CanOrder: args.CanOrder,
          Popular: args.Popular,
          FoodReviews: args.FoodReviews,
        });

        const data = db.collection("PromoteFood").doc(ProductRef.id);
        const complete = await data.get();
        return { ...complete.data(), id: ProductRef.id };
      },
    },
    deletePromoteProduct: {
      type: FoodProductsType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const ProductRef = db.collection("PromoteFood").doc(args.id);
        const Product = await ProductRef.get();
        ProductRef.delete();
        return { ...Product.data(), id: args.id };
      },
    },
    UpdatePromoteProduct: {
      type: FoodProductsType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        FoodImage: { type: GraphQLString },
        Foodinfo: { type: GraphQLString },
        Outofstock: { type: GraphQLString },
        Price: { type: GraphQLString },
        Rating: { type: new GraphQLList(FoodRatingInput) },
        CanOrder: { type: GraphQLBoolean },
        Popular: { type: GraphQLString },
        FoodReviews: { type: new GraphQLList(FoodProductReviewsInput) },
      },
      resolve: async (parent, args) => {
        const ProductRef = await db.collection("PromoteFood").doc(args.id);
        const Product_data = await ProductRef.get();
        const lastdata = Product_data.data();

        const PRODUCT_REF = await db
          .collection("PromoteFood")
          .doc(args.id)
          .update({
            name: args.name ? args.name : lastdata.name,
            FoodImage:
              args.FoodImage !== "undefined"
                ? args.FoodImage
                : lastdata.FoodImage,
            Foodinfo: args.Foodinfo ? args.Foodinfo : lastdata.Foodinfo,
            Outofstock: args.Outofstock ? args.Outofstock : lastdata.Outofstock,
            Price: args.Price ? args.Price : lastdata.Price,
            Rating: args.Rating ? args.Rating : lastdata.Rating,
            CanOrder:
              args.CanOrder === false || args.CanOrder === true
                ? args.CanOrder
                : lastdata.CanOrder,
            Popular: args.Popular ? args.Popular : lastdata.Popular,
            FoodReviews: args.FoodReviews
              ? args.FoodReviews
              : lastdata.FoodReviews,
          });
        const ProductRef2 = db.collection("PromoteFood").doc(args.id);
        const Product_data2 = await ProductRef.get();
        return { ...Product_data2.data(), id: Product_data2.id };
      },
    },
    UpdateProduct: {
      type: FoodProductsType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        FoodImage: { type: GraphQLString },
        Foodinfo: { type: GraphQLString },
        Outofstock: { type: GraphQLString },
        Price: { type: GraphQLString },
        Rating: { type: new GraphQLList(FoodRatingInput) },
        CanOrder: { type: GraphQLBoolean },
        Popular: { type: GraphQLString },
        FoodReviews: { type: new GraphQLList(FoodProductReviewsInput) },
      },
      resolve: async (parent, args) => {
        const ProductRef = await db.collection("FoodProducts").doc(args.id);
        const Product_data = await ProductRef.get();
        const lastdata = Product_data.data();

        const PRODUCT_REF = await db
          .collection("FoodProducts")
          .doc(args.id)
          .update({
            name: args.name ? args.name : lastdata.name,
            FoodImage:
              args.FoodImage !== "undefined"
                ? args.FoodImage
                : lastdata.FoodImage,
            Foodinfo: args.Foodinfo ? args.Foodinfo : lastdata.Foodinfo,
            Outofstock: args.Outofstock ? args.Outofstock : lastdata.Outofstock,
            Price: args.Price ? args.Price : lastdata.Price,
            Rating: args.Rating ? args.Rating : lastdata.Rating,
            CanOrder:
              args.CanOrder === false || args.CanOrder === true
                ? args.CanOrder
                : lastdata.CanOrder,
            Popular: args.Popular ? args.Popular : lastdata.Popular,
            FoodReviews: args.FoodReviews
              ? args.FoodReviews
              : lastdata.FoodReviews,
          });
        const ProductRef2 = db.collection("FoodProducts").doc(args.id);
        const Product_data2 = await ProductRef.get();
        return { ...Product_data2.data(), id: Product_data2.id };
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
