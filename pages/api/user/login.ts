import { createRouter } from "next-connect";
import db from "../../../middleware/db";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(db).post(async (req, res) => {
  if (!req.body.phoneNumber || !req.body.password) {
    throw new Error("Missing Credentials");
  }
  const user = await req.db
    .collection("users")
    .findOne({ phoneNumber: req.body.phoneNumber });

  if (!user) {
    throw new Error("Not Found");
  }

  const matched = await bcrypt.compare(req.body.password, user.password);

  if (!matched) {
    throw new Error("Credentials Mismatch");
  }

  req.session.user = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    floor: user.floor,
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
            message: "You are missing the phone number or password.",
          },
        });
      }
      if (err.message === "Credentials Mismatch") {
        return res.status(400).json({
          error: {
            name: "Credentials Mismatch",
            message: "Wrong credentials, please try again.",
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
    },
  })
);
