import React, { useState } from "react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { decrypt, parsePrivateKey } from "@/utils/rsaUtils";
import { Link } from "react-router-dom";
import { Save, Unlock, KeyRound, AlertCircle } from "lucide-react";

const Decryption = () => {
  const { isAuthenticated } = useAuth();
  const { keys, addMessage } = useData();
  const { toast } = useToast();

  // For decrypting with saved keys
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [encryptedMessage, setEncryptedMessage] = useState("");

  // For decrypting with custom key
  const [privateKeyD, setPrivateKeyD] = useState("");
  const [privateKeyN, setPrivateKeyN] = useState("");
  const [customEncryptedMessage, setCustomEncryptedMessage] = useState("");

  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecryptWithSavedKey = async () => {
    if (!encryptedMessage) {
      toast({
        title: "Empty message",
        description: "Please enter an encrypted message to decrypt",
        variant: "destructive",
      });
      return;
    }

    if (!selectedKeyId) {
      toast({
        title: "No key selected",
        description: "Please select a key for decryption",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDecrypting(true);

      // Get the selected key
      const selectedKey = keys.find((key) => key.id === selectedKeyId);
      if (!selectedKey) throw new Error("Key not found");

      // Parse the private key
      const privateKey = parsePrivateKey(selectedKey.privateKey);

      // Simulate delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Decrypt the message
      const decrypted = decrypt(encryptedMessage, privateKey);
      setDecryptedMessage(decrypted);

      toast({
        title: "Decryption successful",
        description: "Your message has been decrypted",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Decryption failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during decryption",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDecryptWithCustomKey = async () => {
    if (!customEncryptedMessage) {
      toast({
        title: "Empty message",
        description: "Please enter an encrypted message to decrypt",
        variant: "destructive",
      });
      return;
    }

    if (!privateKeyD || !privateKeyN) {
      toast({
        title: "Incomplete key information",
        description: "Please enter both d and n values for the private key",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDecrypting(true);

      // Create private key from inputs
      const privateKey = {
        d: BigInt(privateKeyD),
        n: BigInt(privateKeyN),
      };

      // Simulate delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Decrypt the message
      const decrypted = decrypt(customEncryptedMessage, privateKey);
      setDecryptedMessage(decrypted);

      toast({
        title: "Decryption successful",
        description: "Your message has been decrypted",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Decryption failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during decryption",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleSaveMessage = () => {
    if (!decryptedMessage) {
      toast({
        title: "No decrypted message",
        description: "Please decrypt a message first",
        variant: "destructive",
      });
      return;
    }

    addMessage({
      content: decryptedMessage,
      keyId: selectedKeyId,
      type: "decrypted",
    });

    // Reset the form
    setEncryptedMessage("");
    setCustomEncryptedMessage("");
    setDecryptedMessage(null);
    setSelectedKeyId("");
    setPrivateKeyD("");
    setPrivateKeyN("");
  };

  return (
    <Layout isLoggedIn={isAuthenticated}>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="Reveal Encrypted Content">
          Decryption
        </AnimatedTitle>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="saved">Use Saved Keys</TabsTrigger>
              <TabsTrigger value="custom">Use Custom Key</TabsTrigger>
            </TabsList>

            <TabsContent value="saved">
              {!isAuthenticated && (
                <GlassCard className="mb-8 border-amber-500/30">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-amber-200">
                        Authentication Required
                      </h3>
                      <p className="text-white/70 mb-4">
                        You need to be signed in to access your saved keys and
                        save decrypted messages.
                      </p>
                      <Button
                        asChild
                        variant="primary"
                        className="px-4 py-2 rounded-md"
                      >
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {isAuthenticated && keys.length === 0 && (
                <GlassCard className="mb-8 border-amber-500/30">
                  <div className="flex items-start gap-4">
                    <KeyRound className="h-6 w-6 text-amber-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-amber-200">
                        No Keys Available
                      </h3>
                      <p className="text-white/70 mb-4">
                        You don't have any RSA keys saved. Please generate or
                        add a key first.
                      </p>
                      <Button
                        asChild
                        variant="primary"
                        className="px-4 py-2 rounded-md"
                      >
                        <Link to="/key-generation">Generate Keys</Link>
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {isAuthenticated && keys.length > 0 && (
                <GlassCard className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Decrypt with Saved Key
                  </h3>
                  <p className="text-white/70 mb-6">
                    Choose one of your saved keys to decrypt a message. You need
                    the private key that corresponds to the public key used for
                    encryption.
                  </p>

                  <div className="grid gap-6 mb-6">
                    <div>
                      <Label htmlFor="keySelect">Select Key</Label>
                      <Select
                        value={selectedKeyId}
                        onValueChange={setSelectedKeyId}
                      >
                        <SelectTrigger id="keySelect" className="mt-2">
                          <SelectValue placeholder="Choose a key" />
                        </SelectTrigger>
                        <SelectContent>
                          {keys.map((key) => (
                            <SelectItem key={key.id} value={key.id}>
                              {key.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="encryptedMessage">
                        Encrypted Message
                      </Label>
                      <Textarea
                        id="encryptedMessage"
                        value={encryptedMessage}
                        onChange={(e) => setEncryptedMessage(e.target.value)}
                        placeholder="Paste the encrypted message here"
                        className="mt-2 h-32"
                      />
                    </div>

                    <Button
                      onClick={handleDecryptWithSavedKey}
                      disabled={
                        isDecrypting || !selectedKeyId || !encryptedMessage
                      }
                      variant="primary"
                      className="w-full"
                    >
                      {isDecrypting ? "Decrypting..." : "Decrypt Message"}
                    </Button>
                  </div>
                </GlassCard>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Decrypt with Custom Key
                </h3>
                <p className="text-white/70 mb-6">
                  Use this option if you have the private key parameters but
                  haven't saved the key to your account.
                </p>

                <div className="grid gap-6 mb-6">
                  <div>
                    <Label htmlFor="privateKeyD">Private Key (d)</Label>
                    <Input
                      id="privateKeyD"
                      value={privateKeyD}
                      onChange={(e) => setPrivateKeyD(e.target.value)}
                      placeholder="Enter the d value"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="privateKeyN">Private Key (n)</Label>
                    <Input
                      id="privateKeyN"
                      value={privateKeyN}
                      onChange={(e) => setPrivateKeyN(e.target.value)}
                      placeholder="Enter the n value"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customEncryptedMessage">
                      Encrypted Message
                    </Label>
                    <Textarea
                      id="customEncryptedMessage"
                      value={customEncryptedMessage}
                      onChange={(e) =>
                        setCustomEncryptedMessage(e.target.value)
                      }
                      placeholder="Paste the encrypted message here"
                      className="mt-2 h-32"
                    />
                  </div>

                  <Button
                    onClick={handleDecryptWithCustomKey}
                    disabled={
                      isDecrypting ||
                      !privateKeyD ||
                      !privateKeyN ||
                      !customEncryptedMessage
                    }
                    variant="primary"
                    className="w-full"
                  >
                    {isDecrypting ? "Decrypting..." : "Decrypt Message"}
                  </Button>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          {decryptedMessage && (
            <GlassCard variant="neo" className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Unlock className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Decrypted Message</h3>
              </div>

              <div className="bg-black/30 p-4 rounded-md font-mono text-sm text-white/80 overflow-x-auto mb-6 max-h-64 overflow-y-auto">
                {decryptedMessage}
              </div>

              {isAuthenticated && (
                <Button
                  onClick={handleSaveMessage}
                  variant="primary"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Decrypted Message
                </Button>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Decryption;
