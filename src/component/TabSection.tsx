import React from "react";
import Button from "./Button/Button";

interface Tab {
  key: string;
  label: string;
}

interface TabSectionProps {
  active: string;
  onChange: (key: string) => void;
}

const TabSection: React.FC<TabSectionProps> = ({ active, onChange }) => {
  const tabs: Tab[] = [
    { key: "head", label: "Голова" },
    { key: "tors", label: "Торс" },
    { key: "hands", label: "Руки" },
    { key: "legs", label: "Ноги" },
    { key: "accessories", label: "Атрибут" },
  ];

  return (
    <section className="tab frame">
      {tabs.map((tab) => (
        <div className="container_btn" key={tab.key}>
          <Button
            isActive={active === tab.key}
            onClick={() => onChange(tab.key)}
            className="button"
          >
            {tab.label}
          </Button>
        </div>
      ))}
    </section>
  );
};

export default TabSection;
