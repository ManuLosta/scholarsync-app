export type FriendRequest = {
  from: Profile;
  to: Profile;
  notification_id: string;
  created_at: string;
  notificationType: string;
};

export type GroupInvite = {
  group_id: string;
  notification_id: string;
  title: string;
  owner_group: Profile;
  user_invited: Profile;
  notificationType: string;
};

export type Profile = {
  firstName: string;
  lastName: string;
  username: string;
  credits: number;
  level: string;
  xp: number;
  email: string;
  birthDate: string;
  createdAt: string;
  id: string;
  friends: {
    id: string;
    firstName: string;
    username: string;
  }[];
  groups: {
    id: string;
    title: string;
  }[];
};

export type Group = {
  createdBy: string;
  invitations: Array<{
    user_id: string;
  }>;
  description: string;
  id: string;
  isPrivate: boolean;
  title: string;
  users: Array<{
    firstName: string;
    lastName: string;
    id: string;
    username: string;
  }>;
};

export type Question = {
  id: string;
  author: Profile;
  content: string;
  createdAt: Date;
  groupId: string;
  groupTitle: string;
  title: string;
  files: FileType[];
};

export type Answer = {
  answerId: string;
  questionId: string;
  content: string;
  author: Profile;
  groupId: string;
  groupTitle: string;
  files: FileType[];
  createdAt: Date;
  ratings: Rating[];
};

export type Rating = {
  id: string;
  rating: number;
  userId: string;
};

export type FileType = {
  id: string;
  name: string;
  file_type: string;
};
