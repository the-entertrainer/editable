import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_KEYCHAIN, loadKeychain, saveKeychain, type Keychain } from "@/lib/editable/keys";
import { toast } from "sonner";

export function KeysDialog() {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<Keychain>(DEFAULT_KEYCHAIN);

  useEffect(() => {
    if (open) setKeys(loadKeychain());
  }, [open]);

  function save() {
    saveKeychain({
      groqKey: keys.groqKey.trim(),
      githubPat: keys.githubPat.trim(),
      githubOwner: keys.githubOwner.trim() || DEFAULT_KEYCHAIN.githubOwner,
      githubRepo: keys.githubRepo.trim() || DEFAULT_KEYCHAIN.githubRepo,
    });
    toast.success("Keys saved on this device");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound />
          Keys
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keys</DialogTitle>
          <DialogDescription>
            Stored only in this browser. Groq compiles storyboards. A GitHub PAT with repo scope syncs blueprints
            into the-entertrainer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="groq">Groq API key</Label>
            <Input
              id="groq"
              type="password"
              autoComplete="off"
              placeholder="gsk_…"
              value={keys.groqKey}
              onChange={(e) => setKeys({ ...keys, groqKey: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pat">GitHub personal access token</Label>
            <Input
              id="pat"
              type="password"
              autoComplete="off"
              placeholder="github_pat_… or ghp_…"
              value={keys.githubPat}
              onChange={(e) => setKeys({ ...keys, githubPat: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={keys.githubOwner}
                onChange={(e) => setKeys({ ...keys, githubOwner: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repo">Repository</Label>
              <Input
                id="repo"
                value={keys.githubRepo}
                onChange={(e) => setKeys({ ...keys, githubRepo: e.target.value })}
              />
            </div>
          </div>
          <Button className="w-full" onClick={save}>
            Save on this device
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
