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
import { GROQ_MODEL_AUTO, GROQ_MODELS } from "@/lib/editable/groq-models";
import { DEFAULT_KEYCHAIN, loadKeychain, saveKeychain, type Keychain } from "@/lib/editable/keys";
import { toast } from "sonner";

const CUSTOM_ID = "custom";

function modelSelectValue(model: string) {
  if (!model || model === GROQ_MODEL_AUTO) return GROQ_MODEL_AUTO;
  return GROQ_MODELS.some((m) => m.id === model) ? model : CUSTOM_ID;
}

export function KeysDialog() {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<Keychain>(DEFAULT_KEYCHAIN);
  const [customModel, setCustomModel] = useState("");

  useEffect(() => {
    if (!open) return;
    const loaded = loadKeychain();
    setKeys(loaded);
    setCustomModel(modelSelectValue(loaded.groqModel) === CUSTOM_ID ? loaded.groqModel : "");
  }, [open]);

  const selectValue = modelSelectValue(keys.groqModel);
  const selectedMeta = GROQ_MODELS.find((m) => m.id === (selectValue === CUSTOM_ID ? GROQ_MODEL_AUTO : selectValue));

  function save() {
    const groqModel =
      selectValue === CUSTOM_ID
        ? customModel.trim() || GROQ_MODEL_AUTO
        : keys.groqModel.trim() || GROQ_MODEL_AUTO;
    saveKeychain({
      groqKey: keys.groqKey.trim(),
      groqModel,
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
            Stored only in this browser. Groq compiles storyboards on the free plan — pick any model, or leave Auto
            to fall through retired / rate-limited ones. A GitHub PAT with repo scope syncs blueprints.
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
            <Label htmlFor="model">Groq model</Label>
            <select
              id="model"
              className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              value={selectValue}
              onChange={(e) => {
                const next = e.target.value;
                if (next === CUSTOM_ID) {
                  setKeys({ ...keys, groqModel: customModel || CUSTOM_ID });
                  return;
                }
                setKeys({ ...keys, groqModel: next });
              }}
            >
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
              <option value={CUSTOM_ID}>Custom model id</option>
            </select>
            {selectValue === CUSTOM_ID ? (
              <Input
                aria-label="Custom Groq model id"
                placeholder="provider/model-id"
                value={customModel}
                onChange={(e) => {
                  setCustomModel(e.target.value);
                  setKeys({ ...keys, groqModel: e.target.value });
                }}
              />
            ) : (
              <p className="text-xs text-subtle">{selectedMeta?.note}</p>
            )}
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
