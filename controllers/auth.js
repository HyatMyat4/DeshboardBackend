const { db } = require("../Firebaseconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Login = async (req, res) => {
  try {
    const { email, Password } = req.body;
    if (!Password || !email) {
      return res.status(404).json({ message: "Password and email Not Found" });
    }
    const UserREF = db.collection("Users");
    const EmailRef = await UserREF.where("email", "==", email).get();
    EmailRef.forEach((doc) => {});
    const FoundUserPassword = await EmailRef._materializedDocs.map((doc) => {
      return { Password: doc.data().Password };
    });
    const FoundUser = await EmailRef._materializedDocs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    const match = await bcrypt.compare(Password, FoundUserPassword[0].Password);
    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }
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
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { name: FoundUser[0].name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      secure: true, //https
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const Verify = async (req, res) => {
  try {
    const { email, Password } = req.body;
    if (!email || !Password)
      return res
        .status(404)
        .json({ message: "Password , email and StatusCode makeSure " });
    const UserREF = db.collection("Users");
    const EmailRef = await UserREF.where("email", "==", `${email}`).get();
    EmailRef.forEach((doc) => {});
    const FoundUserPassword = await EmailRef._materializedDocs.map((doc) => {
      return { Password: doc.data().Password };
    });
    const FoundUser = await EmailRef._materializedDocs.map((doc) => {
      return { Status: doc.data().Userstatus };
    });
    const match = await bcrypt.compare(Password, FoundUserPassword[0].Password);
    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (
      FoundUser[0].Status === "Admin" ||
      FoundUser[0].Status === "Manager" ||
      (FoundUser[0].Status === "Manber" && match)
    ) {
      return res.status(200).json({ Status: FoundUser[0].Status });
    } else {
      return res
        .status(401)
        .json({ message: "Soorty You are not Contain in Team!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  Login,
  Verify,
};
