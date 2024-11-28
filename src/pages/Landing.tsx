import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AtSign,
  ThumbsUp,
  Shield,
  Truck,
  ArrowUp,
  Activity,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthSupabase";
import { useEffect } from "react";

export default function Home() {
  const { session, signInWithGithub } = useAuthStore();
  const features = [
    {
      icon: ThumbsUp,
      title: "Feature One",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
    {
      icon: Shield,
      title: "Feature Two",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
    {
      icon: Truck,
      title: "Feature Three",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
    {
      icon: ArrowUp,
      title: "Feature Four",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
    {
      icon: MapPin,
      title: "Feature Five",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
    {
      icon: Activity,
      title: "Feature Six",
      description:
        "Describe what this feature does, and how it benefits your customers.",
    },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (session) {
      navigate("/app");
    }
  },[])

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AtSign className="h-6 w-6" />
            <span className="text-xl font-medium">JobTracker</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-gray-500 hover:text-gray-700">
              Features
            </Link>
            <Link to="#pricing" className="text-gray-500 hover:text-gray-700">
              Pricing
            </Link>
            <Link to="#blog" className="text-gray-500 hover:text-gray-700">
              Blog
            </Link>
            <Link to="#pages" className="text-gray-500 hover:text-gray-700">
              Pages
            </Link>
            <Link to="#help" className="text-gray-500 hover:text-gray-700">
              Help
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
                Sign Up
              </Button>
            </Link>

            <Link
              to="/auth"
              className="hidden border-2 border-gray-700 md:inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
            >
              Log In
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold tracking-tight text-gray-800">
                Job Hunt Efficiently
              </h1>
              <p className="text-xl text-gray-500 max-w-lg">
                Supporting statement for your product's tagline. This text
                should communicate your unique selling proposition to the
                reader.
              </p>
              <Button className="h-12 px-8 text-base bg-gray-700 hover:bg-gray-600">
                START YOUR FREE TRIAL
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg border bg-gray-50/50">
              <div className="absolute top-2 left-3 flex space-x-1">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-2" />

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="bg-white py-4 border-t border-gray-300">
          <div className="container mx-auto px-4">
            <div className="mt-4 text-center text-gray-500">
              <p className="mb-2">Ward No - 18, Bargarh, India</p>
              <p>
                &copy; {new Date().getFullYear()} JobTracker Inc. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
