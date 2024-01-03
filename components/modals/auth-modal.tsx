import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { UserAuth } from "@/providers/auth-provider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GoogleSvg, AppleSvg } from "@/lib/icons";

export default function AuthModal() {
  const { user, googleSignIn } = UserAuth();

  const handleSignIn = () => {
    try {
      googleSignIn();
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <p className="text-accent hover:cursor-pointer">Sign In</p>
        </DialogTrigger>
        <DialogContent>
          <div className="w-full h-64 flex flex-col items-center justify-center gap-20">
            <div>
              <h1 className="w-full font-bold text-2xl max-w-sm text-center">
                Continue with Authentication
              </h1>
              <p className="w-full max-w-sm text-center">Sign In or Sign Up</p>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSignIn}
                className="w-full"
              >
                <GoogleSvg />
                <span className="ml-1">Continue with Google</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  console.error(
                    "I don't have an Apple Developer account. Sign in with Google"
                  )
                }
                className="w-full"
                disabled
              >
                <AppleSvg />
                <span className="ml-1">Sign in with Apple</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
