import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { GoogleIcon } from "./google-icon";
import { useAuthStore } from "@/store/AuthSupabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthComponent() {
  const { session, signInWithGithub } = useAuthStore();
  const navigator = useNavigate();
  useEffect(() => {
    if (session) {
      navigator("/app");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign up or Log in
          </CardTitle>
          <CardDescription className="text-center">
            Choose your preferred method to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
              onClick={() => console.log("Google OAuth")}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-gray-700 text-white hover:bg-gray-600"
              onClick={signInWithGithub}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
