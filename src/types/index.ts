export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Key {
  id: string;
  userId: string;
  name: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  keyId?: string;
  createdAt: Date;
  type: "encrypted" | "decrypted";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  image: string;
  bio: string;
  isMentor: boolean;
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  details?: {
    rollNumber?: string;
    course?: string;
    stream?: string;
    section?: string;
    designation?: string;
    semester?: string;
  };
}

export interface KeyPair {
  publicKey: {
    e: bigint;
    n: bigint;
  };
  privateKey: {
    d: bigint;
    n: bigint;
  };
}
