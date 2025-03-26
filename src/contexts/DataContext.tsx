import React, { createContext, useContext, useState, useEffect } from "react";
import { Key, Message } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  keys: Key[];
  messages: Message[];
  addKey: (key: Omit<Key, "id" | "userId" | "createdAt">) => void;
  addMessage: (message: Omit<Message, "id" | "userId" | "createdAt">) => void;
  deleteKey: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [keys, setKeys] = useState<Key[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load data from localStorage on mount or when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Load keys
        const storedKeys = localStorage.getItem(`keys_${user.id}`);
        if (storedKeys) {
          setKeys(JSON.parse(storedKeys));
        }

        // Load messages
        const storedMessages = localStorage.getItem(`messages_${user.id}`);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        toast({
          title: "Error",
          description: "Failed to load your data",
          variant: "destructive",
        });
      }
    } else {
      // Clear data when logged out
      setKeys([]);
      setMessages([]);
    }
  }, [isAuthenticated, user, toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`keys_${user.id}`, JSON.stringify(keys));
    }
  }, [keys, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, isAuthenticated, user]);

  const addKey = (keyData: Omit<Key, "id" | "userId" | "createdAt">) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save keys",
        variant: "destructive",
      });
      return;
    }

    const newKey: Key = {
      id: `key_${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      ...keyData,
    };

    setKeys((prevKeys) => [...prevKeys, newKey]);

    toast({
      title: "Key saved",
      description: `Key "${keyData.name}" has been saved successfully`,
    });
  };

  const addMessage = (
    messageData: Omit<Message, "id" | "userId" | "createdAt">
  ) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save messages",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
      ...messageData,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    toast({
      title: `Message ${
        messageData.type === "encrypted" ? "encrypted" : "decrypted"
      }`,
      description: `The message has been saved to your account`,
    });
  };

  const deleteKey = (id: string) => {
    setKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));

    toast({
      title: "Key deleted",
      description: "The key has been removed from your account",
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );

    toast({
      title: "Message deleted",
      description: "The message has been removed from your account",
    });
  };

  return (
    <DataContext.Provider
      value={{
        keys,
        messages,
        addKey,
        addMessage,
        deleteKey,
        deleteMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
