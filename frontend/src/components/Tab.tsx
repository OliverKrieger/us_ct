import React from 'react';

interface TabData {
    status: string;
    region: string;
    roles: string[];
    results: {
        services: {
            database: boolean;
            redis: boolean;
        },
        stats:{
            servers_count: number;
            online: number,
            session: number
        }
    };
    strict: boolean;
    server_issue: string | null;
}

interface TabProps {
  tab: TabData;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ tab, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(tab.region)}
      className="tab-button"
      style={{
        backgroundColor: isActive ? '#ddd' : '#f1f1f1',
      }}
    >
      {tab.region}
    </button>
  );
};

export default Tab;
