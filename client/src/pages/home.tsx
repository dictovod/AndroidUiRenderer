import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AndroidContainer from "@/components/android-viewer/container";
import type { AndroidUi } from "@shared/schema";
import { Upload } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [parsedUi, setParsedUi] = useState<AndroidUi | null>(null);

  const parseXmlMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/parse-xml", { xmlContent: content });
      return res.json();
    },
    onSuccess: (data: AndroidUi) => {
      setParsedUi(data);
      toast({
        title: "Success",
        description: "XML file parsed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setXmlFile(file);
    }
  };

  const handleUpload = async () => {
    if (!xmlFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        // Очищаем содержимое от лишних символов
        const cleanContent = content
          .replace(/\\n/g, '')
          .replace(/\\"/g, '"')
          .trim();
        parseXmlMutation.mutate(cleanContent);
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file: " + reader.error?.message,
          variant: "destructive",
        });
      };
      reader.readAsText(xmlFile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Android UI Visualizer</h1>
          <p className="text-muted-foreground">
            Upload your window_dump.xml file to visualize the Android UI layout
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload XML File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="file"
                accept=".xml,text/xml"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                onClick={handleUpload}
                disabled={!xmlFile || parseXmlMutation.isPending}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        {parsedUi && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <AndroidContainer ui={parsedUi} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}