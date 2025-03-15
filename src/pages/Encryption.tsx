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
import { useToast } from "@/hooks/use-toast";
import { encrypt, parsePublicKey } from "@/utils/rsaUtils";
import { Link } from "react-router-dom";
import { Save, Lock, KeyRound, AlertCircle } from "lucide-react";

const Encryption = () => {
  const { isAuthenticated } = useAuth();
  const { keys, addMessage } = useData();
  const { toast } = useToast();

  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleEncrypt = async () => {
    if (!message) {
      toast({
        title: "Empty message",
        description: "Please enter a message to encrypt",
        variant: "destructive",
      });
      return;
    }

    if (!selectedKeyId) {
      toast({
        title: "No key selected",
        description: "Please select a key for encryption",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEncrypting(true);

      // Get the selected key
      const selectedKey = keys.find((key) => key.id === selectedKeyId);
      if (!selectedKey) throw new Error("Key not found");

      // Parse the public key
      const publicKey = parsePublicKey(selectedKey.publicKey);

      // Simulate delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Encrypt the message
      const encrypted = encrypt(message, publicKey);
      setEncryptedMessage(encrypted);

      toast({
        title: "Encryption successful",
        description: "Your message has been encrypted",
      });
    } catch (error) {
      console.error("Encryption error:", error);
      toast({
        title: "Encryption failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during encryption",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleSaveMessage = () => {
    if (!encryptedMessage) {
      toast({
        title: "No encrypted message",
        description: "Please encrypt a message first",
        variant: "destructive",
      });
      return;
    }

    addMessage({
      content: encryptedMessage,
      keyId: selectedKeyId,
      type: "encrypted",
    });

    // Reset the form
    setMessage("");
    setEncryptedMessage(null);
    setSelectedKeyId("");
  };

  return (
    <Layout isLoggedIn={isAuthenticated}>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="Secure Your Messages">
          Encryption
        </AnimatedTitle>

        <div className="max-w-4xl mx-auto">
          {!isAuthenticated && (
            <GlassCard className="mb-8 border-amber-500/30">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-amber-200">
                    Authentication Required
                  </h3>
                  <p className="text-white/70 mb-4">
                    You need to be signed in to access your saved keys and save
                    encrypted messages.
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
                    You don't have any RSA keys saved. Please generate or add a
                    key first.
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
              <h3 className="text-xl font-semibold mb-4">Encrypt a Message</h3>
              <p className="text-white/70 mb-6">
                Choose one of your saved public keys to encrypt a message. The
                encrypted message can only be decrypted with the corresponding
                private key.
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
                  <Label htmlFor="message">Message to Encrypt</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here"
                    className="mt-2 h-32"
                  />
                </div>

                <Button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !selectedKeyId || !message}
                  variant="primary"
                  className="w-full"
                >
                  {isEncrypting ? "Encrypting..." : "Encrypt Message"}
                </Button>
              </div>
            </GlassCard>
          )}

          {encryptedMessage && (
            <GlassCard variant="neo" className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Encrypted Message</h3>
              </div>

              <div className="bg-black/30 p-4 rounded-md font-mono text-sm text-white/80 overflow-x-auto mb-6 max-h-64 overflow-y-auto">
                {encryptedMessage}
              </div>

              {isAuthenticated && (
                <Button
                  onClick={handleSaveMessage}
                  variant="primary"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Encrypted Message
                </Button>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Encryption;
