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

export type ChatNotification = {
  notification_id: string;
  chat_id: string;
  created_at: string;
  name: string;
  group: string;
  notificationType: string;
};

export type Profile = {
  hasPicture: boolean;
  firstName: string;
  lastName: string;
  username: string;
  credits: number;
  level: Level;
  xp: number;
  prevLevel: number;
  nextLevel: number;
  email: string;
  birthDate: string;
  createdAt: string;
  id: string;
  questions: number;
  answers: number;
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

export type Level =
  | 'Newbie'
  | 'Learner'
  | 'Initiate'
  | 'Contender'
  | 'Skilled'
  | 'Veteran'
  | 'Master'
  | 'Grand_Master'
  | 'Champion'
  | 'Legend';

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

export type Message = {
  sender: Profile;
  message: string;
  time: string;
};

export type Chat = {
  id: string;
  name: string;
  groupId: string;
  groupTitle: string;
  members: Profile[];
};

interface FileMessage {
  file: FileType;
  sender: Profile;
  time: string;
}

export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  groupId: string;
  groupName: string;
};
