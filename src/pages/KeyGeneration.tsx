import React, { useState } from "react";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  generateKeyPair,
  generateKeyPairFromPrimes,
  formatPublicKey,
  formatPrivateKey,
} from "@/utils/rsaUtils";
import { KeyPair } from "@/types";
import { Save, RefreshCw, AlertCircle } from "lucide-react";
import CopyButton from "@/components/CopyButton";

const KeyGeneration = () => {
  const { isAuthenticated } = useAuth();
  const { addKey } = useData();
  const { toast } = useToast();

  const [keyName, setKeyName] = useState("");
  const [keyBits, setKeyBits] = useState("1024");
  const [primeP, setPrimeP] = useState("");
  const [primeQ, setQrimeQ] = useState("");
  const [generatedKeys, setGeneratedKeys] = useState<null | {
    publicKey: string;
    privateKey: string;
  }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState(0);

  // Web worker for key generation
  const generateKeysInBackground = (bits: number) => {
    return new Promise<KeyPair>((resolve, reject) => {
      // Show 25% progress - initialization
      setProgressStage(25);

      try {
        setTimeout(() => {
          try {
            // Show 50% progress - generating prime p
            setProgressStage(50);

            // Use setTimeout to give UI time to update
            setTimeout(() => {
              try {
                // Generate keys
                const keys = generateKeyPair(bits);

                // Show 100% progress - complete
                setProgressStage(100);
                resolve(keys);
              } catch (error) {
                reject(error);
              }
            }, 10);
          } catch (error) {
            reject(error);
          }
        }, 10);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleRandomGeneration = async () => {
    try {
      setIsGenerating(true);
      setProgressStage(0);

      toast({
        title: "Generating keys",
        description: `Generating ${keyBits}-bit keys, this may take a moment...`,
      });

      // Reset progress
      setProgressStage(10);

      // Generate keys in the background
      generateKeysInBackground(parseInt(keyBits))
        .then((keys) => {
          setGeneratedKeys({
            publicKey: formatPublicKey(keys.publicKey),
            privateKey: formatPrivateKey(keys.privateKey),
          });

          toast({
            title: "Keys generated",
            description: "Your RSA keys have been successfully generated",
          });
          setIsGenerating(false);
        })
        .catch((error) => {
          console.error("Key generation error:", error);
          toast({
            title: "Generation failed",
            description:
              error instanceof Error
                ? error.message
                : "An error occurred while generating keys",
            variant: "destructive",
          });
          setIsGenerating(false);
        });
    } catch (error) {
      console.error("Key generation error:", error);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating keys",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleManualGeneration = async () => {
    if (!primeP || !primeQ) {
      toast({
        title: "Validation error",
        description: "Please enter both prime numbers",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setProgressStage(25);

      setTimeout(() => {
        try {
          const p = BigInt(primeP);
          const q = BigInt(primeQ);

          setProgressStage(75);

          setTimeout(() => {
            try {
              const keys = generateKeyPairFromPrimes(p, q);

              setProgressStage(100);

              setGeneratedKeys({
                publicKey: formatPublicKey(keys.publicKey),
                privateKey: formatPrivateKey(keys.privateKey),
              });

              toast({
                title: "Keys generated",
                description: "Your RSA keys have been successfully generated",
              });
              setIsGenerating(false);
            } catch (error) {
              console.error("Key generation error:", error);
              toast({
                title: "Generation failed",
                description:
                  error instanceof Error
                    ? error.message
                    : "Failed to generate keys from provided numbers",
                variant: "destructive",
              });
              setIsGenerating(false);
            }
          }, 10);
        } catch (error) {
          console.error("Key generation error:", error);
          toast({
            title: "Generation failed",
            description:
              error instanceof Error
                ? error.message
                : "Failed to generate keys from provided numbers",
            variant: "destructive",
          });
          setIsGenerating(false);
        }
      }, 10);
    } catch (error) {
      console.error("Key generation error:", error);
      toast({
        title: "Generation failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate keys from provided numbers",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleSaveKeys = () => {
    if (!generatedKeys) {
      toast({
        title: "No keys to save",
        description: "Please generate keys first",
        variant: "destructive",
      });
      return;
    }

    if (!keyName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your keys",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save keys",
        variant: "destructive",
      });
      return;
    }

    addKey({
      name: keyName,
      publicKey: generatedKeys.publicKey,
      privateKey: generatedKeys.privateKey,
    });

    toast({
      title: "Keys saved",
      description: "Your keys have been saved successfully",
    });

    // Reset form
    setKeyName("");
    setGeneratedKeys(null);
  };

  return (
    <Layout isLoggedIn={isAuthenticated}>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="Create Your RSA Keys">
          Key Generation
        </AnimatedTitle>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="random" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="random">Random Generation</TabsTrigger>
              <TabsTrigger value="manual">Manual Generation</TabsTrigger>
            </TabsList>

            <TabsContent value="random">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Generate Random RSA Keys
                </h3>
                <p className="text-white/70 mb-6">
                  Generate a secure RSA key pair with random prime numbers.
                  Choose your desired key length for appropriate security.
                </p>

                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="keyBits">Key Length (bits)</Label>
                    <Select value={keyBits} onValueChange={setKeyBits}>
                      <SelectTrigger id="keyBits" className="mt-2">
                        <SelectValue placeholder="Select key length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">
                          512 bits (minimum security)
                        </SelectItem>
                        <SelectItem value="1024">
                          1024 bits (recommended)
                        </SelectItem>
                        <SelectItem value="2048">
                          2048 bits (high security)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {parseInt(keyBits) > 2048 && (
                      <p className="text-amber-400 text-sm mt-2">
                        Note: Generating keys larger than 2048 bits may take
                        more time.
                      </p>
                    )}
                  </div>

                  {isGenerating && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Generating...</span>
                        <span>{progressStage}%</span>
                      </div>
                      <Progress value={progressStage} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={handleRandomGeneration}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Keys"
                    )}
                  </Button>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="manual">
              <GlassCard className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Generate Keys from Prime Numbers
                </h3>
                <p className="text-white/70 mb-6">
                  Enter two prime numbers to generate your RSA key pair. Larger
                  primes create more secure keys.
                </p>

                <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <p className="text-sm text-amber-200">
                    Make sure to use large prime numbers for security. Small
                    numbers are for educational purposes only.
                  </p>
                </div>

                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="primeP">First Prime Number (p)</Label>
                    <Input
                      id="primeP"
                      type="text"
                      value={primeP}
                      onChange={(e) => setPrimeP(e.target.value)}
                      placeholder="Enter first prime number"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="primeQ">Second Prime Number (q)</Label>
                    <Input
                      id="primeQ"
                      type="text"
                      value={primeQ}
                      onChange={(e) => setQrimeQ(e.target.value)}
                      placeholder="Enter second prime number"
                      className="mt-2"
                    />
                  </div>

                  {isGenerating && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Generating...</span>
                        <span>{progressStage}%</span>
                      </div>
                      <Progress value={progressStage} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={handleManualGeneration}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Keys"
                    )}
                  </Button>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>

          {generatedKeys && (
            <GlassCard variant="neo" className="mb-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Generated Keys</h3>

              <div className="mb-6">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Enter a name for this key pair"
                  className="mt-2"
                />
              </div>

              <div className="grid gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Public Key</Label>
                    <CopyButton text={generatedKeys.publicKey} />
                  </div>
                  <div className="bg-black/30 p-4 rounded-md font-mono text-sm text-white/80 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap break-all">
                    {generatedKeys.publicKey.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Private Key</Label>
                    <CopyButton text={generatedKeys.privateKey} />
                  </div>
                  <div className="bg-black/30 p-4 rounded-md font-mono text-sm text-white/80 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap break-all">
                    {generatedKeys.privateKey.split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveKeys}
                variant="primary"
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Keys
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KeyGeneration;
