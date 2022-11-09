import { type NextApiRequest, type NextApiResponse } from "next";
import { signupSchema } from "../../../server/validator";

import { prisma } from "../../../server/db/client";


const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  // Input Validation
  if (!signupSchema.safeParse({ email, password })) return res.status(401).json({ success: false });

  const isExist = await prisma.user.findFirst({
    where: { email }
  });

  if (isExist) {
    return res.status(401).json({ success: false });
  } 

  try {
    const newUser = await prisma.user.create({
      data: { email, password }
    })

    res.status(200).json({ success: true, data: newUser });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

export default signup;
