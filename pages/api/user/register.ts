import { createRouter } from "next-connect";
import db from "../../../middleware/db";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(db).post(async (req, res) => {
  const { phoneNumber, password, firstName, lastName, floor } = req.body.user;
  if (!phoneNumber || !password) {
    throw new Error("Missing Credentials");
  }

  const existingUser = await req.db
    .collection("users")
    .countDocuments({ phoneNumber: phoneNumber });

  if (existingUser > 0) {
    throw new Error("Phone Number Taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { insertedId } = await req.db.collection("users").insertOne({
    phoneNumber: phoneNumber,
    firstName: firstName,
    lastName: lastName,
    floor: floor,
    password: hashedPassword,
  });

  req.session.user = {
    _id: insertedId,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    floor: floor,
  };

  await req.session.save();
  return res.status(200).json({ ...req.session.user });
});

export default withSessionRoute(
  router.handler({
    onError: (err: any, req, res) => {
      console.log(err);
      if (err.message === "Missing Credentials") {
        return res.status(400).json({
          error: {
            name: "Missing Credentials",
            message: "You are missing the phone number or password",
          },
        });
      }
      if (err.message === "Not Found") {
        return res.status(404).json({
          error: {
            name: "User Not Found",
            message: "User with given phone number is not found",
          },
        });
      }
      if (err.message === "Not Authenticated") {
        return res.status(401).json({
          error: {
            name: "Not Authenticated",
            message: "You are not logged in.",
          },
        });
      }
      if (err.message === "Phone Number Taken") {
        return res.status(400).json({
          error: {
            name: "Phone Number Taken",
            message: "This phone number is already used in the system.",
          },
        });
      }
    },
  })
);
