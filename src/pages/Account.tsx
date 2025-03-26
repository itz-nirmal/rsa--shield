import React, { useState } from "react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Key, Lock, MessageSquare, Trash2 } from "lucide-react";

const BASE_PATH = "/rsa--shield/#/";

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const { keys, messages, deleteKey, deleteMessage } = useData();
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <GlassCard className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
            <p className="mb-4">Please sign in to view your account details.</p>
            <Button asChild>
              <a href={`${BASE_PATH}auth`}>Sign In</a>
            </Button>
          </GlassCard>
        </div>
      </Layout>
    );
  }

  const encryptedMessages = messages.filter((msg) => msg.type === "encrypted");
  const decryptedMessages = messages.filter((msg) => msg.type === "decrypted");

  const handleUpdateProfile = () => {
    updateUser({
      name,
      profileImage,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout isLoggedIn={true}>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="Manage Your Account">My Account</AnimatedTitle>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="keys">
                <Key className="mr-2 h-4 w-4" />
                Keys
              </TabsTrigger>
              <TabsTrigger value="encrypted">
                <Lock className="mr-2 h-4 w-4" />
                Encrypted
              </TabsTrigger>
              <TabsTrigger value="decrypted">
                <MessageSquare className="mr-2 h-4 w-4" />
                Decrypted
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <GlassCard className="mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="mt-2 opacity-70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value="••••••••"
                        disabled
                        className="mt-2 opacity-70"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={handleUpdateProfile}>
                        Update Profile
                      </Button>
                      <Button variant="destructive" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="keys">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-6">Your Saved Keys</h3>

                {keys.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't generated any keys yet.
                    </p>
                    <Button asChild>
                      <a href={`${BASE_PATH}key-generation`}>Generate Keys</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {keys.map((key) => (
                      <Card key={key.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{key.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created:{" "}
                              {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="grid gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">
                              Public Key
                            </h5>
                            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-white/80 overflow-x-auto max-h-32 overflow-y-auto break-all">
                              {key.publicKey.split("\n").map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">
                              Private Key
                            </h5>
                            <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-white/80 overflow-x-auto max-h-32 overflow-y-auto break-all">
                              {key.privateKey.split("\n").map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="encrypted">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-6">
                  Encrypted Messages
                </h3>

                {encryptedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't encrypted any messages yet.
                    </p>
                    <Button asChild>
                      <a href={`${BASE_PATH}encryption`}>Encrypt Message</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {encryptedMessages.map((message) => (
                      <Card key={message.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Encrypted on:{" "}
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-white/80 overflow-x-auto">
                          {message.content}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="decrypted">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-6">
                  Decrypted Messages
                </h3>

                {decryptedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't decrypted any messages yet.
                    </p>
                    <Button asChild>
                      <a href={`${BASE_PATH}decryption`}>Decrypt Message</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {decryptedMessages.map((message) => (
                      <Card key={message.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Decrypted on:{" "}
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="bg-black/30 p-3 rounded-md font-mono text-xs text-white/80 overflow-x-auto">
                          {message.content}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
