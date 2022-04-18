import bcrypt from 'bcryptjs';

export class HashingUtils {
  public static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  public static async compareHashedPassword(
    password: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
