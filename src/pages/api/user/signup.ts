import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  // Input Validation
  if (!email || !password) return res.status(401).json({ succeed: false });

  const isExist = await prisma.user.findFirst({
    where: { email }
  });

  if (isExist) {
    return res.status(401).json({ succeed: false });
  } 

  try {
    const newUser = await prisma.user.create({
      data: { email, password }
    })

    res.status(200).json({ succeed: true, data: newUser });
  } catch (e) {
    res.status(500).json({ succeed: false });
  }
};

export default signup;
