"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, Option } from "@/components/ui/multi-select";

export default function TeamRegistrationForm() {
  const [students, setStudents] = useState<Option[]>([]);
  const [challenges, setChallenges] = useState<{ id: string; name: string; abbreviation: string }[]>([]);
  
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resStudents, resChallenges] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/challenges")
        ]);
        
        if (resStudents.ok) {
          const data = await resStudents.json();
          setStudents((data.students || []).map((s: any) => ({ label: s.name, value: s.id })));
        }
        
        if (resChallenges.ok) {
          const data = await resChallenges.json();
          setChallenges(data.challenges || []);
        }
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || selectedStudents.length === 0 || !selectedChallengeId || !projectName) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          studentIds: selectedStudents,
          challengeId: selectedChallengeId,
          projectName,
          projectDescription
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Team registered! Group Number: ${data.groupNumber}`);
        
        // Reset form
        setTeamName("");
        setSelectedStudents([]);
        setProjectName("");
        setSelectedChallengeId("");
        setProjectDescription("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to register team");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8 text-gray-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  const selectedChallenge = challenges.find(c => c.id === selectedChallengeId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-gray-300">Students <span className="text-red-400">*</span></Label>
        <MultiSelect
          options={students}
          selected={selectedStudents}
          onChange={setSelectedStudents}
          placeholder="Select students..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Team Name <span className="text-red-400">*</span></Label>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Awesome Team"
          required
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Challenge <span className="text-red-400">*</span></Label>
        <Select value={selectedChallengeId} onValueChange={(val) => setSelectedChallengeId(val || "")} required>
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500">
            <SelectValue placeholder="Select a challenge">
              {selectedChallenge?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/10 text-white">
            {challenges.map((c) => (
              <SelectItem key={c.id} value={c.id} className="focus:bg-indigo-600 focus:text-white">{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedChallenge && (
          <p className="text-xs text-indigo-300 mt-1">
            Your Group Number will be auto-generated with prefix: <strong>{selectedChallenge.abbreviation}</strong>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Project Name <span className="text-red-400">*</span></Label>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project X"
          required
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Project Description</Label>
        <Textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Describe your project..."
          className="bg-white/5 border-white/10 text-white min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !teamName || selectedStudents.length === 0 || !selectedChallengeId || !projectName}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Register Team"}
      </Button>
    </form>
  );
}
