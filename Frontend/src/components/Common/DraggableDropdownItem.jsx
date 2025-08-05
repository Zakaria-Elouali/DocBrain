import React from "react";

const DraggableDropdownItem = ({ activity, i18n, handleDragStart }) => {
  const itemStyle = {
    cursor: "move",
  };

  return (
    <div
      draggable
      onDragStart={(event) => handleDragStart(event, activity)}
      style={itemStyle}
    >
      {i18n.language === "ar"
        ? activity.arabicName ?? activity.englishName
        : activity.englishName ?? activity.arabicName}
      {" - "}{" "}
      {activity.tempRoleName ??
        (i18n.language === "ar"
          ? activity.roleArabicName
          : activity.roleEnglishName)}
    </div>
  );
};

export default DraggableDropdownItem;
