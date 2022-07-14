import { createRouter } from "next-connect";
import db from "../../../middleware/db";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

const router = createRouter<NextApiRequest, NextApiResponse>();

router
  .use(db)
  .get(async (req, res) => {
    if (!req.session.user) {
      throw new Error("Not Authenticated");
    }

    const { requestId } = req.query;
    const request = await req.db
      .collection("requests")
      .findOne({ _id: requestId as string });
    return res.status(200).json({ request });
  })
  .put(async (req, res) => {
    const { requestId } = req.query;
    const approvalStatus = req.body.request.approvalStatus;
    const approvalBy = req.body.request.approvalBy;
    const approvalAt = req.body.request.approvalAt;
    const approvalNote = req.body.request.approvalNote;
    const result = await req.db.collection("requests").updateOne(
      { _id: new ObjectId(requestId as string) },
      {
        $set: { approvalStatus, approvalBy, approvalAt, approvalNote },
      }
    );
    console.log(result);
    return res.status(200).json({ updated: true });
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
