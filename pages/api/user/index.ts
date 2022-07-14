import { createRouter } from "next-connect";
import db from "../../../middleware/db";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(db).get((req, res) => {
  if (!req.session.user) {
    throw new Error("Not Authenticated");
  }
  return res.status(200).json({ user: req.session.user });
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
    },
  })
);
