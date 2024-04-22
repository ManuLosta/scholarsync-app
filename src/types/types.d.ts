export type FriendRequest = {
  from: string;
  to: string;
  id: string;
  created_at: string;
  notificationType: string;
};

export type GroupInvite = {
  id: string;
  name: string;
  ownerName: string;
  notificationType: string;
};
