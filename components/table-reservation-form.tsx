"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TableReservationForm() {
  const [teams, setTeams] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resTeams, resTables, resChallenges] = await Promise.all([
          fetch("/api/teams"),
          fetch("/api/tables"),
          fetch("/api/challenges")
        ]);
        
        if (resTeams.ok) setTeams((await resTeams.json()).teams || []);
        if (resTables.ok) setTables((await resTables.json()).tables || []);
        if (resChallenges.ok) setChallenges((await resChallenges.json()).challenges || []);
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId), [teams, selectedTeamId]);
  
  const teamChallengeName = useMemo(() => {
    if (!selectedTeam || !selectedTeam.challenge || selectedTeam.challenge.length === 0) return "N/A";
    const cId = selectedTeam.challenge[0];
    return challenges.find(c => c.id === cId)?.name || "Unknown";
  }, [selectedTeam, challenges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !selectedTableId) {
      toast.error("Please select a team and a table.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/table-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: selectedTeamId,
          tableId: selectedTableId,
        }),
      });

      if (res.ok) {
        toast.success("Table reserved successfully!");
        setSelectedTeamId("");
        setSelectedTableId("");
        // Reload tables to update availability
        const resTables = await fetch("/api/tables");
        if (resTables.ok) setTables((await resTables.json()).tables || []);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to reserve table");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8 text-gray-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-gray-300">Team</Label>
        <Select value={selectedTeamId} onValueChange={(val) => setSelectedTeamId(val || "")} required>
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500">
            <SelectValue placeholder="Select a team">
              {selectedTeamId ? teams.find(t => t.id === selectedTeamId)?.name : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/10 text-white">
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id} className="focus:bg-indigo-600 focus:text-white">{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTeam && (
        <div className="p-4 bg-white/5 rounded-md border border-white/10 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500 text-xs">Project Name</Label>
              <div className="text-sm text-gray-200">{selectedTeam.project || "N/A"}</div>
            </div>
            <div>
              <Label className="text-gray-500 text-xs">Group Number</Label>
              <div className="text-sm text-gray-200">{selectedTeam.group || "N/A"}</div>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-500 text-xs">Challenge</Label>
              <div className="text-sm text-gray-200">{teamChallengeName}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-gray-300">Table <span className="text-red-400">*</span></Label>
        <Select value={selectedTableId} onValueChange={(val) => setSelectedTableId(val || "")} required disabled={!selectedTeamId}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500">
            <SelectValue placeholder="Select an available table">
              {selectedTableId ? tables.find(t => t.id === selectedTableId)?.name : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-white/10 text-white">
            {tables.filter(t => !t.reserved).map((t) => (
              <SelectItem key={t.id} value={t.id} className="focus:bg-indigo-600 focus:text-white">{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !selectedTeamId || !selectedTableId}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reserving...</> : "Reserve Table"}
      </Button>
    </form>
  );
}
