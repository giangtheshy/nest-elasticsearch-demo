import * as mongoose from 'mongoose';
import { genSalt, hashSync, compare } from 'bcrypt';

export interface User {
  _id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  avatar: string;
  type: string;
  roles: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}
export enum UserType {
  DEFAULT = 'Default',
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
}
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'] },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'password is required'] },
    email: { type: String, required: [true, 'email is required'] },
    roles: { type: [String], default: [UserRole.USER] },
    type: { type: String, default: UserType.DEFAULT },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/giangtheshy/image/upload/v1618042500/dev/khumuivietnam/pcwl6uqwzepykmhnpuks.jpg',
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  let user = this as any;

  if (!user.isModified('password')) return next();

  const salt = await genSalt(10);

  const hash = await hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const user = this as any;
  return compare(candidatePassword, user.password).catch((e) => false);
};
