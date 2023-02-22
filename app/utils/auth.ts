import { importSPKI, jwtVerify } from "jose";

const spki = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAy+mt6OKnaxgRWlZ9+2oY
fKGfVi3Go8clCOf+d8Ppt/KqFD+h63YhWqzGJ9Acc6ZqDagyQEZOso7XHgi1Yb2S
PJYRGIBtE4puI1edSs5kgxbc/LXkPYsI5XpYnHQrcMriwdBjXpggnl1CAWQiChWI
ZwQpvn8seILjoECE2mI20KLXrvqIrl4x+Gw1cf5nv34vZWFvugLqqHQm1OVobAEJ
2wODFMHde96IxiOT9bOZucg6ZeBV7IVx4RGwPnZxD+zQLZXwuYQoKdE6rwAnSS+L
npVME2hGBCRtRBHottUBC10zkpBePFPIbuUGm8ephoCG88AScT7dAM4E5JHBsyf2
+5siJOSfEw+FNFLOjWTBd0q617LZpO31BHVhMldcZTQnGakvZPwgKouPQRZ7CB0U
VsSyjUmnBR/s70KHdNvw30r4xb2DkbI8VWwC4pJRyABETC7yGrwg2yy9nah+PXqD
vXYCQC/RLboojjEg88Is46+qiaAZ77CMBQcsAHtgn4pnoUJcPOQd2wp4XiMh1bfV
uKi0siR/++ULUMo6AkE8b5HUN9wlmTtHuy5lZ9RSibzmW/CVsf0b54VzyxtlyZnv
OBm4UfB/82BnoO1dS+yXzqx41ZmdtgmIrV3zTalmWjV26kKkoYHR4IQD0/OgY9Z8
7S9MKDbCjkLSVBIGHwm7qvECAwEAAQ==
-----END PUBLIC KEY-----`;

export async function getUser(authorizationHeader: string | undefined) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  const jwt = authorizationHeader.split(" ")[1];
  try {
    const publicKey = await importSPKI(spki, "RS256");
    const { payload } = await jwtVerify(jwt || "", publicKey, {
      issuer: "app.dynamic.xyz/cb5b68a5-9b26-4a13-8893-8fbfa62b104b",
      audience: process.env.NEXT_PUBLIC_AUDIENCE,
    });

    return payload;
  } catch (error) {
    return null;
  }
}
