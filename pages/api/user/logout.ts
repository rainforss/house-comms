import { createRouter } from "next-connect";
import { withSessionRoute } from "../../../middleware/session";
import { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get((req, res) => {
  req.session.destroy();
  res.send({ ok: true });
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
