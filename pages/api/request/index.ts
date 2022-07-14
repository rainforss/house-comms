import { createRouter } from "next-connect";
import db from "../../../middleware/db";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../services/twilio";

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .use(db)
  .get(async (req, res) => {
    if (!req.session.user) {
      throw new Error("Not Authenticated");
    }
    const requests = await req.db.collection("requests").find().toArray();
    return res.status(200).json([...requests]);
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      throw new Error("Not Authenticated");
    }

    if (!req.body.request) {
      throw new Error("Missing Information");
    }

    const {
      requestedBy,
      requestedAt,
      requestType,
      requestReason,
      entranceAt,
      accessTo,
    } = req.body.request;

    const { insertedId } = await req.db.collection("requests").insertOne({
      requestedBy,
      requestedAt,
      requestType,
      requestReason,
      entranceAt,
      accessTo,
    });

    await client.messages.create({
      body: "Hi, there is a new access request awaiting your approval: https://localhost:3000",
      from: "+15878000528",
      to: "+15877785468",
    });

    return res.status(200).json({ insertedId });
  });

export default withSessionRoute(
  router.handler({
    onError: (err: any, req, res) => {
      console.log(err);
      if (err.message === "Not Authenticated") {
        return res.status(401).json({
          error: {
            name: "Not Authenticated",
            message: "You are not logged in.",
          },
        });
      }

      if (err.message === "Missing Information") {
        return res.status(400).json({
          error: {
            name: "Missing Information",
            message: "Missing request information.",
          },
        });
      }
    },
  })
);
