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
  };
};
