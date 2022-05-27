import React, { useContext, useState, createContext } from "react";

interface NotificationContextType {
  notificationData: any;
  setNotificationData: (data: any) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const DefaultNotification = "Initial";

export const NotificationProvider: React.FC = ({ children }) => {
  const [notificationData, setNotificationData] =
    useState<any>(DefaultNotification);

  const contextData: NotificationContextType = {
    notificationData,
    setNotificationData,
  };

  return (
    <NotificationContext.Provider value={contextData}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (!context) throw new Error("Did you forget to use the Provider?");

  return context;
};
