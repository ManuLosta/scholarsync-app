import React, { Dispatch, SetStateAction } from 'react';
import { Tabs, Tab } from '@nextui-org/react';

interface CustomTabsProps {
  setTabs: Dispatch<SetStateAction<string>>;
  selected: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ setTabs, selected }) => {
  return (
    <div className="flex flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key: string | number) => setTabs(key.toString())}
      >
        <Tab key="group" title="Groups"></Tab>
        <Tab key="question" title="Questions"></Tab>
        <Tab key="user" title="Users"></Tab>
      </Tabs>
    </div>
  );
};

export default CustomTabs;
