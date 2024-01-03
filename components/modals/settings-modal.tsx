import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { UserAuth } from "@/providers/auth-provider";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";

export default function SettingsModal() {
  const { user, logOut, deleteAccount } = UserAuth();
  const [restricted, setRestricted] = useState(false);

  function checkRestrictedMode() {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then((userDocSnap) => {
      if (userDocSnap.exists()) {
        setRestricted(userDocSnap.data()!.restrictedMode);
      }
    });
  }
  useEffect(() => {
    checkRestrictedMode();
  });
  const handleSignOut = () => {
    try {
      logOut();
      toast.success("Sign out successfully");
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong when logging out.");
    }
  };

  const changeRestrictionMode = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        restrictedMode: !restricted,
      });
      setRestricted(!restricted);
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong while changing restricted mode");
    }
  };

  const handleAccountDeletion = () => {
    try {
      deleteAccount();
      toast.success("Account deleted successfully");
    } catch (error) {
      // console.log(error);
      toast.error("Something went wrong on deleting account");
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Avatar className="cursor-pointer w-9 h-9">
            <AvatarImage src={user?.photoURL} alt="Profile Photo" />
            <AvatarFallback>{user?.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="font-semibold text-xl text-neutral-300">
                Account Settings
              </h1>
              <div className="w-full flex items-center justify-between">
                <p>Name</p>
                <p className="text-accent">{user?.displayName}</p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>Email</p>
                <p className="text-accent">{user?.email}</p>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>Sign Out</p>
                <Button
                  variant="outline"
                  className="w-32 hover:bg-secondary"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
              <div className="w-full flex items-center justify-between">
                <p>Delete Account</p>
                <Button
                  variant="outline"
                  className="w-32 hover:bg-destructive"
                  onClick={handleAccountDeletion}
                >
                  Delete
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h1 className="font-semibold text-xl text-neutral-300">
                Content Restriction
              </h1>
              <div className="w-full flex items-center justify-between">
                <p>Restricted Mode</p>
                <Switch
                  checked={restricted}
                  onCheckedChange={changeRestrictionMode}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
