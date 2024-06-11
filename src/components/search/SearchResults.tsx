import React from 'react';
import { Group, Profile, Question } from '../../types/types';
import QuestionCard from './cards/QuestionCard';
import UserCard from './cards/UserCard';
import GroupCard from './cards/GroupCard';

type SearchResultProps = {
  questionResult: Question[];
  userResult: Profile[];
  groupResult: Group[];
  categoryForSearch: string;
};

const SearchResult: React.FC<SearchResultProps> = ({
  questionResult,
  userResult,
  groupResult,
  categoryForSearch,
}) => {
  const renderCards = () => {
    switch (categoryForSearch) {
      case 'question':
        return questionResult.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ));
      case 'user':
        return userResult.map((user) => (
          <UserCard key={user.id} profile={user} />
        ));
      case 'group':
        return groupResult.map((group) => (
          <GroupCard key={group.id} group={group} />
        ));
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Search Results</h2>
      {renderCards()}
    </div>
  );
};

export default SearchResult;
